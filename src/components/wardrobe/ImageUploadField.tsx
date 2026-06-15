"use client";

import { useEffect, useRef, useState } from "react";
import { validateImageFile } from "@/lib/storage/image-validation";
import { ItemImage } from "@/components/wardrobe/ItemImage";

type ImageUploadFieldProps = {
  currentImageUrl?: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  error?: string | null;
};

export function ImageUploadField({
  currentImageUrl,
  disabled = false,
  onFileChange,
  error,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (!file) {
      onFileChange(null);
      setLocalError(null);
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setLocalError(validationError);
      onFileChange(null);
      event.target.value = "";
      return;
    }

    setLocalError(null);
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  }

  const displayUrl = previewUrl ?? currentImageUrl ?? null;
  const displayError = error ?? localError;

  return (
    <div>
      <label htmlFor="item_image" className="input-label">
        Photo
      </label>
      <div className="mt-2 space-y-3">
        <ItemImage
          src={displayUrl}
          alt="Aperçu du vêtement"
          className="aspect-square w-full max-w-xs border border-[var(--border-subtle)]"
          sizes="320px"
        />
        <input
          ref={inputRef}
          id="item_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          onChange={handleFileChange}
          className="block w-full text-sm text-[var(--foreground)] file:mr-3 file:border-0 file:bg-[var(--surface-muted)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--foreground)] disabled:opacity-60"
        />
        <p className="text-meta">JPEG, PNG ou WebP. 5 Mo max.</p>
      </div>
      {displayError ? (
        <p className="text-status-error mt-1 text-sm">{displayError}</p>
      ) : null}
    </div>
  );
}
