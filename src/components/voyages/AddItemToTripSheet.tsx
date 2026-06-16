"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { addItemToTrip } from "@/lib/trip/actions";
import type { ItemWithRelations } from "@/lib/types/item";

type AddItemToTripSheetProps = {
  tripId: string;
  items: ItemWithRelations[];
  packedItemIds: string[];
  onClose: () => void;
};

export function AddItemToTripSheet({
  tripId,
  items,
  packedItemIds,
  onClose,
}: AddItemToTripSheetProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableItems = items.filter((item) => !packedItemIds.includes(item.id));

  function handleAdd(itemId: string) {
    setError(null);
    startTransition(async () => {
      const result = await addItemToTrip(tripId, itemId);

      if (!result.success) {
        setError(result.error ?? "Impossible d'ajouter le vêtement.");
        return;
      }

      router.refresh();
      onClose();
    });
  }

  return (
    <BottomSheet open title="Ajouter un vêtement" onClose={onClose}>
      {availableItems.length === 0 ? (
        <EmptyState
          message="Aucun vêtement disponible."
          description="Ajoutez des pièces à votre garde-robe ou retirez celles déjà dans la valise."
          className="py-10"
        />
      ) : (
        <ul className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {availableItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAdd(item.id)}
                className="flex w-full flex-col gap-2 rounded-sm border border-[var(--border-hairline)] p-2 text-left transition-opacity active:opacity-80 disabled:opacity-60"
              >
                <ItemImage
                  src={item.image_url}
                  alt={item.name}
                  className="aspect-square w-full border border-[var(--border-subtle)]"
                  sizes="120px"
                />
                <span className="line-clamp-2 text-caption">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error ? (
        <p role="alert" className="text-status-error mt-3 text-sm">
          {error}
        </p>
      ) : null}
    </BottomSheet>
  );
}
