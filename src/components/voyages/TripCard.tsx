import Link from "next/link";
import type { TripSummary } from "@/lib/types/trip";
import { formatCount } from "@/lib/i18n/plural";

type TripCardProps = {
  trip: TripSummary;
  dateLabel: string | null;
};

export function TripCard({ trip, dateLabel }: TripCardProps) {
  const progressLabel =
    trip.itemCount > 0
      ? `${trip.packedCount}/${trip.itemCount} préparé${trip.itemCount > 1 ? "s" : ""}`
      : "Aucun vêtement";

  return (
    <article>
      <Link href={`/voyages/${trip.id}`} className="block rounded-sm border border-[var(--border-hairline)] p-4 active:opacity-80">
        <div className="space-y-2">
          <h2 className="text-title leading-snug">{trip.name}</h2>
          {trip.destination ? (
            <p className="text-caption text-[var(--muted)]">{trip.destination}</p>
          ) : null}
          {dateLabel ? <p className="text-caption text-[var(--muted)]">{dateLabel}</p> : null}
          <p className="text-caption">
            {formatCount(trip.outfitCount, "tenue", "tenues")} · {progressLabel}
          </p>
          {trip.itemCount > 0 ? (
            <div className="h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full bg-[var(--foreground)] transition-all duration-300"
                style={{ width: `${Math.round((trip.packedCount / trip.itemCount) * 100)}%` }}
              />
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

function formatTripDateRange(start: string | null, end: string | null): string | null {
  if (!start && !end) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (start && end) {
    return `${formatter.format(new Date(`${start}T12:00:00`))} – ${formatter.format(new Date(`${end}T12:00:00`))}`;
  }

  if (start) {
    return `À partir du ${formatter.format(new Date(`${start}T12:00:00`))}`;
  }

  return `Jusqu'au ${formatter.format(new Date(`${end}T12:00:00`))}`;
}

export { formatTripDateRange };
