"use client";

import { OutfitListItem } from "@/components/outfits/OutfitListItem";
import { StaggerItem, StaggerList } from "@/components/layout/motion";
import { formatOutfitDate } from "@/lib/format/date";
import type { OutfitSummary } from "@/lib/types/outfit";

type OutfitsListProps = {
  outfits: OutfitSummary[];
};

export function OutfitsList({ outfits }: OutfitsListProps) {
  return (
    <StaggerList as="ul" className="divide-y divide-[var(--border-subtle)]">
      {outfits.map((outfit) => (
        <StaggerItem key={outfit.id} as="li">
          <OutfitListItem
            outfit={outfit}
            formattedDate={formatOutfitDate(outfit.updatedAt)}
          />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
