"use client";

import { OutfitPreview } from "@/components/outfits/OutfitPreview";
import type { CalendarEntry } from "@/lib/types/calendar";
import type { OutfitSummary } from "@/lib/types/outfit";

type CalendarDayCellProps = {
  day: number | null;
  scheduledDate: string | null;
  entry: CalendarEntry | null;
  outfit: OutfitSummary | null;
  isToday: boolean;
  onSelectDate: (scheduledDate: string) => void;
};

export function CalendarDayCell({
  day,
  scheduledDate,
  entry,
  outfit,
  isToday,
  onSelectDate,
}: CalendarDayCellProps) {
  if (day === null || !scheduledDate) {
    return <div className="min-h-16" aria-hidden />;
  }

  const hasPreview = Boolean(entry && outfit);
  const label = entry ? `${day}, ${entry.outfitName}` : String(day);

  return (
    <button
      type="button"
      onClick={() => onSelectDate(scheduledDate)}
      aria-label={label}
      className={`relative w-full px-1 py-1 transition-opacity active:opacity-60 ${
        hasPreview ? "min-h-[4.5rem]" : "flex min-h-16 items-start justify-center py-2"
      }`}
    >
      {hasPreview ? (
        <>
          <OutfitPreview
            items={outfit!.previewItems}
            alt={entry!.outfitName}
            variant="cell"
            className="absolute inset-x-1 bottom-1 top-5"
          />
          <span
            className={`relative z-10 px-0.5 text-caption ${
              isToday ? "font-medium text-[var(--foreground)]" : "text-[var(--muted)]"
            }`}
          >
            {day}
          </span>
        </>
      ) : entry && !outfit ? (
        <>
          <span
            className={`text-sm ${
              isToday ? "font-medium text-[var(--foreground)]" : "text-[var(--muted)]"
            }`}
          >
            {day}
          </span>
          <span
            className="mt-1 h-1 w-1 rounded-full bg-[var(--muted-light)]"
            aria-hidden
          />
        </>
      ) : (
        <span
          className={`text-sm ${
            isToday ? "font-medium text-[var(--foreground)]" : "text-[var(--muted)]"
          }`}
        >
          {day}
        </span>
      )}
    </button>
  );
}
