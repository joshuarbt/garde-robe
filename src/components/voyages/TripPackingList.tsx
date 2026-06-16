"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PackingListItem } from "@/components/voyages/PackingListItem";
import { toggleItemPacked } from "@/lib/trip/actions";
import type { TripPackingItem } from "@/lib/types/trip";

type TripPackingListProps = {
  tripId: string;
  initialItems: TripPackingItem[];
};

export function TripPackingList({ tripId, initialItems }: TripPackingListProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle(itemId: string, nextPacked: boolean) {
    const previousItems = items;
    setError(null);
    setItems((current) =>
      current.map((item) =>
        item.itemId === itemId ? { ...item, isPacked: nextPacked } : item,
      ),
    );

    startTransition(async () => {
      const result = await toggleItemPacked(tripId, itemId, nextPacked);

      if (!result.success) {
        setError(result.error ?? "Impossible de mettre à jour.");
        setItems(previousItems);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <PackingListItem
          key={item.itemId}
          name={item.name}
          imageUrl={item.imageUrl}
          isPacked={item.isPacked}
          disabled={isPending}
          onToggle={() => handleToggle(item.itemId, !item.isPacked)}
        />
      ))}

      {error ? (
        <p role="alert" className="text-status-error text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
