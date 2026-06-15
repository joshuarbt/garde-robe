import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell
      title="Page introuvable"
      description="La page que vous recherchez n'existe pas ou a peut-être été supprimée."
    >
      <Link href="/" className="btn-primary inline-block">
        Retour à l&apos;accueil
      </Link>
    </PageShell>
  );
}
