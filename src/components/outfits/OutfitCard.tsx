"use client";

import Link from "next/link";
import { OutfitPreview } from "@/components/outfits/OutfitPreview";
import { formatCount } from "@/lib/i18n/plural";
import type { OutfitSummary } from "@/lib/types/outfit";

type OutfitCardProps = {
  outfit: OutfitSummary;
  formattedDate: string;
};

export function OutfitCard({ outfit, formattedDate }: OutfitCardProps) {
  return (
    <article>
      <Link href={`/outfits/${outfit.id}`} className="block active:opacity-80">
        <OutfitPreview
          items={outfit.previewItems}
          alt={outfit.name}
          variant="card"
        />
        <div className="mt-4 space-y-1">
          <h2 className="text-title leading-snug">{outfit.name}</h2>
          <p className="text-caption">
            {formatCount(outfit.itemCount, "vêtement", "vêtements")} · {formattedDate}
          </p>
        </div>
      </Link>
    </article>
  );
}
