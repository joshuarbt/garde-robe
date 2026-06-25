import type { LucideIcon } from "lucide-react";

export type ThemeId =
  | "default"
  | "aero"
  | "matrix"
  | "gameboy"
  | "barbie"
  | "vaporwave"
  | "ghibli";

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  icon: LucideIcon;
  iconColor: string;
};
