"use client";

import Link from "next/link";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import type { OutfitSummary } from "@/lib/types/outfit";

type OutfitCardProps = {
  outfit: OutfitSummary;
  formattedDate: string;
};

export function OutfitCard({ outfit, formattedDate }: OutfitCardProps) {
  return (
    <article>
      <Link href={`/outfits/${outfit.id}`} className="block active:opacity-80">
        <div className="overflow-hidden bg-[var(--surface-muted)]">
          <ItemImage
            src={outfit.previewImageUrl}
            alt={outfit.name}
            className="aspect-[3/4] w-full object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h2 className="text-title leading-snug">{outfit.name}</h2>
          <p className="text-caption">
            {outfit.itemCount} piece{outfit.itemCount === 1 ? "" : "s"} · {formattedDate}
          </p>
        </div>
      </Link>
    </article>
  );
}
