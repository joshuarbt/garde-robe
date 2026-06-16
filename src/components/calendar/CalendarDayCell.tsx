"use client";

import { OutfitPreview } from "@/components/outfits/OutfitPreview";
import { WeatherBadge } from "@/components/calendar/WeatherBadge";
import type { CalendarEntry } from "@/lib/types/calendar";
import type { OutfitSummary } from "@/lib/types/outfit";
import type { DayForecast } from "@/lib/types/weather";

type CalendarDayCellProps = {
  day: number | null;
  scheduledDate: string | null;
  entry: CalendarEntry | null;
  outfit: OutfitSummary | null;
  isToday: boolean;
  forecast?: DayForecast | null;
  onSelectDate: (scheduledDate: string) => void;
};

export function CalendarDayCell({
  day,
  scheduledDate,
  entry,
  outfit,
  isToday,
  forecast,
  onSelectDate,
}: CalendarDayCellProps) {
  if (day === null || !scheduledDate) {
    return <div className="min-h-16" aria-hidden />;
  }

  const hasPreview = Boolean(entry && outfit);
  const label = entry ? `Jour ${day}, ${entry.outfitName}` : `Jour ${day}`;

  return (
    <button
      type="button"
      onClick={() => onSelectDate(scheduledDate)}
      aria-label={label}
      className={`relative w-full px-1 py-1 transition-opacity active:opacity-60 ${
        hasPreview ? "min-h-[4.5rem]" : "flex min-h-16 items-start justify-center py-2"
      }`}
    >
      {forecast ? (
        <WeatherBadge
          forecast={forecast}
          className="absolute right-0.5 top-0.5 z-20"
        />
      ) : null}
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
