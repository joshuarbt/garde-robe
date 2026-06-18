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
import { BuilderActionBar } from "@/components/canvas/BuilderActionBar";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { OutfitCanvas } from "@/components/canvas/OutfitCanvas";
import { SaveOutfitForm } from "@/components/canvas/SaveOutfitForm";
import { useSaveOutfitForm } from "@/components/canvas/useSaveOutfitForm";
import { WardrobeSidebar } from "@/components/canvas/WardrobeSidebar";
import { WardrobeStrip } from "@/components/canvas/WardrobeStrip";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useMinWidth } from "@/hooks/useMediaQuery";
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
  const isDesktop = useIsDesktop();
  const isLgUp = useMinWidth(1024);
  const [placements, setPlacements] = useState<CanvasPlacementState[]>(initialPlacements);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>(
    {},
  );

  const saveForm = useSaveOutfitForm({
    placements,
    outfitId,
    initialName,
    initialNotes,
  });

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

  const canvasProps = {
    placements,
    loadedImages,
    selectedItemId,
    onSelect: setSelectedItemId,
    onPlacementChange: handlePlacementChange,
    stageRef,
    mobileScale: !isLgUp,
  };

  const toolbarProps = {
    hasSelection: selectedItemId !== null,
    hasPlacements: placements.length > 0,
    onBringForward: handleBringForward,
    onSendBackward: handleSendBackward,
    onDelete: handleDelete,
    onExport: handleExport,
  };

  const wardrobeProps = {
    items: wardrobeItems,
    placedItemIds,
    onAddItem: handleAddItem,
  };

  return (
    <div className="min-w-0">
      <div
        className={`grid min-w-0 gap-6 ${isLgUp ? "lg:grid-cols-[240px_minmax(0,1fr)]" : ""}`}
      >
        {isLgUp ? (
          <aside className="min-w-0">
            <WardrobeSidebar {...wardrobeProps} />
          </aside>
        ) : null}

        <div className="flex min-w-0 flex-col gap-4">
          <div className={`min-w-0 ${isDesktop ? "order-3" : "order-1"}`}>
            <OutfitCanvas {...canvasProps} />
          </div>

          {!isDesktop ? (
            <div className="order-2 min-w-0">
              <WardrobeStrip {...wardrobeProps} />
            </div>
          ) : null}

          <div className={isDesktop ? "order-2" : "order-3"}>
            <CanvasToolbar {...toolbarProps} />
          </div>

          {isDesktop ? (
            <div className="order-1">
              <SaveOutfitForm {...saveForm} />
            </div>
          ) : null}

          {!isDesktop ? (
            <div className="order-5">
              <BuilderActionBar {...saveForm} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
