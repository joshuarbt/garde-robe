export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return "L'image doit être au format JPEG, PNG ou WebP.";
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return "L'image doit faire 5 Mo ou moins.";
  }

  return null;
}
