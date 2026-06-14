"use client";

import type { WardrobeCanvasItem } from "@/lib/types/outfit";
import { EmptyState } from "@/components/ui/EmptyState";

type WardrobeStripProps = {
  items: WardrobeCanvasItem[];
  placedItemIds: Set<string>;
  onAddItem: (item: WardrobeCanvasItem) => void;
};

export function WardrobeStrip({ items, placedItemIds, onAddItem }: WardrobeStripProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        message="No wardrobe items with photos yet."
        actionLabel="Add your first item"
        actionHref="/wardrobe/new"
      />
    );
  }

  return (
    <div className="space-y-2">
      <p className="label-caps">Add from wardrobe</p>
      <ul className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
        {items.map((item) => {
          const isPlaced = placedItemIds.has(item.id);

          return (
            <li key={item.id} className="w-20 shrink-0 snap-start">
              <button
                type="button"
                disabled={isPlaced}
                onClick={() => onAddItem(item)}
                className="w-full text-left transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Add ${item.name}`}
              >
                <div className="aspect-square overflow-hidden bg-[var(--surface-muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="label-caps mt-1 block truncate text-[10px]">{item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
