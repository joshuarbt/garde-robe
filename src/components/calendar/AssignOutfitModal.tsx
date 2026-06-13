"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { assignOutfitToDate, removeCalendarEntry } from "@/lib/calendar/actions";
import {
  fadeUp,
  modalMotionProps,
  motionTransition,
  revealProps,
} from "@/lib/motion";
import type { CalendarEntry } from "@/lib/types/calendar";
import type { OutfitSummary } from "@/lib/types/outfit";

type AssignOutfitModalProps = {
  scheduledDate: string;
  currentEntry: CalendarEntry | null;
  outfits: OutfitSummary[];
  preselectedOutfitId?: string;
  onClose: () => void;
};

export function AssignOutfitModal({
  scheduledDate,
  currentEntry,
  outfits,
  preselectedOutfitId,
  onClose,
}: AssignOutfitModalProps) {
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;
  const modalMotion = modalMotionProps(reduced);
  const [isChanging, setIsChanging] = useState(!currentEntry);
  const [selectedOutfitId, setSelectedOutfitId] = useState(
    preselectedOutfitId ?? currentEntry?.outfitId ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${scheduledDate}T12:00:00`));

  const showAssignForm = !currentEntry || isChanging;
  const contentKey = showAssignForm ? "assign" : "view";

  function handleAssign() {
    if (!selectedOutfitId) {
      setError("Select an outfit.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await assignOutfitToDate(scheduledDate, selectedOutfitId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      const result = await removeCalendarEntry(scheduledDate);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--foreground)]/30 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-outfit-title"
        {...modalMotion.backdrop}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md border border-[var(--border-subtle)] bg-[var(--surface)] p-8"
          {...modalMotion.panel}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.98, y: 8 }
          }
          transition={motionTransition(reduced)}
          onClick={(event) => event.stopPropagation()}
        >
          <h2
            id="assign-outfit-title"
            className="font-display text-2xl font-normal text-[var(--foreground)]"
          >
            {currentEntry && !isChanging ? "Planned outfit" : "Assign outfit"}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{formattedDate}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={reduced ? false : "hidden"}
              animate="visible"
              exit={reduced ? undefined : "hidden"}
              variants={reduced ? undefined : fadeUp}
              transition={motionTransition(reduced)}
            >
              {currentEntry && !isChanging ? (
                <div className="divider-hairline mt-6 space-y-3 pt-6">
                  <p className="label-caps">Outfit for this day</p>
                  <Link
                    href={`/outfits/${currentEntry.outfitId}`}
                    className="block font-display text-xl text-[var(--foreground)] transition-opacity hover:opacity-70"
                  >
                    {currentEntry.outfitName}
                  </Link>
                  {currentEntry.notes ? (
                    <p className="text-sm text-[var(--muted)]">{currentEntry.notes}</p>
                  ) : null}
                </div>
              ) : (
                <>
                  {!currentEntry ? (
                    <p className="mt-6 text-sm text-[var(--muted)]">
                      No outfit planned for this day.
                    </p>
                  ) : null}

                  {outfits.length === 0 ? (
                    <div className="mt-6">
                      <EmptyState
                        message="Save an outfit first before assigning it to the calendar."
                        actionLabel="Build outfit"
                        actionHref="/outfits/new"
                      />
                    </div>
                  ) : (
                    <ul className="mt-6 max-h-60 space-y-2 overflow-y-auto">
                      {outfits.map((outfit) => (
                        <li key={outfit.id}>
                          <label className="flex cursor-pointer items-center gap-3 border border-[var(--border-subtle)] px-3 py-3 transition-colors hover:bg-[var(--surface-muted)]">
                            <input
                              type="radio"
                              name="outfit"
                              value={outfit.id}
                              checked={selectedOutfitId === outfit.id}
                              disabled={isPending}
                              onChange={() => setSelectedOutfitId(outfit.id)}
                            />
                            <span className="text-sm text-[var(--foreground)]">
                              {outfit.name}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <motion.p
              role="alert"
              className="mt-4 text-sm text-red-700"
              {...revealProps(reduced)}
            >
              {error}
            </motion.p>
          ) : null}

          <div className="divider-hairline mt-8 flex flex-wrap justify-end gap-2 pt-6">
            {currentEntry && !isChanging ? (
              <>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setIsChanging(true);
                    setSelectedOutfitId(preselectedOutfitId ?? currentEntry.outfitId);
                    setError(null);
                  }}
                  className="btn-secondary disabled:opacity-60"
                >
                  Change outfit
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleRemove}
                  className="btn-secondary border-red-200 text-red-700 hover:border-red-300 disabled:opacity-60"
                >
                  Remove
                </button>
              </>
            ) : currentEntry ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setIsChanging(false);
                  setSelectedOutfitId(currentEntry.outfitId);
                  setError(null);
                }}
                className="btn-secondary disabled:opacity-60"
              >
                Cancel
              </button>
            ) : null}

            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="btn-secondary disabled:opacity-60"
            >
              Close
            </button>

            {showAssignForm ? (
              <button
                type="button"
                disabled={isPending || outfits.length === 0}
                onClick={handleAssign}
                className="btn-primary disabled:opacity-60"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
