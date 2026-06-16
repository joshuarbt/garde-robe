"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { OutfitPreview } from "@/components/outfits/OutfitPreview";
import { AddItemToTripSheet } from "@/components/voyages/AddItemToTripSheet";
import { AddOutfitToTripSheet } from "@/components/voyages/AddOutfitToTripSheet";
import { resetTripPacking } from "@/lib/trip/actions";
import type { ItemWithRelations } from "@/lib/types/item";
import type { OutfitSummary } from "@/lib/types/outfit";

type TripDetailClientProps = {
  tripId: string;
  tripOutfits: OutfitSummary[];
  allOutfits: OutfitSummary[];
  wardrobeItems: ItemWithRelations[];
  packedItemIds: string[];
};

type SheetMode = "outfit" | "item" | null;

export function TripDetailClient({
  tripId,
  tripOutfits,
  allOutfits,
  wardrobeItems,
  packedItemIds,
}: TripDetailClientProps) {
  const router = useRouter();
  const [sheet, setSheet] = useState<SheetMode>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResetting, startReset] = useTransition();

  const linkedOutfitIds = tripOutfits.map((outfit) => outfit.id);

  function handleReset() {
    const confirmed = window.confirm(
      "Réinitialiser la liste ? Tous les vêtements seront marqués comme non préparés.",
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    startReset(async () => {
      const result = await resetTripPacking(tripId);

      if (!result.success) {
        setError(result.error ?? "Impossible de réinitialiser.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => setSheet("outfit")}
          className="btn-secondary w-full sm:w-auto"
        >
          Ajouter une tenue
        </button>
        <button
          type="button"
          onClick={() => setSheet("item")}
          className="btn-secondary w-full sm:w-auto"
        >
          Ajouter un vêtement
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isResetting || packedItemIds.length === 0}
          className="btn-ghost w-full text-sm sm:w-auto disabled:opacity-60"
        >
          {isResetting ? "Réinitialisation…" : "Réinitialiser la liste"}
        </button>
      </div>

      {tripOutfits.length > 0 ? (
        <div className="flex flex-wrap gap-3 pt-2">
          {tripOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="flex items-center gap-2 rounded-sm border border-[var(--border-hairline)] px-2 py-1.5"
            >
              <OutfitPreview items={outfit.previewItems} alt={outfit.name} variant="chip" />
              <span className="text-caption">{outfit.name}</span>
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="text-status-error text-sm">
          {error}
        </p>
      ) : null}

      {sheet === "outfit" ? (
        <AddOutfitToTripSheet
          tripId={tripId}
          outfits={allOutfits}
          linkedOutfitIds={linkedOutfitIds}
          onClose={() => setSheet(null)}
        />
      ) : null}

      {sheet === "item" ? (
        <AddItemToTripSheet
          tripId={tripId}
          items={wardrobeItems}
          packedItemIds={packedItemIds}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </>
  );
}
