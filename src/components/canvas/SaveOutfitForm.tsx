"use client";

import type { SaveOutfitFormState } from "@/components/canvas/useSaveOutfitForm";

type SaveOutfitFormProps = SaveOutfitFormState;

const inputClassName = "input-field mt-1.5";

export function SaveOutfitForm({
  name,
  setName,
  notes,
  setNotes,
  error,
  fieldErrors,
  isSaving,
  saveLabel,
  canSave,
  handleSave,
}: SaveOutfitFormProps) {
  return (
    <div className="space-y-4">
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
              disabled={isSaving}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Summer casual"
              className={inputClassName}
            />
            {fieldErrors.name ? (
              <p className="mt-1 text-sm text-status-error">{fieldErrors.name}</p>
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
              disabled={isSaving}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional — occasion, weather, etc."
              className={inputClassName}
            />
            {fieldErrors.notes ? (
              <p className="mt-1 text-sm text-status-error">{fieldErrors.notes}</p>
            ) : null}
          </div>

          {fieldErrors.placements ? (
            <p className="text-sm text-status-error">{fieldErrors.placements}</p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-status-error">
              {error}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
