"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { OutfitPreview } from "@/components/outfits/OutfitPreview";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { addOutfitToTrip } from "@/lib/trip/actions";
import type { OutfitSummary } from "@/lib/types/outfit";

type AddOutfitToTripSheetProps = {
  tripId: string;
  outfits: OutfitSummary[];
  linkedOutfitIds: string[];
  onClose: () => void;
};

export function AddOutfitToTripSheet({
  tripId,
  outfits,
  linkedOutfitIds,
  onClose,
}: AddOutfitToTripSheetProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableOutfits = outfits.filter((outfit) => !linkedOutfitIds.includes(outfit.id));

  function handleAdd(outfitId: string) {
    setError(null);
    startTransition(async () => {
      const result = await addOutfitToTrip(tripId, outfitId);

      if (!result.success) {
        setError(result.error ?? "Impossible d'ajouter la tenue.");
        return;
      }

      router.refresh();
      onClose();
    });
  }

  return (
    <BottomSheet open title="Ajouter une tenue" onClose={onClose}>
      {availableOutfits.length === 0 ? (
        <EmptyState
          message="Aucune tenue disponible."
          description="Créez une tenue ou retirez celles déjà ajoutées."
          className="py-10"
        />
      ) : (
        <ul className="max-h-[60vh] space-y-3 overflow-y-auto">
          {availableOutfits.map((outfit) => (
            <li key={outfit.id}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAdd(outfit.id)}
                className="flex w-full items-center gap-3 rounded-sm border border-[var(--border-hairline)] p-3 text-left transition-opacity active:opacity-80 disabled:opacity-60"
              >
                <OutfitPreview items={outfit.previewItems} alt={outfit.name} variant="row" />
                <span className="text-body font-medium">{outfit.name}</span>
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
