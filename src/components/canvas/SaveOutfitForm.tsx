"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveOutfit } from "@/lib/outfit/actions";
import type { CanvasPlacementState } from "@/lib/types/outfit";

type SaveOutfitFormProps = {
  placements: CanvasPlacementState[];
  outfitId?: string;
  initialName?: string;
  initialNotes?: string;
  disabled?: boolean;
};

const inputClassName =
  "mt-1 block w-full rounded-sm border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)] disabled:opacity-60";

export function SaveOutfitForm({
  placements,
  outfitId,
  initialName = "",
  initialNotes = "",
  disabled = false,
}: SaveOutfitFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    notes?: string;
    placements?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setError(null);
    setFieldErrors({});
    setIsSaving(true);

    try {
      const result = await saveOutfit({ name, notes, placements, outfitId });

      if (!result.success) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        setIsSaving(false);
        return;
      }

      const savedParam = outfitId ? "" : "?saved=1";
      router.push(`/outfits/${result.outfitId}${savedParam}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4 border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0 space-y-4">
          <div>
            <label htmlFor="outfit-name" className="label-caps">
              Outfit name
            </label>
            <input
              id="outfit-name"
              type="text"
              value={name}
              disabled={disabled || isSaving}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Summer casual"
              className={inputClassName}
            />
            {fieldErrors.name ? (
              <p className="mt-1 text-sm text-red-700">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="outfit-notes" className="label-caps">
              Notes
            </label>
            <textarea
              id="outfit-notes"
              rows={2}
              value={notes}
              disabled={disabled || isSaving}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional — occasion, weather, etc."
              className={inputClassName}
            />
            {fieldErrors.notes ? (
              <p className="mt-1 text-sm text-red-700">{fieldErrors.notes}</p>
            ) : null}
          </div>

          {fieldErrors.placements ? (
            <p className="text-sm text-red-700">{fieldErrors.placements}</p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          disabled={disabled || isSaving || placements.length === 0}
          onClick={handleSave}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving…" : outfitId ? "Save changes" : "Save outfit"}
        </button>
      </div>
    </div>
  );
}
