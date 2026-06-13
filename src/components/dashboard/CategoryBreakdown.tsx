"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaggerItem, StaggerList } from "@/components/layout/motion";
import type { CategoryBreakdownEntry } from "@/lib/dashboard/queries";

const MAX_ROWS = 8;

type CategoryBreakdownProps = {
  breakdown: CategoryBreakdownEntry[];
  className?: string;
};

export function CategoryBreakdown({ breakdown, className }: CategoryBreakdownProps) {
  if (breakdown.length === 0) {
    return null;
  }

  const visibleRows = breakdown.slice(0, MAX_ROWS);
  const hiddenCount = breakdown.length - visibleRows.length;
  const maxCount = visibleRows[0]?.count ?? 1;

  return (
    <section className={className}>
      <SectionLabel>By category</SectionLabel>
      <StaggerList className="mt-4 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {visibleRows.map((entry) => (
          <StaggerItem key={entry.label}>
            <div className="py-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--foreground)]">{entry.label}</span>
                <span className="tabular-nums text-[var(--muted)]">
                  {entry.count} item{entry.count === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-2 h-px overflow-hidden bg-[var(--border-subtle)]">
                <div
                  className="h-full bg-stone-400"
                  style={{ width: `${(entry.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
      {hiddenCount > 0 ? (
        <p className="mt-3 text-xs text-stone-500">
          + {hiddenCount} more categor{hiddenCount === 1 ? "y" : "ies"}
        </p>
      ) : null}
    </section>
  );
}
