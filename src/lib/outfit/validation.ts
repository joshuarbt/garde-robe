import type { CanvasItemPlacement } from "@/lib/types/outfit";

export type OutfitFormInput = {
  name: string;
  notes: string;
  placements: CanvasItemPlacement[];
};

export type OutfitFormErrors = {
  name?: string;
  notes?: string;
  placements?: string;
  _form?: string;
};

export type SaveOutfitResult =
  | { success: true; outfitId: string }
  | { success: false; error: string; fieldErrors?: OutfitFormErrors };

export type OutfitActionResult =
  | { success: true }
  | { success: false; error: string };

export function validateOutfitInput(
  input: OutfitFormInput,
): { data: OutfitFormInput; errors: OutfitFormErrors } | { errors: OutfitFormErrors } {
  const errors: OutfitFormErrors = {};
  const name = input.name.trim();

  if (!name) {
    errors.name = "Le nom de la tenue est obligatoire.";
  } else if (name.length > 100) {
    errors.name = "Le nom doit comporter 100 caractères ou moins.";
  }

  if (input.placements.length === 0) {
    errors.placements = "Ajoutez au moins un article au canevas avant d'enregistrer.";
  }

  const notes = input.notes.trim();
  if (notes.length > 500) {
    errors.notes = "Les notes doivent comporter 500 caractères ou moins.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: { name, notes, placements: input.placements },
    errors: {},
  };
}
