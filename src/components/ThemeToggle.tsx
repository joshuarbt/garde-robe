"use client";

import { useTheme, useThemeMeta } from "@/components/theme/ThemeProvider";
import { THEME_META } from "@/lib/theme/constants";
import { getNextTheme } from "@/lib/theme/cycle";
import { Icon } from "@/components/ui/Icon";

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  const meta = useThemeMeta();
  const nextTheme = getNextTheme(theme);
  const nextLabel = THEME_META[nextTheme].label;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="btn-icon shrink-0"
      aria-label={`Changer de thème (actuel : ${meta.label}, suivant : ${nextLabel})`}
      title={`Thème : ${meta.label}`}
    >
      <span style={{ color: meta.iconColor }}>
        <Icon icon={meta.icon} size="md" className="transition-colors" />
      </span>
    </button>
  );
}
