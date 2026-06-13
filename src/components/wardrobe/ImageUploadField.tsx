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
      <label htmlFor="item_image" className="block text-sm font-medium text-stone-700">
        Photo
      </label>
      <div className="mt-2 space-y-3">
        <ItemImage
          src={displayUrl}
          alt="Item preview"
          className="aspect-square w-full max-w-xs rounded-md border border-stone-200"
          sizes="320px"
        />
        <input
          ref={inputRef}
          id="item_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          onChange={handleFileChange}
          className="block w-full text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-stone-900 hover:file:bg-stone-200 disabled:opacity-60"
        />
        <p className="text-xs text-stone-500">JPEG, PNG, or WebP. Max 5 MB.</p>
      </div>
      {displayError ? (
        <p className="mt-1 text-sm text-red-700">{displayError}</p>
      ) : null}
    </div>
  );
}
