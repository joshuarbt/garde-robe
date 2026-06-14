import type { ItemWithRelations } from "@/lib/types/item";
import { AnimatedItemGrid } from "@/components/wardrobe/AnimatedItemGrid";
import { EmptyState } from "@/components/ui/EmptyState";

type ItemListProps = {
  items: ItemWithRelations[];
};

export function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return <EmptyState message="No items match your filters." />;
  }

  return <AnimatedItemGrid items={items} />;
}
