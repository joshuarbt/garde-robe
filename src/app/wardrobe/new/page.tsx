import Link from "next/link";
import { redirect } from "next/navigation";
import { ItemForm } from "@/components/wardrobe/ItemForm";
import { PageShell } from "@/components/layout/PageShell";
import { getWardrobeLookups, getProfileCurrency } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";

export default async function NewWardrobeItemPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [lookups, defaultCurrency] = await Promise.all([
    getWardrobeLookups(),
    getProfileCurrency(),
  ]);

  return (
    <PageShell title="Ajouter une pièce">
      <Link href="/wardrobe" className="btn-ghost mb-6 inline-flex items-center">
        Retour
      </Link>
      <ItemForm
        lookups={lookups}
        userId={user.id}
        defaultCurrency={defaultCurrency}
        submitLabel="Enregistrer"
      />
    </PageShell>
  );
}
