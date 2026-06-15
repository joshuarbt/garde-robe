"use client";

import { useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { actionIcons } from "@/lib/icons";
import { deleteOutfit } from "@/lib/outfit/actions";

type DeleteOutfitButtonProps = {
  outfitId: string;
  outfitName: string;
  variant?: "text" | "icon" | "menu";
  onComplete?: () => void;
};

export function DeleteOutfitButton({
  outfitId,
  outfitName,
  variant = "text",
  onComplete,
}: DeleteOutfitButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Supprimer « ${outfitName} » ? Cette action est irréversible.`,
    );
    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteOutfit(outfitId);
      onComplete?.();
    });
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="btn-destructive flex min-h-[var(--touch-min)] w-full items-center text-sm active:bg-[var(--surface-muted)] disabled:opacity-60"
      >
        {isPending ? "Suppression…" : "Supprimer"}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="btn-icon text-[var(--status-error)] disabled:opacity-60"
        aria-label={`Supprimer ${outfitName}`}
      >
        <Icon icon={actionIcons.delete} size="sm" />
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="btn-destructive text-sm disabled:opacity-60"
    >
      {isPending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
