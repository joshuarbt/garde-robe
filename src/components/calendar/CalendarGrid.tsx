"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AssignOutfitModal } from "@/components/calendar/AssignOutfitModal";
import { CalendarDayCell } from "@/components/calendar/CalendarDayCell";
import { revealProps } from "@/lib/motion";
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

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  const reduced = useReducedMotion() ?? false;

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

  return (
    <>
      {preselectedOutfitId && preselectedOutfitName ? (
        <p className="mb-6 border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
          Select a day to schedule{" "}
          <span className="font-medium text-[var(--foreground)]">
            {preselectedOutfitName}
          </span>
          .
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <Link
          href={buildCalendarHref(prevYear, prevMonth, preselectedOutfitId)}
          className="btn-secondary"
        >
          Previous
        </Link>
        <motion.h2
          key={`${year}-${month}`}
          className="font-display text-2xl font-normal text-[var(--foreground)]"
          {...revealProps(reduced)}
        >
          {monthLabel}
        </motion.h2>
        <Link
          href={buildCalendarHref(nextYear, nextMonth, preselectedOutfitId)}
          className="btn-secondary"
        >
          Next
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-px bg-[var(--border-subtle)]">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="label-caps bg-[var(--background)] py-2 text-center"
          >
            {label}
          </div>
        ))}

        {cells.map((cell, index) => (
          <div key={cell.scheduledDate ?? `empty-${index}`} className="bg-[var(--background)]">
            <CalendarDayCell
              day={cell.day}
              scheduledDate={cell.scheduledDate}
              entry={cell.scheduledDate ? entryByDate.get(cell.scheduledDate) ?? null : null}
              isToday={cell.scheduledDate === today}
              onSelectDate={setSelectedDate}
            />
          </div>
        ))}
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
