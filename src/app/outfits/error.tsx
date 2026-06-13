"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RouteError } from "@/components/ui/RouteError";

type OutfitsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OutfitsError({ error, reset }: OutfitsErrorProps) {
  return (
    <PageShell
      title="Outfits"
      description="Compose looks on a blank canvas using items from your wardrobe."
      wide
    >
      <RouteError
        title="Could not load your outfits"
        message={error.message || "Something went wrong while loading your saved outfits."}
        backHref="/outfits"
        backLabel="Back to outfits"
        reset={reset}
      />
    </PageShell>
  );
}
