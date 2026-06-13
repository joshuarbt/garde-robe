import { PageShell } from "@/components/layout/PageShell";

export default function OutfitsLoading() {
  return (
    <PageShell
      title="Outfits"
      description="Compose looks on a blank canvas using items from your wardrobe."
      wide
    >
      <div className="animate-pulse divide-y divide-[var(--border-subtle)]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-5 py-6">
            <div className="h-28 w-28 shrink-0 bg-[var(--surface-muted)]" />
            <div className="min-w-0 flex-1 space-y-3 pt-1">
              <div className="h-6 w-48 rounded-md bg-[var(--surface-muted)]" />
              <div className="h-4 w-64 rounded-md bg-[var(--surface-muted)]" />
              <div className="flex gap-3 pt-1">
                <div className="h-4 w-20 rounded-md bg-[var(--surface-muted)]" />
                <div className="h-4 w-12 rounded-md bg-[var(--surface-muted)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
