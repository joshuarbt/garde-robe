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
      title="Tenue"
      description="Modifiez votre tenue enregistrée. Déplacez, redimensionnez et faites pivoter les articles sur le canevas."
      wide
    >
      <RouteError
        title="Impossible de charger cette tenue"
        message={error.message || "Une erreur s'est produite lors du chargement de cette tenue."}
        backHref="/outfits"
        backLabel="Retour aux tenues"
        reset={reset}
      />
    </PageShell>
  );
}
