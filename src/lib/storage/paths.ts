export const ITEM_IMAGES_BUCKET = "item-images";

export function getExtensionForMimeType(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

export function buildItemOriginalPath(
  userId: string,
  itemId: string,
  extension: string,
): string {
  return `${userId}/${itemId}/original.${extension}`;
}

export function buildItemProcessedPath(userId: string, itemId: string): string {
  return `${userId}/${itemId}/processed.webp`;
}

export function buildItemFolderPrefix(userId: string, itemId: string): string {
  return `${userId}/${itemId}`;
}
