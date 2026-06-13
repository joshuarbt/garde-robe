import Link from "next/link";
import { redirect } from "next/navigation";
import { OutfitBuilderLoader } from "@/components/canvas/OutfitBuilderLoader";
import { PageShell } from "@/components/layout/PageShell";
import { toWardrobeCanvasItems } from "@/lib/canvas/wardrobe-items";
import { getItems } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";

export default async function NewOutfitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const items = await getItems();
  const wardrobeItems = toWardrobeCanvasItems(items);

  return (
    <PageShell
      title="Build outfit"
      description="Click wardrobe items to add them. Drag, resize, and rotate on the canvas."
      wide
    >
      <Link href="/outfits" className="btn-ghost mb-8 inline-block">
        Back to outfits
      </Link>

      <OutfitBuilderLoader wardrobeItems={wardrobeItems} />
    </PageShell>
  );
}
