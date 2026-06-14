import type { ImageProcessingStatus, ItemImageProcessingFields } from "@/lib/types/item";
import type { OutfitPreviewItem } from "@/lib/types/outfit";
import { resolveDisplayImagePath } from "@/lib/image-processing/resolve";
import { getItemImageUrl } from "@/lib/storage/images";

type Relation<T> = T | T[] | null;

export type PreviewPlacementRow = {
  item_id: string;
  position_x: number;
  position_y: number;
  scale: number;
  rotation: number;
  z_index: number;
  items: Relation<{
    image_path: string | null;
    processed_image_path: string | null;
    remove_background: boolean;
    image_processing_status: ImageProcessingStatus;
  }>;
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export async function resolvePreviewItems(
  placementRows: PreviewPlacementRow[],
): Promise<OutfitPreviewItem[]> {
  const sorted = [...placementRows].sort((a, b) => a.z_index - b.z_index);
  const previewItems: OutfitPreviewItem[] = [];

  for (const entry of sorted) {
    const item = firstRelation(entry.items);
    if (!item?.image_path && !item?.processed_image_path) {
      continue;
    }

    const displayPath = resolveDisplayImagePath({
      id: "",
      user_id: "",
      image_path: item.image_path,
      processed_image_path: item.processed_image_path,
      remove_background: item.remove_background ?? false,
      image_processing_status: item.image_processing_status ?? "none",
    } satisfies ItemImageProcessingFields);

    if (!displayPath) {
      continue;
    }

    const imageUrl = await getItemImageUrl(displayPath);
    if (!imageUrl) {
      continue;
    }

    previewItems.push({
      itemId: entry.item_id,
      imageUrl,
      x: entry.position_x,
      y: entry.position_y,
      scale: entry.scale,
      rotation: entry.rotation,
      zIndex: entry.z_index,
    });
  }

  return previewItems;
}
