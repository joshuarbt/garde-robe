"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import {
  fetchImageUrlAsFile,
  removeBackgroundFromFile,
} from "@/lib/images/remove-background-client";
import { compressImageFile, formatFileSize } from "@/lib/images/compress";
import { uploadProcessedItemImage } from "@/lib/storage/upload";
import { validateInputImageFile } from "@/lib/storage/image-validation";
import { completeBackgroundRemoval } from "@/lib/wardrobe/actions";

export type BackgroundChoice = {
  useProcessed: boolean;
  processedBlob: Blob | null;
};

export type RetroactiveBackgroundProps = {
  itemId: string;
  userId: string;
  originalImageUrl: string;
  alreadyProcessed: boolean;
};

type ImageUploadFieldProps = {
  currentImageUrl?: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  onBackgroundChoiceChange?: (choice: BackgroundChoice) => void;
  error?: string | null;
  retroactive?: RetroactiveBackgroundProps;
};

type DisplayMode = "original" | "processed";

type RetroactivePhase = "idle" | "preview" | "applying";

function revokeObjectUrl(url: string | null) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

export function ImageUploadField({
  currentImageUrl,
  disabled = false,
  onFileChange,
  onBackgroundChoiceChange,
  error,
  retroactive,
}: ImageUploadFieldProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("original");
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localApplied, setLocalApplied] = useState(false);
  const [retroactivePhase, setRetroactivePhase] = useState<RetroactivePhase>("idle");
  const [retroactiveSuccess, setRetroactiveSuccess] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionSizeHint, setCompressionSizeHint] = useState<string | null>(null);

  const alreadyProcessed =
    localApplied || (retroactive?.alreadyProcessed ?? false);

  const notifyBackgroundChoice = useCallback(
    (useProcessed: boolean, blob: Blob | null) => {
      onBackgroundChoiceChange?.({
        useProcessed,
        processedBlob: blob,
      });
    },
    [onBackgroundChoiceChange],
  );

  const clearProcessedPreview = useCallback(() => {
    setProcessedPreviewUrl((current) => {
      revokeObjectUrl(current);
      return null;
    });
    setProcessedBlob(null);
    setRetroactivePhase("idle");
  }, []);

  const resetBackgroundState = useCallback(() => {
    clearProcessedPreview();
    setDisplayMode("original");
    setBackgroundError(null);
    notifyBackgroundChoice(false, null);
  }, [clearProcessedPreview, notifyBackgroundChoice]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(previewUrl);
      revokeObjectUrl(processedPreviewUrl);
    };
  }, [previewUrl, processedPreviewUrl]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    revokeObjectUrl(previewUrl);
    setPreviewUrl(null);
    setRetroactiveSuccess(null);
    setCompressionSizeHint(null);
    resetBackgroundState();

    if (!file) {
      setSelectedFile(null);
      onFileChange(null);
      setLocalError(null);
      return;
    }

    const validationError = validateInputImageFile(file);
    if (validationError) {
      setLocalError(validationError);
      setSelectedFile(null);
      onFileChange(null);
      event.target.value = "";
      return;
    }

    setLocalError(null);
    setIsCompressing(true);

    try {
      const compressedFile = await compressImageFile(file);

      if (compressedFile.size < file.size) {
        setCompressionSizeHint(
          `${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`,
        );
      }

      setSelectedFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
      onFileChange(compressedFile);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "Impossible d'optimiser l'image. Réessayez avec une autre photo.",
      );
      setSelectedFile(null);
      onFileChange(null);
      event.target.value = "";
    } finally {
      setIsCompressing(false);
    }
  }

  function selectOriginal() {
    setDisplayMode("original");
    notifyBackgroundChoice(false, processedBlob);
  }

  function selectProcessed() {
    if (!processedBlob) {
      return;
    }

    setDisplayMode("processed");
    notifyBackgroundChoice(true, processedBlob);
  }

  function applyProcessedResult(blob: Blob) {
    setProcessedPreviewUrl((current) => {
      revokeObjectUrl(current);
      return URL.createObjectURL(blob);
    });
    setProcessedBlob(blob);
  }

  async function handleRemoveBackground() {
    if (!selectedFile || isRemovingBackground || disabled) {
      return;
    }

    setIsRemovingBackground(true);
    setBackgroundError(null);
    setRetroactiveSuccess(null);

    const result = await removeBackgroundFromFile(selectedFile);

    if ("error" in result) {
      setBackgroundError(result.error);
      setIsRemovingBackground(false);
      return;
    }

    applyProcessedResult(result.blob);
    setDisplayMode("processed");
    notifyBackgroundChoice(true, result.blob);
    setIsRemovingBackground(false);
  }

  async function handleRetroactiveRemoveBackground() {
    if (
      !retroactive?.originalImageUrl ||
      isRemovingBackground ||
      disabled ||
      alreadyProcessed ||
      selectedFile
    ) {
      return;
    }

    setIsRemovingBackground(true);
    setBackgroundError(null);
    setRetroactiveSuccess(null);

    const fetchResult = await fetchImageUrlAsFile(
      retroactive.originalImageUrl,
      "original.jpg",
    );

    if ("error" in fetchResult) {
      setBackgroundError(fetchResult.error);
      setIsRemovingBackground(false);
      return;
    }

    const result = await removeBackgroundFromFile(fetchResult.file);

    if ("error" in result) {
      setBackgroundError(result.error);
      setIsRemovingBackground(false);
      return;
    }

    applyProcessedResult(result.blob);
    setRetroactivePhase("preview");
    setIsRemovingBackground(false);
  }

  async function handleApplyRetroactive() {
    if (
      !retroactive ||
      !processedBlob ||
      retroactivePhase !== "preview" ||
      disabled
    ) {
      return;
    }

    setRetroactivePhase("applying");
    setBackgroundError(null);

    const uploadResult = await uploadProcessedItemImage(
      processedBlob,
      retroactive.userId,
      retroactive.itemId,
    );

    if ("error" in uploadResult) {
      setBackgroundError(uploadResult.error);
      setRetroactivePhase("preview");
      return;
    }

    const completionResult = await completeBackgroundRemoval(retroactive.itemId);

    if (!completionResult.success) {
      setBackgroundError(completionResult.error);
      setRetroactivePhase("preview");
      return;
    }

    clearProcessedPreview();
    setLocalApplied(true);
    setRetroactiveSuccess("Arrière-plan supprimé et enregistré.");
    router.refresh();
  }

  function handleCancelRetroactive() {
    clearProcessedPreview();
    setBackgroundError(null);
  }

  const mainPreviewUrl =
    displayMode === "processed" && processedPreviewUrl
      ? processedPreviewUrl
      : previewUrl ?? currentImageUrl ?? null;

  const displayError = error ?? localError;
  const showUploadBackgroundControls = Boolean(selectedFile && previewUrl);
  const showRetroactiveControls =
    Boolean(retroactive?.originalImageUrl) && !selectedFile && !alreadyProcessed;
  const isRetroactivePreview =
    (retroactivePhase === "preview" || retroactivePhase === "applying") &&
    Boolean(processedPreviewUrl);
  const showBeforeAfter =
    (showUploadBackgroundControls && processedPreviewUrl) || isRetroactivePreview;

  const beforeImageUrl = isRetroactivePreview
    ? retroactive?.originalImageUrl ?? null
    : previewUrl;

  const controlsDisabled =
    disabled || isRemovingBackground || isCompressing || retroactivePhase === "applying";

  return (
    <div>
      <label htmlFor="item_image" className="input-label">
        Photo
      </label>
      <div className="mt-2 space-y-3">
        {showBeforeAfter ? (
          <div className="grid max-w-xs grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <p className="text-overline">Avant</p>
              <ItemImage
                src={beforeImageUrl}
                alt="Photo originale"
                className="aspect-square w-full border border-[var(--border-subtle)]"
                sizes="160px"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-overline">Après</p>
              <ItemImage
                src={processedPreviewUrl}
                alt="Photo sans arrière-plan"
                className="aspect-square w-full border border-[var(--border-subtle)] bg-[var(--surface-muted)]"
                sizes="160px"
              />
            </div>
          </div>
        ) : (
          <ItemImage
            src={mainPreviewUrl}
            alt="Aperçu du vêtement"
            className="aspect-square w-full max-w-xs border border-[var(--border-subtle)] bg-[var(--surface-muted)]"
            sizes="320px"
          />
        )}

        {showUploadBackgroundControls ? (
          <div className="flex max-w-xs flex-col gap-2">
            <button
              type="button"
              disabled={controlsDisabled}
              onClick={handleRemoveBackground}
              className="btn-secondary w-full disabled:opacity-60"
            >
              {isRemovingBackground ? "Suppression de l'arrière-plan…" : "Supprimer l'arrière-plan"}
            </button>

            {processedPreviewUrl ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-sm border border-[var(--border-hairline)] p-0.5">
                  <button
                    type="button"
                    disabled={controlsDisabled}
                    onClick={selectOriginal}
                    className={`min-h-[var(--touch-min)] rounded-sm px-3 text-xs transition-opacity ${
                      displayMode === "original"
                        ? "bg-[var(--foreground)] text-white"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    disabled={controlsDisabled}
                    onClick={selectProcessed}
                    className={`min-h-[var(--touch-min)] rounded-sm px-3 text-xs transition-opacity ${
                      displayMode === "processed"
                        ? "bg-[var(--foreground)] text-white"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Sans fond
                  </button>
                </div>
                {displayMode === "processed" ? (
                  <button
                    type="button"
                    disabled={controlsDisabled}
                    onClick={selectOriginal}
                    className="btn-ghost text-xs underline-offset-2 hover:underline"
                  >
                    Garder l&apos;original
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {showRetroactiveControls ? (
          <div className="flex max-w-xs flex-col gap-2">
            {isRetroactivePreview ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={controlsDisabled}
                  onClick={handleApplyRetroactive}
                  className="btn-primary w-full disabled:opacity-60 sm:flex-1"
                >
                  {retroactivePhase === "applying" ? "Enregistrement…" : "Appliquer"}
                </button>
                <button
                  type="button"
                  disabled={controlsDisabled}
                  onClick={handleCancelRetroactive}
                  className="btn-ghost w-full disabled:opacity-60 sm:flex-1"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={controlsDisabled}
                onClick={handleRetroactiveRemoveBackground}
                className="btn-secondary w-full disabled:opacity-60"
              >
                {isRemovingBackground ? "Suppression de l'arrière-plan…" : "Supprimer l'arrière-plan"}
              </button>
            )}
          </div>
        ) : null}

        {alreadyProcessed && retroactive && !selectedFile ? (
          <p className="text-meta max-w-xs">Arrière-plan déjà supprimé.</p>
        ) : null}

        {retroactiveSuccess ? (
          <p className="text-meta max-w-xs text-[var(--foreground)]">{retroactiveSuccess}</p>
        ) : null}

        {isCompressing ? (
          <p className="text-meta max-w-xs">Optimisation de l&apos;image…</p>
        ) : null}

        {compressionSizeHint ? (
          <p className="text-meta max-w-xs">{compressionSizeHint}</p>
        ) : null}

        <input
          ref={inputRef}
          id="item_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={controlsDisabled}
          onChange={handleFileChange}
          className="block w-full text-sm text-[var(--foreground)] file:mr-3 file:border-0 file:bg-[var(--surface-muted)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--foreground)] disabled:opacity-60"
        />
        <p className="text-meta">JPEG, PNG ou WebP. 10 Mo max. Optimisation automatique.</p>
      </div>

      {backgroundError ? (
        <p role="alert" className="text-status-error mt-1 text-sm">
          {backgroundError}
        </p>
      ) : null}

      {displayError ? (
        <p className="text-status-error mt-1 text-sm">{displayError}</p>
      ) : null}
    </div>
  );
}
