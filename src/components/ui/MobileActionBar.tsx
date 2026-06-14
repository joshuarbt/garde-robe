"use client";

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
  return (
    <div
      className={`fixed inset-x-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--background)]/95 px-5 py-3 backdrop-blur-md md:hidden ${className}`.trim()}
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
