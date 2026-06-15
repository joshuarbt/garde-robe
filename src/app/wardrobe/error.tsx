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
      title="Garde-robe"
      description="Parcourez et gérez vos vêtements, accessoires et bijoux."
      wide
    >
      <RouteError
        title="Impossible de charger votre garde-robe"
        message={error.message || "Une erreur s'est produite lors du chargement de votre garde-robe."}
        backHref="/wardrobe"
        backLabel="Retour à la garde-robe"
        reset={reset}
      />
    </PageShell>
  );
}
