import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatCount } from "@/lib/i18n/plural";
import { OutfitBuilderLoader } from "@/components/canvas/OutfitBuilderLoader";
import { OutfitDeletePlacement } from "@/components/outfits/OutfitDeletePlacement";
import { PageShell } from "@/components/layout/PageShell";
import {
  filterPlacementsForWardrobe,
  toWardrobeCanvasItems,
} from "@/lib/canvas/wardrobe-items";
import { getOutfitById } from "@/lib/outfit/queries";
import { getItems } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";

type EditOutfitPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditOutfitPage({
  params,
  searchParams,
}: EditOutfitPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const { saved } = await searchParams;
  const [outfit, items] = await Promise.all([getOutfitById(id), getItems()]);

  if (!outfit) {
    notFound();
  }

  const wardrobeItems = toWardrobeCanvasItems(items);
  const initialPlacements = filterPlacementsForWardrobe(
    outfit.placements,
    wardrobeItems,
  );

  const savedCount = outfit.placements.length;
  const loadedCount = initialPlacements.length;
  const missingCount = savedCount - loadedCount;

  return (
    <PageShell
      title={outfit.name}
      wide
      actions={
        <OutfitDeletePlacement
          outfitId={outfit.id}
          outfitName={outfit.name}
          placement="header"
        />
      }
    >
      <OutfitDeletePlacement
        outfitId={outfit.id}
        outfitName={outfit.name}
        placement="body"
      />

      <Link href="/outfits" className="btn-ghost mb-6 inline-flex items-center">
        Retour
      </Link>

      {saved === "1" ? (
        <p role="status" className="alert-success mb-6">
          Tenue enregistrée.
        </p>
      ) : null}

      {outfit.notes ? (
        <p className="text-meta mb-6">{outfit.notes}</p>
      ) : null}

      {missingCount > 0 ? (
        <p className="alert-warning mb-6">
          {formatCount(missingCount, "vêtement n'a pas pu être chargé", "vêtements n'ont pas pu être chargés")}.
        </p>
      ) : null}

      <OutfitBuilderLoader
        wardrobeItems={wardrobeItems}
        initialPlacements={initialPlacements}
        outfitId={outfit.id}
        initialName={outfit.name}
        initialNotes={outfit.notes ?? ""}
      />
    </PageShell>
  );
}
