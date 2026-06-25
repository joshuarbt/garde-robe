import {
  Droplets,
  Gamepad2,
  Heart,
  Leaf,
  Sun,
  Sunset,
  Terminal,
} from "lucide-react";
import type { ThemeId, ThemeMeta } from "@/lib/theme/types";

export const THEME_STORAGE_KEY = "garde-robe-theme";

export const THEME_CYCLE: ThemeId[] = [
  "default",
  "aero",
  "matrix",
  "gameboy",
  "barbie",
  "vaporwave",
  "ghibli",
];

export const THEME_META: Record<ThemeId, ThemeMeta> = {
  default: {
    id: "default",
    label: "Par défaut",
    icon: Sun,
    iconColor: "var(--foreground)",
  },
  aero: {
    id: "aero",
    label: "Aero",
    icon: Droplets,
    iconColor: "#0077b6",
  },
  matrix: {
    id: "matrix",
    label: "Matrix",
    icon: Terminal,
    iconColor: "#00ff41",
  },
  gameboy: {
    id: "gameboy",
    label: "Game Boy",
    icon: Gamepad2,
    iconColor: "#8bac0f",
  },
  barbie: {
    id: "barbie",
    label: "Barbie",
    icon: Heart,
    iconColor: "#ff69b4",
  },
  vaporwave: {
    id: "vaporwave",
    label: "Vaporwave",
    icon: Sunset,
    iconColor: "#b44fff",
  },
  ghibli: {
    id: "ghibli",
    label: "Ghibli",
    icon: Leaf,
    iconColor: "#7bc47e",
  },
};
