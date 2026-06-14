"use client";

import type { CalendarEntry } from "@/lib/types/calendar";

function abbreviateOutfitName(name: string): string {
  return name.slice(0, 4);
}

type CalendarDayCellProps = {
  day: number | null;
  scheduledDate: string | null;
  entry: CalendarEntry | null;
  isToday: boolean;
  onSelectDate: (scheduledDate: string) => void;
};

export function CalendarDayCell({
  day,
  scheduledDate,
  entry,
  isToday,
  onSelectDate,
}: CalendarDayCellProps) {
  if (day === null || !scheduledDate) {
    return <div className="min-h-16" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={() => onSelectDate(scheduledDate)}
      className="flex min-h-16 w-full flex-col items-center justify-start px-1 py-2 transition-opacity active:opacity-60"
    >
      <span
        className={`text-sm ${
          isToday ? "font-medium text-[var(--foreground)]" : "text-[var(--muted)]"
        }`}
      >
        {day}
      </span>
      {entry ? (
        <>
          <span
            className="mt-1 h-1 w-1 rounded-full bg-[var(--foreground)]"
            aria-hidden
          />
          <span className="mt-1 max-w-full truncate text-[10px] leading-tight text-[var(--foreground)]">
            {abbreviateOutfitName(entry.outfitName)}
          </span>
        </>
      ) : null}
    </button>
  );
}
