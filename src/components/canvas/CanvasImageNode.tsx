"use client";

import type Konva from "konva";
import { Image } from "react-konva";
import type { CanvasPlacementState } from "@/lib/types/outfit";

type CanvasImageNodeProps = {
  placement: CanvasPlacementState;
  image: HTMLImageElement;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
  onChange: (itemId: string, patch: Partial<CanvasPlacementState>) => void;
};

export function CanvasImageNode({
  placement,
  image,
  isSelected,
  onSelect,
  onChange,
}: CanvasImageNodeProps) {
  function handleTransformEnd(event: Konva.KonvaEventObject<Event>) {
    const node = event.target as Konva.Image;
    const nextScale = node.scaleX();

    node.scaleX(1);
    node.scaleY(1);

    onChange(placement.itemId, {
      x: node.x(),
      y: node.y(),
      scale: nextScale,
      rotation: node.rotation(),
    });
  }

  return (
    // Konva Image is canvas-backed, not an HTML img — no alt prop available
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      id={placement.itemId}
      image={image}
      x={placement.x}
      y={placement.y}
      offsetX={image.width / 2}
      offsetY={image.height / 2}
      scaleX={placement.scale}
      scaleY={placement.scale}
      rotation={placement.rotation}
      draggable
      onClick={() => onSelect(placement.itemId)}
      onTap={() => onSelect(placement.itemId)}
      onDragEnd={(event) => {
        onChange(placement.itemId, {
          x: event.target.x(),
          y: event.target.y(),
        });
      }}
      onTransformEnd={handleTransformEnd}
      shadowForStrokeEnabled={false}
      stroke={isSelected ? "#292524" : undefined}
      strokeWidth={isSelected ? 1 : 0}
    />
  );
}
