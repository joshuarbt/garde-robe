import { THEME_CYCLE, THEME_STORAGE_KEY } from "@/lib/theme/constants";
import type { ThemeId } from "@/lib/theme/types";

export function isThemeId(value: string): value is ThemeId {
  return (THEME_CYCLE as string[]).includes(value);
}

export function getNextTheme(current: ThemeId): ThemeId {
  const index = THEME_CYCLE.indexOf(current);
  const nextIndex = index === -1 ? 0 : (index + 1) % THEME_CYCLE.length;
  return THEME_CYCLE[nextIndex];
}

/** Themes with a fixed palette — dark mode toggle should stay disabled when added. */
export function isFixedPaletteTheme(theme: ThemeId): boolean {
  return theme === "matrix" || theme === "gameboy";
}

export function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") {
    return "default";
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isThemeId(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }

  return "default";
}

export function applyThemeToDocument(theme: ThemeId): void {
  const root = document.documentElement;

  if (theme === "default") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}
