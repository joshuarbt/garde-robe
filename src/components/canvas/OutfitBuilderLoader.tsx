"use client";

import dynamic from "next/dynamic";
import type { CanvasPlacementState, WardrobeCanvasItem } from "@/lib/types/outfit";

const OutfitBuilder = dynamic(
  () =>
    import("@/components/canvas/OutfitBuilder").then((module) => module.OutfitBuilder),
  {
    ssr: false,
    loading: () => <p className="text-sm text-stone-600">Loading outfit builder…</p>,
  },
);

type OutfitBuilderLoaderProps = {
  wardrobeItems: WardrobeCanvasItem[];
  initialPlacements?: CanvasPlacementState[];
  outfitId?: string;
  initialName?: string;
  initialNotes?: string;
};

export function OutfitBuilderLoader({
  wardrobeItems,
  initialPlacements,
  outfitId,
  initialName,
  initialNotes,
}: OutfitBuilderLoaderProps) {
  return (
    <OutfitBuilder
      wardrobeItems={wardrobeItems}
      initialPlacements={initialPlacements}
      outfitId={outfitId}
      initialName={initialName}
      initialNotes={initialNotes}
    />
  );
}
