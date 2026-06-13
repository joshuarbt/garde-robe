import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OutfitBuilderLoader } from "@/components/canvas/OutfitBuilderLoader";
import { DeleteOutfitButton } from "@/components/outfits/DeleteOutfitButton";
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
      description="Edit your saved outfit. Drag, resize, and rotate items on the canvas."
      wide
      actions={<DeleteOutfitButton outfitId={outfit.id} outfitName={outfit.name} />}
    >
      <Link href="/outfits" className="btn-ghost mb-6 inline-block">
        Back to outfits
      </Link>

      {saved === "1" ? (
        <p
          role="status"
          className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Outfit saved successfully.
        </p>
      ) : null}

      {outfit.notes ? (
        <p className="mb-6 text-sm text-[var(--muted)]">{outfit.notes}</p>
      ) : null}

      {missingCount > 0 ? (
        <p className="mb-6 text-sm text-amber-700">
          {missingCount} saved item{missingCount === 1 ? " is" : "s are"} no longer in
          your wardrobe and could not be loaded.
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
