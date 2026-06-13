"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RouteError } from "@/components/ui/RouteError";

type NewOutfitErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NewOutfitError({ error, reset }: NewOutfitErrorProps) {
  return (
    <PageShell
      title="Build outfit"
      description="Click wardrobe items to add them. Drag, resize, and rotate on the canvas."
      wide
    >
      <RouteError
        title="Could not load outfit builder"
        message={error.message || "Something went wrong while loading the outfit builder."}
        backHref="/outfits"
        backLabel="Back to outfits"
        reset={reset}
      />
    </PageShell>
  );
}
