"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RouteError } from "@/components/ui/RouteError";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <PageShell
      title="Dashboard"
      description="Your wardrobe at a glance."
      wide
    >
      <RouteError
        title="Could not load your dashboard"
        message={error.message || "Something went wrong while loading your wardrobe stats."}
        backHref="/dashboard"
        backLabel="Back to dashboard"
        reset={reset}
      />
    </PageShell>
  );
}
