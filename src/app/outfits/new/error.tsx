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
      title="Composer une tenue"
      description="Cliquez sur les articles de la garde-robe pour les ajouter. Déplacez, redimensionnez et faites pivoter sur le canevas."
      wide
    >
      <RouteError
        title="Impossible de charger le créateur de tenues"
        message={error.message || "Une erreur s'est produite lors du chargement du créateur de tenues."}
        backHref="/outfits"
        backLabel="Retour aux tenues"
        reset={reset}
      />
    </PageShell>
  );
}
