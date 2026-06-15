"use client";

import type { WardrobeCanvasItem } from "@/lib/types/outfit";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EmptyState } from "@/components/ui/EmptyState";

type WardrobeSidebarProps = {
  items: WardrobeCanvasItem[];
  placedItemIds: Set<string>;
  onAddItem: (item: WardrobeCanvasItem) => void;
};

export function WardrobeSidebar({
  items,
  placedItemIds,
  onAddItem,
}: WardrobeSidebarProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        message="Aucun article avec photo dans la garde-robe. Ajoutez d'abord des articles à votre garde-robe."
        actionLabel="Ajouter votre premier article"
        actionHref="/wardrobe/new"
      />
    );
  }

  return (
    <div className="space-y-3">
      <SectionLabel>Garde-robe</SectionLabel>
      <p className="text-xs text-[var(--muted)]">Cliquez sur un article pour l&apos;ajouter au canevas.</p>
      <ul className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const isPlaced = placedItemIds.has(item.id);

          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={isPlaced}
                onClick={() => onAddItem(item)}
                className="w-full text-left transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <div className="aspect-square overflow-hidden bg-[var(--surface-muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="label-caps mt-2 block truncate">{item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
