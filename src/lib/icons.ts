import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Ellipsis,
  Gem,
  Layers,
  LayoutGrid,
  ListFilter,
  Luggage,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export type { LucideIcon };

/** Navigation tab icons — one metaphor per destination. */
export const navIcons = {
  wardrobe: LayoutGrid,
  outfits: Layers,
  calendar: Calendar,
  collection: Gem,
  voyages: Luggage,
} as const satisfies Record<string, LucideIcon>;

/** Action icons — one icon per semantic meaning app-wide. */
export const actionIcons = {
  add: Plus,
  filter: ListFilter,
  close: X,
  delete: Trash2,
  more: Ellipsis,
  layerUp: ChevronUp,
  layerDown: ChevronDown,
  export: Download,
  monthPrev: ChevronLeft,
  monthNext: ChevronRight,
  expand: ChevronDown,
  remove: X,
} as const satisfies Record<string, LucideIcon>;

/** Flat export for direct use with Icon component. */
export const icons = {
  ...navIcons,
  ...actionIcons,
} as const;
