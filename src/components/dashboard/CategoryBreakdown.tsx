import type { CategoryBreakdownEntry } from "@/lib/dashboard/queries";
import { formatCount } from "@/lib/i18n/plural";

const MAX_INLINE = 6;

type CategoryBreakdownProps = {
  breakdown: CategoryBreakdownEntry[];
  className?: string;
};

export function CategoryBreakdown({ breakdown, className }: CategoryBreakdownProps) {
  if (breakdown.length === 0) {
    return null;
  }

  const visibleRows = breakdown.slice(0, MAX_INLINE);
  const hiddenCount = breakdown.length - visibleRows.length;

  const inlineText = visibleRows
    .map((entry) => `${entry.count} ${entry.label.toLowerCase()}`)
    .join(", ");

  return (
    <p className={`text-caption break-words ${className ?? ""}`.trim()}>
      {inlineText}
      {hiddenCount > 0
        ? `, et ${formatCount(hiddenCount, "autre catégorie", "autres catégories")}`
        : ""}
    </p>
  );
}
