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
      "Delete this item? This action cannot be undone.",
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
      className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {isPending ? "Deleting…" : "Delete item"}
    </button>
  );
}
