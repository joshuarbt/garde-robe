import { PageShell } from "@/components/layout/PageShell";

export default function VoyagesLoading() {
  return (
    <PageShell title="Voyages" wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-sm border border-[var(--border-hairline)] p-4"
          >
            <div className="space-y-3">
              <div className="h-6 w-40 rounded-md bg-[var(--surface-muted)]" />
              <div className="h-4 w-28 rounded-md bg-[var(--surface-muted)]" />
              <div className="h-1 w-full rounded-full bg-[var(--surface-muted)]" />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
