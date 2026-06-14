import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/canvas/constants";
import type { OutfitPreviewItem } from "@/lib/types/outfit";

export type PreviewBoundsItem = Pick<
  OutfitPreviewItem,
  "x" | "y" | "scale" | "rotation"
> & {
  width: number;
  height: number;
};

export type CompositionBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type PreviewFitTransform = {
  scale: number;
  originX: number;
  originY: number;
  translateX: number;
  translateY: number;
};

function getAxisAlignedHalfExtents(
  width: number,
  height: number,
  rotationDegrees: number,
): { halfWidth: number; halfHeight: number } {
  const radians = (rotationDegrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  return {
    halfWidth: (width * cos + height * sin) / 2,
    halfHeight: (width * sin + height * cos) / 2,
  };
}

export function computeCompositionBounds(
  items: PreviewBoundsItem[],
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT,
): CompositionBounds | null {
  if (items.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const item of items) {
    const width = item.width * item.scale;
    const height = item.height * item.scale;
    const { halfWidth, halfHeight } = getAxisAlignedHalfExtents(
      width,
      height,
      item.rotation,
    );

    minX = Math.min(minX, item.x - halfWidth);
    minY = Math.min(minY, item.y - halfHeight);
    maxX = Math.max(maxX, item.x + halfWidth);
    maxY = Math.max(maxY, item.y + halfHeight);
  }

  minX = Math.max(0, minX);
  minY = Math.max(0, minY);
  maxX = Math.min(canvasWidth, maxX);
  maxY = Math.min(canvasHeight, maxY);

  if (maxX <= minX || maxY <= minY) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

export function computeFitTransform(
  bounds: CompositionBounds,
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT,
  paddingRatio = 0.85,
): PreviewFitTransform {
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const contentCenterX = (bounds.minX + bounds.maxX) / 2;
  const contentCenterY = (bounds.minY + bounds.maxY) / 2;

  const scale = Math.min(
    (canvasWidth * paddingRatio) / contentWidth,
    (canvasHeight * paddingRatio) / contentHeight,
  );

  const originX = (contentCenterX / canvasWidth) * 100;
  const originY = (contentCenterY / canvasHeight) * 100;

  return {
    scale,
    originX,
    originY,
    translateX: 50 - originX,
    translateY: 50 - originY,
  };
}
