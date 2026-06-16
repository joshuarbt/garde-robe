import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { TripDetailClient } from "@/components/voyages/TripDetailClient";
import { TripDetailHeader } from "@/components/voyages/TripDetailHeader";
import { TripPackingList } from "@/components/voyages/TripPackingList";
import { TripProgress } from "@/components/voyages/TripProgress";
import { getOutfits } from "@/lib/outfit/queries";
import { getTripById, getTripPackingList } from "@/lib/trip/queries";
import { getItems } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const [trip, packingItems, allOutfits, wardrobeItems] = await Promise.all([
    getTripById(id),
    getTripPackingList(id),
    getOutfits(),
    getItems(),
  ]);

  if (!trip) {
    notFound();
  }

  const packedItemIds = packingItems.map((item) => item.itemId);

  return (
    <PageShell title={trip.name}>
      <Link href="/voyages" className="btn-ghost mb-6 inline-flex items-center">
        Retour
      </Link>

      <div className="space-y-6">
        <TripDetailHeader trip={trip} />
        <TripProgress items={packingItems} />
        <TripDetailClient
          tripId={trip.id}
          tripOutfits={trip.outfits}
          allOutfits={allOutfits}
          wardrobeItems={wardrobeItems}
          packedItemIds={packedItemIds}
        />

        {packingItems.length === 0 ? (
          <EmptyState
            message="Votre valise est vide."
            description="Ajoutez des tenues ou des vêtements pour commencer à préparer."
            className="py-12"
          />
        ) : (
          <TripPackingList
            key={packingItems
              .map((item) => `${item.itemId}:${item.isPacked}`)
              .join("|")}
            tripId={trip.id}
            initialItems={packingItems}
          />
        )}
      </div>
    </PageShell>
  );
}
