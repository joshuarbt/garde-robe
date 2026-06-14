"use client";

import { useState } from "react";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import type { SaveOutfitFormState } from "@/components/canvas/useSaveOutfitForm";

type BuilderActionBarProps = SaveOutfitFormState;

export function BuilderActionBar({
  name,
  setName,
  notes,
  setNotes,
  fieldErrors,
  error,
  saveLabel,
  canSave,
  handleSave,
  isSaving,
}: BuilderActionBarProps) {
  const [showNotes, setShowNotes] = useState(Boolean(notes));

  return (
    <>
      {(error || fieldErrors.placements) && (
        <div className="space-y-1 px-1 md:hidden">
          {fieldErrors.placements ? (
            <p className="text-sm text-status-error">{fieldErrors.placements}</p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-status-error">
              {error}
            </p>
          ) : null}
        </div>
      )}

      <MobileActionBar withTabBar={false}>
        <div className="space-y-3">
          {showNotes ? (
            <div>
              <label htmlFor="outfit-notes-mobile" className="sr-only">
                Notes
              </label>
              <textarea
                id="outfit-notes-mobile"
                rows={2}
                value={notes}
                disabled={isSaving}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional — occasion, weather, etc."
                className="input-field w-full"
              />
              {fieldErrors.notes ? (
                <p className="mt-1 text-sm text-status-error">{fieldErrors.notes}</p>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              className="btn-ghost w-full justify-center text-sm"
              onClick={() => setShowNotes(true)}
            >
              Add note
            </button>
          )}

          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <label htmlFor="outfit-name-mobile" className="sr-only">
                Outfit name
              </label>
              <input
                id="outfit-name-mobile"
                type="text"
                value={name}
                disabled={isSaving}
                onChange={(event) => setName(event.target.value)}
                placeholder="Look name"
                className="input-field w-full"
              />
              {fieldErrors.name ? (
                <p className="mt-1 text-sm text-status-error">{fieldErrors.name}</p>
              ) : null}
            </div>
            <button
              type="button"
              disabled={!canSave}
              onClick={handleSave}
              className="btn-primary shrink-0 px-6 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </MobileActionBar>
    </>
  );
}
