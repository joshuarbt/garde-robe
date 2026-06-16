"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const ACTION_BAR_HEIGHT_VAR = "--mobile-action-bar-current";

type MobileActionBarProps = {
  children: React.ReactNode;
  /** When true, bar sits above tab bar (default). When false, flush to bottom (focus routes). */
  withTabBar?: boolean;
  className?: string;
};

export function MobileActionBar({
  children,
  withTabBar = true,
  className = "",
}: MobileActionBarProps) {
  const isDesktop = useIsDesktop();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDesktop) {
      document.documentElement.style.removeProperty(ACTION_BAR_HEIGHT_VAR);
      return;
    }

    const element = barRef.current;
    if (!element) {
      return;
    }

    function updateHeight() {
      document.documentElement.style.setProperty(
        ACTION_BAR_HEIGHT_VAR,
        `${element!.offsetHeight}px`,
      );
    }

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty(ACTION_BAR_HEIGHT_VAR);
    };
  }, [isDesktop]);

  if (isDesktop) {
    return null;
  }

  return (
    <div
      ref={barRef}
      className={`fixed inset-x-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--background)]/95 px-5 py-3 backdrop-blur-md ${className}`.trim()}
      style={{
        bottom: withTabBar
          ? "calc(var(--tab-bar-height) + env(safe-area-inset-bottom, 0px))"
          : "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {children}
    </div>
  );
}
