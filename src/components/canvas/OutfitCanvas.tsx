"use client";

import { useEffect, useRef } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import type Konva from "konva";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/canvas/constants";
import { sortByZIndex } from "@/lib/canvas/placements";
import { CanvasImageNode } from "@/components/canvas/CanvasImageNode";
import type { CanvasPlacementState } from "@/lib/types/outfit";

type OutfitCanvasProps = {
  placements: CanvasPlacementState[];
  loadedImages: Record<string, HTMLImageElement>;
  selectedItemId: string | null;
  onSelect: (itemId: string | null) => void;
  onPlacementChange: (itemId: string, patch: Partial<CanvasPlacementState>) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
};

export function OutfitCanvas({
  placements,
  loadedImages,
  selectedItemId,
  onSelect,
  onPlacementChange,
  stageRef,
}: OutfitCanvasProps) {
  const transformerRef = useRef<Konva.Transformer>(null);
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

  return (
    <div className="inline-block rounded-lg border border-stone-200 bg-white shadow-sm">
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
}
