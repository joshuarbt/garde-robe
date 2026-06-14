"use client";

import { ItemCard } from "@/components/wardrobe/ItemCard";
import { StaggerItem, StaggerList } from "@/components/layout/motion";
import type { ItemWithRelations } from "@/lib/types/item";

type AnimatedItemGridProps = {
  items: ItemWithRelations[];
};

export function AnimatedItemGrid({ items }: AnimatedItemGridProps) {
  return (
    <StaggerList
      as="ul"
      className="grid grid-cols-2 gap-x-4 gap-y-[var(--space-grid-y)] md:grid-cols-3 lg:grid-cols-4"
    >
      {items.map((item, index) => (
        <StaggerItem key={item.id} as="li" index={index}>
          <ItemCard item={item} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
