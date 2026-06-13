"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AddToCalendarLink } from "@/components/outfits/AddToCalendarLink";
import { DeleteOutfitButton } from "@/components/outfits/DeleteOutfitButton";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import type { OutfitSummary } from "@/lib/types/outfit";

type OutfitListItemProps = {
  outfit: OutfitSummary;
  formattedDate: string;
};

export function OutfitListItem({ outfit, formattedDate }: OutfitListItemProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="flex gap-5 py-6">
      <motion.div whileHover={reduced ? undefined : { opacity: 0.85 }} className="shrink-0">
        <Link
          href={`/outfits/${outfit.id}`}
          className="block overflow-hidden bg-[var(--surface-muted)]"
        >
          <ItemImage
            src={outfit.previewImageUrl}
            alt={outfit.name}
            className="h-28 w-28"
            sizes="112px"
          />
        </Link>
      </motion.div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Link
              href={`/outfits/${outfit.id}`}
              className="font-display text-xl text-[var(--foreground)] transition-opacity hover:opacity-70"
            >
              {outfit.name}
            </Link>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {outfit.itemCount} item{outfit.itemCount === 1 ? "" : "s"} · Updated{" "}
              {formattedDate}
            </p>
            {outfit.notes ? (
              <p className="mt-2 line-clamp-2 text-sm text-stone-500">{outfit.notes}</p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <AddToCalendarLink outfitId={outfit.id} />
            <Link href={`/outfits/${outfit.id}`} className="btn-ghost">
              Edit
            </Link>
            <DeleteOutfitButton outfitId={outfit.id} outfitName={outfit.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
