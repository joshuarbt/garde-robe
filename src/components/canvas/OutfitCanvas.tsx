"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import type Konva from "konva";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/canvas/constants";
import { sortByZIndex } from "@/lib/canvas/placements";
import { CanvasImageNode } from "@/components/canvas/CanvasImageNode";
import type { CanvasPlacementState } from "@/lib/types/outfit";

/** Stage outer box: 400×500 canvas + 12px padding (`p-3`) on each side */
const STAGE_PADDING = 24;
const OUTER_WIDTH = CANVAS_WIDTH + STAGE_PADDING;
const OUTER_HEIGHT = CANVAS_HEIGHT + STAGE_PADDING;
/** Konva transformer anchors extend outside the stage bounds */
const TRANSFORMER_BLEED = 12;
const LAYOUT_WIDTH = OUTER_WIDTH + TRANSFORMER_BLEED * 2;
const LAYOUT_HEIGHT = OUTER_HEIGHT + TRANSFORMER_BLEED * 2;

type OutfitCanvasProps = {
  placements: CanvasPlacementState[];
  loadedImages: Record<string, HTMLImageElement>;
  selectedItemId: string | null;
  onSelect: (itemId: string | null) => void;
  onPlacementChange: (itemId: string, patch: Partial<CanvasPlacementState>) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
  mobileScale?: boolean;
};

export function OutfitCanvas({
  placements,
  loadedImages,
  selectedItemId,
  onSelect,
  onPlacementChange,
  stageRef,
  mobileScale = false,
}: OutfitCanvasProps) {
  const transformerRef = useRef<Konva.Transformer>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const sortedPlacements = sortByZIndex(placements);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (!transformer || !stage) {
      return;
    }

    if (!selectedItemId) {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
      return;
    }

    const selectedNode = stage.findOne(`#${selectedItemId}`);
    if (selectedNode) {
      transformer.nodes([selectedNode]);
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedItemId, placements, stageRef]);

  useLayoutEffect(() => {
    if (!mobileScale) {
      return;
    }

    const element = measureRef.current;
    if (!element) {
      return;
    }

    function updateScale() {
      const availableWidth = element!.clientWidth;
      setScale(Math.min(1, availableWidth / LAYOUT_WIDTH));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, [mobileScale]);

  const stageContent = (
    <div className="inline-block border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
      <Stage
        ref={stageRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={(event) => {
          if (event.target === event.target.getStage()) {
            onSelect(null);
          }
        }}
        onTouchStart={(event) => {
          if (event.target === event.target.getStage()) {
            onSelect(null);
          }
        }}
      >
        <Layer>
          {sortedPlacements.map((placement) => {
            const image = loadedImages[placement.itemId];
            if (!image) {
              return null;
            }

            return (
              <CanvasImageNode
                key={placement.itemId}
                placement={placement}
                image={image}
                isSelected={selectedItemId === placement.itemId}
                onSelect={onSelect}
                onChange={onPlacementChange}
              />
            );
          })}
          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 20 || newBox.height < 20) {
                return oldBox;
              }

              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );

  if (mobileScale) {
    const scaledWidth = LAYOUT_WIDTH * scale;
    const scaledHeight = LAYOUT_HEIGHT * scale;

    return (
      <div ref={measureRef} className="min-w-0 w-full">
        <div
          className="mx-auto overflow-hidden"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <div
            style={{
              width: LAYOUT_WIDTH,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <div style={{ padding: TRANSFORMER_BLEED }}>{stageContent}</div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="max-w-full overflow-x-auto">{stageContent}</div>;
}
