"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RouteError } from "@/components/ui/RouteError";

type CalendarErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CalendarError({ error, reset }: CalendarErrorProps) {
  return (
    <PageShell
      title="Calendar"
      description="Plan what to wear. Assign one saved outfit per day."
      wide
    >
      <RouteError
        title="Could not load your calendar"
        message={error.message || "Something went wrong while loading calendar entries."}
        backHref="/calendar"
        backLabel="Back to calendar"
        reset={reset}
      />
    </PageShell>
  );
}
