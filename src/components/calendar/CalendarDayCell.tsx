"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CalendarEntry } from "@/lib/types/calendar";

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
  const reduced = useReducedMotion() ?? false;

  if (day === null || !scheduledDate) {
    return <div className="min-h-20 bg-transparent" aria-hidden />;
  }

  return (
    <motion.button
      type="button"
      onClick={() => onSelectDate(scheduledDate)}
      whileHover={reduced ? undefined : { opacity: 0.92 }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={`min-h-20 w-full border p-2 text-left transition-colors hover:border-[var(--foreground)] hover:bg-[var(--surface)] ${
        isToday
          ? "border-[var(--foreground)] bg-[var(--surface)] ring-1 ring-[var(--foreground)]"
          : "border-[var(--border-subtle)] bg-[var(--background)]"
      }`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center text-sm ${
          isToday ? "font-medium text-[var(--foreground)]" : "text-[var(--muted)]"
        }`}
      >
        {day}
      </span>
      {entry ? (
        <p className="mt-2 line-clamp-2 text-xs font-medium text-[var(--foreground)]">
          {entry.outfitName}
        </p>
      ) : (
        <p className="mt-2 text-xs text-stone-400">Assign</p>
      )}
    </motion.button>
  );
}
