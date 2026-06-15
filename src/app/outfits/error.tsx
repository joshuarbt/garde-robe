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
      title="Tenues"
      description="Composez des tenues sur un canevas vierge avec les articles de votre garde-robe."
      wide
    >
      <RouteError
        title="Impossible de charger vos tenues"
        message={error.message || "Une erreur s'est produite lors du chargement de vos tenues enregistrées."}
        backHref="/outfits"
        backLabel="Retour aux tenues"
        reset={reset}
      />
    </PageShell>
  );
}
