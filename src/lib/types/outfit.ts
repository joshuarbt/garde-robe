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

export type OutfitPreviewItem = {
  itemId: string;
  imageUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
};

export type OutfitSummary = {
  id: string;
  name: string;
  notes?: string | null;
  coverImageUrl?: string | null;
  previewItems: OutfitPreviewItem[];
  itemCount: number;
  createdAt: string;
  updatedAt: string;
};

export type OutfitWithPlacements = {
  id: string;
  name: string;
  notes?: string | null;
  coverImageUrl?: string | null;
  placements: CanvasItemPlacement[];
  createdAt: string;
  updatedAt: string;
};
