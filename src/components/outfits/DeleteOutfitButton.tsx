"use client";

import { useTransition } from "react";
import { deleteOutfit } from "@/lib/outfit/actions";

type DeleteOutfitButtonProps = {
  outfitId: string;
  outfitName: string;
};

export function DeleteOutfitButton({ outfitId, outfitName }: DeleteOutfitButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`Delete "${outfitName}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteOutfit(outfitId);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="text-sm text-red-700 hover:text-red-800 disabled:opacity-60"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
