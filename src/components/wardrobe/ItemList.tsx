"use client";

import type { ItemWithRelations } from "@/lib/types/item";
import { ItemCard } from "@/components/wardrobe/ItemCard";
import { StaggerItem, StaggerList } from "@/components/layout/motion";
import { EmptyState } from "@/components/ui/EmptyState";

type ItemListProps = {
  items: ItemWithRelations[];
};

export function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return <EmptyState message="No items match your filters." />;
  }

  return (
    <StaggerList className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <StaggerItem key={item.id}>
          <ItemCard item={item} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
