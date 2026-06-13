"use client";

import dynamic from "next/dynamic";
import type { WardrobeCanvasItem } from "@/lib/types/outfit";

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
};

export function OutfitBuilderLoader({ wardrobeItems }: OutfitBuilderLoaderProps) {
  return <OutfitBuilder wardrobeItems={wardrobeItems} />;
}
