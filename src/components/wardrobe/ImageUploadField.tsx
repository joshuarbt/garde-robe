"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { validateImageFile } from "@/lib/storage/image-validation";
import { ItemImage } from "@/components/wardrobe/ItemImage";

export type BackgroundChoice = {
  useProcessed: boolean;
  processedBlob: Blob | null;
};

type ImageUploadFieldProps = {
  currentImageUrl?: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  onBackgroundChoiceChange?: (choice: BackgroundChoice) => void;
  error?: string | null;
};

type DisplayMode = "original" | "processed";

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
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("original");
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const notifyBackgroundChoice = useCallback(
    (useProcessed: boolean, blob: Blob | null) => {
      onBackgroundChoiceChange?.({
        useProcessed,
        processedBlob: blob,
      });
    },
    [onBackgroundChoiceChange],
  );

  const resetBackgroundState = useCallback(() => {
    revokeObjectUrl(processedPreviewUrl);
    setProcessedPreviewUrl(null);
    setProcessedBlob(null);
    setDisplayMode("original");
    setBackgroundError(null);
    notifyBackgroundChoice(false, null);
  }, [notifyBackgroundChoice, processedPreviewUrl]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(previewUrl);
      revokeObjectUrl(processedPreviewUrl);
    };
  }, [previewUrl, processedPreviewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    revokeObjectUrl(previewUrl);
    setPreviewUrl(null);
    resetBackgroundState();

    if (!file) {
      setSelectedFile(null);
      onFileChange(null);
      setLocalError(null);
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setLocalError(validationError);
      setSelectedFile(null);
      onFileChange(null);
      event.target.value = "";
      return;
    }

    setLocalError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
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

  async function handleRemoveBackground() {
    if (!selectedFile || isRemovingBackground || disabled) {
      return;
    }

    setIsRemovingBackground(true);
    setBackgroundError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/images/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Impossible de supprimer l'arrière-plan. Réessayez ou conservez l'original.";

        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) {
            message = payload.error;
          }
        } catch {
          // Keep default message when body is not JSON.
        }

        setBackgroundError(message);
        return;
      }

      const blob = await response.blob();
      revokeObjectUrl(processedPreviewUrl);
      const nextPreviewUrl = URL.createObjectURL(blob);

      setProcessedBlob(blob);
      setProcessedPreviewUrl(nextPreviewUrl);
      setDisplayMode("processed");
      notifyBackgroundChoice(true, blob);
    } catch {
      setBackgroundError(
        "Impossible de supprimer l'arrière-plan. Réessayez ou conservez l'original.",
      );
    } finally {
      setIsRemovingBackground(false);
    }
  }

  const mainPreviewUrl =
    displayMode === "processed" && processedPreviewUrl
      ? processedPreviewUrl
      : previewUrl ?? currentImageUrl ?? null;

  const displayError = error ?? localError;
  const showBackgroundControls = Boolean(selectedFile && previewUrl);
  const controlsDisabled = disabled || isRemovingBackground;

  return (
    <div>
      <label htmlFor="item_image" className="input-label">
        Photo
      </label>
      <div className="mt-2 space-y-3">
        {showBackgroundControls && processedPreviewUrl ? (
          <div className="grid max-w-xs grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <p className="text-overline">Avant</p>
              <ItemImage
                src={previewUrl}
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

        {showBackgroundControls ? (
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

        <input
          ref={inputRef}
          id="item_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={controlsDisabled}
          onChange={handleFileChange}
          className="block w-full text-sm text-[var(--foreground)] file:mr-3 file:border-0 file:bg-[var(--surface-muted)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--foreground)] disabled:opacity-60"
        />
        <p className="text-meta">JPEG, PNG ou WebP. 5 Mo max.</p>
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
