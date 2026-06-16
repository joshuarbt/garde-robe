import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { TripForm } from "@/components/voyages/TripForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewVoyagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PageShell title="Nouveau voyage">
      <Link href="/voyages" className="btn-ghost mb-6 inline-flex items-center">
        Retour
      </Link>
      <TripForm />
    </PageShell>
  );
}
