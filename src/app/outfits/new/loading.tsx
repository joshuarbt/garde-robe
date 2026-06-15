import { PageShell } from "@/components/layout/PageShell";

export default function NewOutfitLoading() {
  return (
    <PageShell
      title="Composer une tenue"
      description="Cliquez sur les articles de la garde-robe pour les ajouter. Déplacez, redimensionnez et faites pivoter sur le canevas."
      wide
    >
      <div className="animate-pulse">
        <div className="mb-8 h-4 w-28 rounded-md bg-[var(--surface-muted)]" />
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="h-4 w-20 rounded-md bg-[var(--surface-muted)]" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-[var(--surface-muted)]"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-24 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-9 w-28 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-muted)]"
                />
              ))}
            </div>
            <div className="h-[524px] w-full max-w-[424px] border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
