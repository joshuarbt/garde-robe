"use client";

import { OutfitCard } from "@/components/outfits/OutfitCard";
import { StaggerItem, StaggerList } from "@/components/layout/motion";
import { formatOutfitDate } from "@/lib/format/date";
import type { OutfitSummary } from "@/lib/types/outfit";

type OutfitsListProps = {
  outfits: OutfitSummary[];
};

export function OutfitsList({ outfits }: OutfitsListProps) {
  return (
    <StaggerList
      as="ul"
      className="grid grid-cols-2 gap-x-4 gap-y-[var(--space-grid-y)] md:grid-cols-3"
    >
      {outfits.map((outfit, index) => (
        <StaggerItem key={outfit.id} as="li" index={index}>
          <OutfitCard
            outfit={outfit}
            formattedDate={formatOutfitDate(outfit.updatedAt)}
          />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
