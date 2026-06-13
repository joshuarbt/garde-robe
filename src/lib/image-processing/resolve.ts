import type { ItemImageProcessingFields } from "@/lib/types/item";

export function resolveDisplayImagePath(
  item: ItemImageProcessingFields,
): string | null {
  if (
    item.remove_background &&
    item.image_processing_status === "completed" &&
    item.processed_image_path
  ) {
    return item.processed_image_path;
  }

  return item.image_path;
}
