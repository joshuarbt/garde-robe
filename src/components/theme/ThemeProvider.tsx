"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { THEME_META, THEME_STORAGE_KEY } from "@/lib/theme/constants";
import {
  applyThemeToDocument,
  getNextTheme,
  readStoredTheme,
} from "@/lib/theme/cycle";
import type { ThemeId } from "@/lib/theme/types";

type ThemeContextValue = {
  theme: ThemeId;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeId>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    setTheme(stored);
    applyThemeToDocument(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyThemeToDocument(theme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, mounted]);

  const cycleTheme = useCallback(() => {
    setTheme((current) => getNextTheme(current));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      cycleTheme,
    }),
    [theme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export function useThemeMeta() {
  const { theme } = useTheme();
  return THEME_META[theme];
}
