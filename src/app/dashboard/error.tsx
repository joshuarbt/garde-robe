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
      title="Collection"
      description="Votre garde-robe en un coup d'œil."
      wide
    >
      <RouteError
        title="Impossible de charger votre collection"
        message={error.message || "Une erreur s'est produite lors du chargement des statistiques de votre garde-robe."}
        backHref="/dashboard"
        backLabel="Retour à la collection"
        reset={reset}
      />
    </PageShell>
  );
}
