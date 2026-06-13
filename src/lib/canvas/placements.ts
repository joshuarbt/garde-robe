import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DEFAULT_PLACEMENT_SCALE,
  getDefaultPlacementPosition,
} from "@/lib/canvas/constants";
import type {
  CanvasItemPlacement,
  CanvasPlacementState,
  WardrobeCanvasItem,
} from "@/lib/types/outfit";

export function createDefaultPlacement(
  itemId: string,
  zIndex: number,
): CanvasPlacementState {
  const { x, y } = getDefaultPlacementPosition();

  return {
    itemId,
    x,
    y,
    scale: DEFAULT_PLACEMENT_SCALE,
    rotation: 0,
    zIndex,
  };
}

export function sortByZIndex(
  placements: CanvasPlacementState[],
): CanvasPlacementState[] {
  return [...placements].sort((a, b) => a.zIndex - b.zIndex);
}

export function getNextZIndex(placements: CanvasPlacementState[]): number {
  if (placements.length === 0) {
    return 0;
  }

  return Math.max(...placements.map((placement) => placement.zIndex)) + 1;
}

export function toCanvasItemPlacements(
  states: CanvasPlacementState[],
): CanvasItemPlacement[] {
  return sortByZIndex(states).map(({ itemId, x, y, scale, rotation, zIndex }) => ({
    itemId,
    x,
    y,
    scale,
    rotation,
    zIndex,
  }));
}

export type OutfitItemRow = {
  item_id: string;
  position_x: number;
  position_y: number;
  scale: number;
  rotation: number;
  z_index: number;
};

export function fromOutfitItemRows(
  rows: OutfitItemRow[],
  wardrobeItems: WardrobeCanvasItem[],
): CanvasPlacementState[] {
  const wardrobeIds = new Set(wardrobeItems.map((item) => item.id));

  return rows
    .filter((row) => wardrobeIds.has(row.item_id))
    .map((row) => ({
      itemId: row.item_id,
      x: row.position_x,
      y: row.position_y,
      scale: row.scale,
      rotation: row.rotation,
      zIndex: row.z_index,
    }));
}

export function isWithinCanvasBounds(x: number, y: number): boolean {
  return x >= 0 && x <= CANVAS_WIDTH && y >= 0 && y <= CANVAS_HEIGHT;
}
