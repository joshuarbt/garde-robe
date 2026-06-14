"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { Crossfade } from "@/components/layout/motion";
import { assignOutfitToDate, removeCalendarEntry } from "@/lib/calendar/actions";
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

  const title = currentEntry && !isChanging ? "Planned outfit" : "Assign outfit";
  const contentKey = currentEntry && !isChanging ? "view" : "assign";

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

  const footer = (
    <div className="space-y-3">
      {currentEntry && !isChanging ? (
        <div className="flex flex-wrap justify-center gap-4 md:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setIsChanging(true);
              setSelectedOutfitId(preselectedOutfitId ?? currentEntry.outfitId);
              setError(null);
            }}
            className="btn-ghost text-sm disabled:opacity-60"
          >
            Change outfit
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleRemove}
            className="btn-ghost text-sm text-[var(--status-error)] disabled:opacity-60"
          >
            Remove
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="btn-ghost text-sm disabled:opacity-60"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-4 md:justify-end">
            {currentEntry ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setIsChanging(false);
                  setSelectedOutfitId(currentEntry.outfitId);
                  setError(null);
                }}
                className="btn-ghost text-sm disabled:opacity-60"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="btn-ghost text-sm disabled:opacity-60 md:hidden"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="btn-secondary hidden disabled:opacity-60 md:inline-flex"
            >
              Close
            </button>
          </div>
          <button
            type="button"
            disabled={isPending || outfits.length === 0}
            onClick={handleAssign}
            className="btn-primary w-full disabled:opacity-60 md:w-auto md:self-end"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </>
      )}
    </div>
  );

  return (
    <BottomSheet
      open
      onClose={onClose}
      title={title}
      titleId="assign-outfit-title"
      footer={footer}
      className="rounded-t-xl md:rounded-sm"
    >
      <p className="text-sm text-[var(--muted)]">{formattedDate}</p>

      <Crossfade contentKey={contentKey}>
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
                    <label className="flex min-h-[var(--touch-min)] cursor-pointer items-center gap-3 border border-[var(--border-subtle)] px-3 py-3 transition-colors hover:bg-[var(--surface-muted)]">
                      <input
                        type="radio"
                        name="outfit"
                        value={outfit.id}
                        checked={selectedOutfitId === outfit.id}
                        disabled={isPending}
                        onChange={() => setSelectedOutfitId(outfit.id)}
                      />
                      <span className="text-sm text-[var(--foreground)]">{outfit.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Crossfade>

      {error ? (
        <p role="alert" className="text-status-error mt-4 text-sm">
          {error}
        </p>
      ) : null}
    </BottomSheet>
  );
}
