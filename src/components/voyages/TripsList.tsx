"use client";

import { TripCard, formatTripDateRange } from "@/components/voyages/TripCard";
import { StaggerItem, StaggerList } from "@/components/layout/motion";
import type { TripSummary } from "@/lib/types/trip";

type TripsListProps = {
  trips: TripSummary[];
};

export function TripsList({ trips }: TripsListProps) {
  return (
    <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {trips.map((trip) => (
        <StaggerItem key={trip.id}>
          <TripCard
            trip={trip}
            dateLabel={formatTripDateRange(trip.start_date, trip.end_date)}
          />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
