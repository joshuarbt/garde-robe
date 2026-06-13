"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RouteError } from "@/components/ui/RouteError";

type WardrobeErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WardrobeError({ error, reset }: WardrobeErrorProps) {
  return (
    <PageShell
      title="Wardrobe"
      description="Browse and manage your clothing, accessories, and jewelry."
      wide
    >
      <RouteError
        title="Could not load your wardrobe"
        message={error.message || "Something went wrong while loading your wardrobe."}
        backHref="/wardrobe"
        backLabel="Back to wardrobe"
        reset={reset}
      />
    </PageShell>
  );
}
