export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 500;

export const DEFAULT_PLACEMENT_SCALE = 0.5;

export function getDefaultPlacementPosition(): { x: number; y: number } {
  return {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
  };
}
