"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import { downloadStagePng } from "@/lib/canvas/export";
import { loadCanvasImage } from "@/lib/canvas/loadImage";
import {
  createDefaultPlacement,
  getNextZIndex,
  sortByZIndex,
} from "@/lib/canvas/placements";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { OutfitCanvas } from "@/components/canvas/OutfitCanvas";
import { SaveOutfitForm } from "@/components/canvas/SaveOutfitForm";
import { WardrobeSidebar } from "@/components/canvas/WardrobeSidebar";
import type { CanvasPlacementState, WardrobeCanvasItem } from "@/lib/types/outfit";

type OutfitBuilderProps = {
  wardrobeItems: WardrobeCanvasItem[];
  initialPlacements?: CanvasPlacementState[];
  outfitId?: string;
  initialName?: string;
  initialNotes?: string;
};

function swapZIndex(
  placements: CanvasPlacementState[],
  itemId: string,
  direction: "forward" | "backward",
): CanvasPlacementState[] {
  const sorted = sortByZIndex(placements);
  const index = sorted.findIndex((placement) => placement.itemId === itemId);

  if (index === -1) {
    return placements;
  }

  const swapIndex = direction === "forward" ? index + 1 : index - 1;
  if (swapIndex < 0 || swapIndex >= sorted.length) {
    return placements;
  }

  const current = sorted[index];
  const target = sorted[swapIndex];

  return placements.map((placement) => {
    if (placement.itemId === current.itemId) {
      return { ...placement, zIndex: target.zIndex };
    }

    if (placement.itemId === target.itemId) {
      return { ...placement, zIndex: current.zIndex };
    }

    return placement;
  });
}

export function OutfitBuilder({
  wardrobeItems,
  initialPlacements = [],
  outfitId,
  initialName,
  initialNotes,
}: OutfitBuilderProps) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [placements, setPlacements] = useState<CanvasPlacementState[]>(initialPlacements);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>(
    {},
  );

  const placedItemIds = useMemo(
    () => new Set(placements.map((placement) => placement.itemId)),
    [placements],
  );

  useEffect(() => {
    let cancelled = false;

    async function preloadInitialImages() {
      for (const placement of initialPlacements) {
        const item = wardrobeItems.find((entry) => entry.id === placement.itemId);
        if (!item) {
          continue;
        }

        try {
          const image = await loadCanvasImage(item.imageUrl);
          if (!cancelled) {
            setLoadedImages((current) => ({ ...current, [item.id]: image }));
          }
        } catch {
          // Skip items that fail to load
        }
      }
    }

    if (initialPlacements.length > 0) {
      void preloadInitialImages();
    }

    return () => {
      cancelled = true;
    };
  }, [initialPlacements, wardrobeItems]);

  const ensureImageLoaded = useCallback(async (item: WardrobeCanvasItem) => {
    if (loadedImages[item.id]) {
      return;
    }

    const image = await loadCanvasImage(item.imageUrl);
    setLoadedImages((current) => ({ ...current, [item.id]: image }));
  }, [loadedImages]);

  async function handleAddItem(item: WardrobeCanvasItem) {
    if (placedItemIds.has(item.id)) {
      return;
    }

    try {
      await ensureImageLoaded(item);
    } catch {
      return;
    }

    setPlacements((current) => [
      ...current,
      createDefaultPlacement(item.id, getNextZIndex(current)),
    ]);
    setSelectedItemId(item.id);
  }

  function handlePlacementChange(
    itemId: string,
    patch: Partial<CanvasPlacementState>,
  ) {
    setPlacements((current) =>
      current.map((placement) =>
        placement.itemId === itemId ? { ...placement, ...patch } : placement,
      ),
    );
  }

  function handleBringForward() {
    if (!selectedItemId) {
      return;
    }

    setPlacements((current) => swapZIndex(current, selectedItemId, "forward"));
  }

  function handleSendBackward() {
    if (!selectedItemId) {
      return;
    }

    setPlacements((current) => swapZIndex(current, selectedItemId, "backward"));
  }

  function handleDelete() {
    if (!selectedItemId) {
      return;
    }

    setPlacements((current) =>
      current.filter((placement) => placement.itemId !== selectedItemId),
    );
    setSelectedItemId(null);
  }

  function handleExport() {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    setSelectedItemId(null);

    window.setTimeout(() => {
      if (stageRef.current) {
        downloadStagePng(stageRef.current, "outfit.png");
      }
    }, 50);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside>
        <WardrobeSidebar
          items={wardrobeItems}
          placedItemIds={placedItemIds}
          onAddItem={handleAddItem}
        />
      </aside>

      <div className="space-y-4">
        <SaveOutfitForm
          placements={placements}
          outfitId={outfitId}
          initialName={initialName}
          initialNotes={initialNotes}
        />

        <CanvasToolbar
          hasSelection={selectedItemId !== null}
          hasPlacements={placements.length > 0}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onDelete={handleDelete}
          onExport={handleExport}
        />

        <OutfitCanvas
          placements={placements}
          loadedImages={loadedImages}
          selectedItemId={selectedItemId}
          onSelect={setSelectedItemId}
          onPlacementChange={handlePlacementChange}
          stageRef={stageRef}
        />
      </div>
    </div>
  );
}
