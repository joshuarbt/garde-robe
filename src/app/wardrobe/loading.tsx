import { PageShell } from "@/components/layout/PageShell";

export default function WardrobeLoading() {
  return (
    <PageShell
      title="Wardrobe"
      description="Browse and manage your clothing, accessories, and jewelry."
      wide
    >
      <div className="animate-pulse">
        <div className="mb-8 h-4 w-16 rounded-md bg-[var(--surface-muted)]" />

        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-10 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-muted)]"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]"
              >
                <div className="aspect-[3/4] bg-[var(--surface-muted)]" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded-md bg-[var(--background)]" />
                  <div className="h-3 w-1/2 rounded-md bg-[var(--background)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
