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
      title="Calendrier"
      description="Planifiez vos tenues. Assignez une tenue enregistrée par jour."
      wide
    >
      <RouteError
        title="Impossible de charger votre calendrier"
        message={error.message || "Une erreur s'est produite lors du chargement du calendrier."}
        backHref="/calendar"
        backLabel="Retour au calendrier"
        reset={reset}
      />
    </PageShell>
  );
}
