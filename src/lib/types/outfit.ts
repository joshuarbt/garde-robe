export type CanvasItemPlacement = {
  itemId: string;
  x: number;
  y: number;
  scale: number;
  rotation?: number;
};

export type Outfit = {
  id: string;
  name: string;
  items: CanvasItemPlacement[];
};
