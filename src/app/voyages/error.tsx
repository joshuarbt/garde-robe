"use client";

import { PageShell } from "@/components/layout/PageShell";
import { RouteError } from "@/components/ui/RouteError";

type VoyagesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function VoyagesError({ error, reset }: VoyagesErrorProps) {
  return (
    <PageShell title="Voyages" wide>
      <RouteError
        title="Impossible de charger vos voyages"
        message={error.message || "Une erreur s'est produite lors du chargement de vos voyages."}
        backHref="/voyages"
        backLabel="Retour aux voyages"
        reset={reset}
      />
    </PageShell>
  );
}
