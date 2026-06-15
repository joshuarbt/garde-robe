"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { OutfitPreview } from "@/components/outfits/OutfitPreview";
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

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${scheduledDate}T12:00:00`));

  const title = currentEntry && !isChanging ? "Tenue planifiée" : "Assigner une tenue";
  const contentKey = currentEntry && !isChanging ? "view" : "assign";

  const outfitsById = useMemo(() => {
    const map = new Map<string, OutfitSummary>();
    for (const outfit of outfits) {
      map.set(outfit.id, outfit);
    }
    return map;
  }, [outfits]);

  const assignedOutfit = currentEntry ? outfitsById.get(currentEntry.outfitId) ?? null : null;
  const selectedOutfit = selectedOutfitId ? outfitsById.get(selectedOutfitId) ?? null : null;

  function handleAssign() {
    if (!selectedOutfitId) {
      setError("Sélectionnez une tenue.");
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
            Changer de tenue
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleRemove}
            className="btn-ghost text-sm text-[var(--status-error)] disabled:opacity-60"
          >
            Supprimer
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="btn-ghost text-sm disabled:opacity-60"
          >
            Fermer
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
                Annuler
              </button>
            ) : null}
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="btn-ghost text-sm disabled:opacity-60 md:hidden"
            >
              Fermer
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="btn-secondary hidden disabled:opacity-60 md:inline-flex"
            >
              Fermer
            </button>
          </div>
          <button
            type="button"
            disabled={isPending || outfits.length === 0}
            onClick={handleAssign}
            className="btn-primary w-full disabled:opacity-60 md:w-auto md:self-end"
          >
            {isPending ? "Enregistrement…" : "Enregistrer"}
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
          <div className="mt-6 space-y-4">
            {assignedOutfit ? (
              <OutfitPreview
                items={assignedOutfit.previewItems}
                alt={currentEntry.outfitName}
                variant="card"
                className="w-full"
              />
            ) : null}
            <div className="space-y-2">
              <p className="text-overline">Tenue pour ce jour</p>
              <Link
                href={`/outfits/${currentEntry.outfitId}`}
                className="block text-title text-[var(--foreground)] transition-opacity hover:opacity-70"
              >
                {currentEntry.outfitName}
              </Link>
              {currentEntry.notes ? (
                <p className="text-sm text-[var(--muted)]">{currentEntry.notes}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            {!currentEntry ? (
              <p className="mt-6 text-sm text-[var(--muted)]">
                Aucune tenue planifiée pour ce jour.
              </p>
            ) : null}

            {outfits.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  message="Enregistrez d'abord une tenue avant de l'assigner au calendrier."
                  actionLabel="Composer une tenue"
                  actionHref="/outfits/new"
                />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {selectedOutfit ? (
                  <OutfitPreview
                    items={selectedOutfit.previewItems}
                    alt={selectedOutfit.name}
                    variant="card"
                    className="w-full"
                  />
                ) : null}

                <ul className="max-h-60 divide-y divide-[var(--border-hairline)] overflow-y-auto">
                  {outfits.map((outfit) => (
                    <li key={outfit.id}>
                      <label className="flex min-h-[var(--touch-min)] cursor-pointer items-center gap-3 py-3 transition-opacity active:opacity-70">
                        <input
                          type="radio"
                          name="outfit"
                          value={outfit.id}
                          checked={selectedOutfitId === outfit.id}
                          disabled={isPending}
                          onChange={() => setSelectedOutfitId(outfit.id)}
                          className="shrink-0"
                        />
                        <OutfitPreview
                          items={outfit.previewItems}
                          alt={outfit.name}
                          variant="row"
                        />
                        <span className="min-w-0 flex-1 text-sm text-[var(--foreground)]">
                          {outfit.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
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
