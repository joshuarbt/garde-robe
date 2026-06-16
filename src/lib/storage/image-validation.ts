export const MAX_INPUT_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_COMPRESSED_IMAGE_FILE_SIZE = 1.5 * 1024 * 1024;
export const TARGET_COMPRESSED_IMAGE_FILE_SIZE = 1 * 1024 * 1024;

/** @deprecated Use MAX_INPUT_IMAGE_FILE_SIZE */
export const MAX_IMAGE_FILE_SIZE = MAX_INPUT_IMAGE_FILE_SIZE;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

function validateImageType(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return "L'image doit être au format JPEG, PNG ou WebP.";
  }

  return null;
}

export function validateInputImageFile(file: File): string | null {
  const typeError = validateImageType(file);
  if (typeError) {
    return typeError;
  }

  if (file.size > MAX_INPUT_IMAGE_FILE_SIZE) {
    return "L'image doit faire 10 Mo ou moins.";
  }

  return null;
}

export function validateCompressedImageFile(file: File): string | null {
  const typeError = validateImageType(file);
  if (typeError) {
    return typeError;
  }

  if (file.size > MAX_COMPRESSED_IMAGE_FILE_SIZE) {
    return "L'image optimisée est trop volumineuse. Choisissez une photo plus petite.";
  }

  return null;
}

/** Validates file picker input (up to 10 MB). */
export function validateImageFile(file: File): string | null {
  return validateInputImageFile(file);
}
