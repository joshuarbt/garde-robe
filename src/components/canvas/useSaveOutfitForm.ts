"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveOutfit } from "@/lib/outfit/actions";
import type { CanvasPlacementState } from "@/lib/types/outfit";

type SaveOutfitFieldErrors = {
  name?: string;
  notes?: string;
  placements?: string;
};

type UseSaveOutfitFormOptions = {
  placements: CanvasPlacementState[];
  outfitId?: string;
  initialName?: string;
  initialNotes?: string;
  disabled?: boolean;
};

export function useSaveOutfitForm({
  placements,
  outfitId,
  initialName = "",
  initialNotes = "",
  disabled = false,
}: UseSaveOutfitFormOptions) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<SaveOutfitFieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const saveLabel = isSaving
    ? "Enregistrement…"
    : outfitId
      ? "Enregistrer les modifications"
      : "Enregistrer la tenue";
  const canSave = !disabled && !isSaving && placements.length > 0;

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
      setError("Une erreur s'est produite. Veuillez réessayer.");
      setIsSaving(false);
    }
  }

  return {
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
  };
}

export type SaveOutfitFormState = ReturnType<typeof useSaveOutfitForm>;
