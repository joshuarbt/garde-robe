import { computePackingProgress } from "@/lib/trip/packing";
import type { TripPackingItem } from "@/lib/types/trip";

type TripProgressProps = {
  items: TripPackingItem[];
};

export function TripProgress({ items }: TripProgressProps) {
  const { packedCount, totalCount } = computePackingProgress(
    items.map((item) => ({ isPacked: item.isPacked })),
  );

  if (totalCount === 0) {
    return null;
  }

  const percent = Math.round((packedCount / totalCount) * 100);

  return (
    <div className="space-y-2">
      <p className="text-body font-medium">
        {packedCount}/{totalCount} vêtements préparés
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full bg-[var(--foreground)] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
