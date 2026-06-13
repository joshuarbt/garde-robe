import type { ItemWithRelations } from "@/lib/types/item";
import type { WardrobeCanvasItem } from "@/lib/types/outfit";

function hasImageUrl(
  item: ItemWithRelations,
): item is ItemWithRelations & { image_url: string } {
  return Boolean(item.image_url);
}

export function toWardrobeCanvasItems(items: ItemWithRelations[]): WardrobeCanvasItem[] {
  return items.filter(hasImageUrl).map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.image_url,
  }));
}

export function filterPlacementsForWardrobe<T extends { itemId: string }>(
  placements: T[],
  wardrobeItems: WardrobeCanvasItem[],
): T[] {
  const wardrobeIds = new Set(wardrobeItems.map((item) => item.id));
  return placements.filter((placement) => wardrobeIds.has(placement.itemId));
}
