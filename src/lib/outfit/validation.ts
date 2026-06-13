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
    errors.name = "Outfit name is required.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  if (input.placements.length === 0) {
    errors.placements = "Add at least one item to the canvas before saving.";
  }

  const notes = input.notes.trim();
  if (notes.length > 500) {
    errors.notes = "Notes must be 500 characters or fewer.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    data: { name, notes, placements: input.placements },
    errors: {},
  };
}
