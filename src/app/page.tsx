import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/wardrobe");
  }

  return (
    <PageShell
      compact={false}
      title="Votre garde-robe personnelle"
      description="Cataloguez ce que vous possédez et composez des tenues visuellement — vêtements, accessoires et bijoux au même endroit."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/login" className="btn-primary">
          Se connecter
        </Link>
        <Link href="/signup" className="btn-secondary">
          Créer un compte
        </Link>
      </div>
    </PageShell>
  );
}
