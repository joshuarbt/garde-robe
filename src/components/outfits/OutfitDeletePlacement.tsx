"use client";

import { DeleteOutfitButton } from "@/components/outfits/DeleteOutfitButton";
import { useIsDesktop } from "@/hooks/useIsDesktop";

type OutfitDeletePlacementProps = {
  outfitId: string;
  outfitName: string;
  placement: "header" | "body";
};

export function OutfitDeletePlacement({
  outfitId,
  outfitName,
  placement,
}: OutfitDeletePlacementProps) {
  const isDesktop = useIsDesktop();

  if (placement === "header") {
    if (!isDesktop) {
      return null;
    }

    return <DeleteOutfitButton outfitId={outfitId} outfitName={outfitName} />;
  }

  if (isDesktop) {
    return null;
  }

  return (
    <div className="mb-6">
      <DeleteOutfitButton outfitId={outfitId} outfitName={outfitName} />
    </div>
  );
}
