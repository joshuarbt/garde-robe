import type { ItemType } from "@/lib/types/item";

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  clothing: "Vêtement",
  accessory: "Accessoire",
  jewelry: "Bijou",
};

export function getItemTypeLabel(type: ItemType): string {
  return ITEM_TYPE_LABELS[type];
}
