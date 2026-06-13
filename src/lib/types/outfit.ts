export type CanvasItemPlacement = {
  itemId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
};

export type CanvasPlacementState = CanvasItemPlacement;

export type WardrobeCanvasItem = {
  id: string;
  name: string;
  imageUrl: string;
};

export type Outfit = {
  id: string;
  name: string;
  items: CanvasItemPlacement[];
};
