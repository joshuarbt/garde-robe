import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { TripsAddAction } from "@/components/voyages/TripsAddAction";
import { TripsList } from "@/components/voyages/TripsList";
import { getTrips } from "@/lib/trip/queries";
import { createClient } from "@/lib/supabase/server";

export default async function VoyagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const trips = await getTrips();

  return (
    <PageShell
      title="Voyages"
      description="Préparez votre valise tenue par tenue ou pièce par pièce."
      wide
      actionsAlign="baseline"
      actions={<TripsAddAction />}
    >
      {trips.length === 0 ? (
        <EmptyState
          message="Aucun voyage planifié."
          description="Créez un voyage et ajoutez des tenues ou des vêtements à préparer."
          actionLabel="Nouveau voyage"
          actionHref="/voyages/new"
        />
      ) : (
        <TripsList trips={trips} />
      )}
    </PageShell>
  );
}
