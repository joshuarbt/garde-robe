"use client";

import { useTransition } from "react";
import { deleteItem } from "@/lib/wardrobe/actions";

type DeleteItemButtonProps = {
  itemId: string;
};

export function DeleteItemButton({ itemId }: DeleteItemButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Supprimer ce vêtement ? Cette action est irréversible.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteItem(itemId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="btn-destructive disabled:opacity-60"
    >
      {isPending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
