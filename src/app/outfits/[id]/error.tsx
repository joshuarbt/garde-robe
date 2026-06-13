"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RouteError } from "@/components/ui/RouteError";

type EditOutfitErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EditOutfitError({ error, reset }: EditOutfitErrorProps) {
  return (
    <PageShell
      title="Outfit"
      description="Edit your saved outfit. Drag, resize, and rotate items on the canvas."
      wide
    >
      <RouteError
        title="Could not load this outfit"
        message={error.message || "Something went wrong while loading this outfit."}
        backHref="/outfits"
        backLabel="Back to outfits"
        reset={reset}
      />
    </PageShell>
  );
}
