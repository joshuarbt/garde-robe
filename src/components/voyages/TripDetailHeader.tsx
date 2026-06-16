"use client";

import { useTransition } from "react";
import { formatTripDateRange } from "@/components/voyages/TripCard";
import { deleteTrip } from "@/lib/trip/actions";
import type { Trip } from "@/lib/types/trip";

type TripDetailHeaderProps = {
  trip: Trip;
};

export function TripDetailHeader({ trip }: TripDetailHeaderProps) {
  const [isPending, startTransition] = useTransition();
  const dateLabel = formatTripDateRange(trip.start_date, trip.end_date);

  function handleDelete() {
    const confirmed = window.confirm(
      "Supprimer ce voyage ? La liste de préparation sera effacée.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteTrip(trip.id);
    });
  }

  return (
    <div className="space-y-2 border-b border-[var(--border-subtle)] pb-4">
      {trip.destination ? (
        <p className="text-caption text-[var(--muted)]">{trip.destination}</p>
      ) : null}
      {dateLabel ? <p className="text-caption text-[var(--muted)]">{dateLabel}</p> : null}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="btn-destructive text-sm disabled:opacity-60"
      >
        {isPending ? "Suppression…" : "Supprimer le voyage"}
      </button>
    </div>
  );
}
