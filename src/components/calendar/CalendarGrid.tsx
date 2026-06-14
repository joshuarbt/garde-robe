"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AssignOutfitModal } from "@/components/calendar/AssignOutfitModal";
import { CalendarDayCell } from "@/components/calendar/CalendarDayCell";
import type { CalendarEntry } from "@/lib/types/calendar";
import type { OutfitSummary } from "@/lib/types/outfit";

type CalendarGridProps = {
  year: number;
  month: number;
  entries: CalendarEntry[];
  outfits: OutfitSummary[];
  preselectedOutfitId?: string;
  preselectedOutfitName?: string;
};

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function toScheduledDate(year: number, month: number, day: number): string {
  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

function getTodayScheduledDate(): string {
  const now = new Date();
  return toScheduledDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function buildCalendarHref(
  year: number,
  month: number,
  outfitId?: string,
): string {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  if (outfitId) {
    params.set("outfitId", outfitId);
  }

  return `/calendar?${params.toString()}`;
}

export function CalendarGrid({
  year,
  month,
  entries,
  outfits,
  preselectedOutfitId,
  preselectedOutfitName,
}: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entryByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry>();
    for (const entry of entries) {
      map.set(entry.scheduledDate, entry);
    }
    return map;
  }, [entries]);

  const today = getTodayScheduledDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: Array<{
    day: number | null;
    scheduledDate: string | null;
  }> = [];

  for (let i = 0; i < firstDayOfMonth; i += 1) {
    cells.push({ day: null, scheduledDate: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      scheduledDate: toScheduledDate(year, month, day),
    });
  }

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const selectedEntry = selectedDate ? entryByDate.get(selectedDate) ?? null : null;

  const outfitsById = useMemo(() => {
    const map = new Map<string, OutfitSummary>();
    for (const outfit of outfits) {
      map.set(outfit.id, outfit);
    }
    return map;
  }, [outfits]);

  return (
    <>
      {preselectedOutfitId && preselectedOutfitName ? (
        <p className="text-meta mb-6">
          Tap a day to schedule{" "}
          <span className="text-[var(--foreground)]">{preselectedOutfitName}</span>
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <Link
          href={buildCalendarHref(prevYear, prevMonth, preselectedOutfitId)}
          className="btn-ghost min-h-[var(--touch-min)] text-sm"
        >
          Previous
        </Link>
        <h2 className="text-title">{monthLabel}</h2>
        <Link
          href={buildCalendarHref(nextYear, nextMonth, preselectedOutfitId)}
          className="btn-ghost min-h-[var(--touch-min)] text-sm"
        >
          Next
        </Link>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-7">
          {WEEKDAY_LABELS.map((label, index) => (
            <div
              key={`${label}-${index}`}
              className="text-overline py-2 text-center"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-t border-[var(--border-subtle)]">
          {cells.map((cell, index) => {
            const entry =
              cell.scheduledDate ? entryByDate.get(cell.scheduledDate) ?? null : null;

            return (
            <div
              key={cell.scheduledDate ?? `empty-${index}`}
              className={`border-b border-[var(--border-subtle)] ${
                (index + 1) % 7 !== 0 ? "border-r" : ""
              } border-[var(--border-subtle)]`}
            >
              <CalendarDayCell
                day={cell.day}
                scheduledDate={cell.scheduledDate}
                entry={entry}
                outfit={entry ? outfitsById.get(entry.outfitId) ?? null : null}
                isToday={cell.scheduledDate === today}
                onSelectDate={setSelectedDate}
              />
            </div>
            );
          })}
        </div>
      </div>

      {selectedDate ? (
        <AssignOutfitModal
          scheduledDate={selectedDate}
          currentEntry={selectedEntry}
          outfits={outfits}
          preselectedOutfitId={preselectedOutfitId}
          onClose={() => setSelectedDate(null)}
        />
      ) : null}
    </>
  );
}
