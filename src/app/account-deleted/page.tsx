import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function AccountDeletedPage() {
  return (
    <PageShell
      title="Compte supprimé"
      subtitle="Votre compte et toutes les données associées ont été définitivement supprimés."
      wide
    >
      <p className="text-caption text-[var(--muted)]">
        Cela inclut vos vêtements, photos, tenues, entrées du calendrier et identifiants de connexion.
        Si vous créez un nouveau compte à l&apos;avenir, aucune de vos données précédentes ne pourra être
        récupérée.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
        <Link href="/signup" className="btn-secondary">
          Créer un nouveau compte
        </Link>
      </div>
    </PageShell>
  );
}
