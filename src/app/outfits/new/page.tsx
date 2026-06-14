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
    <PageShell title="Build look" wide>
      <Link href="/outfits" className="btn-ghost mb-6 inline-block">
        Back
      </Link>
      <OutfitBuilderLoader wardrobeItems={wardrobeItems} />
    </PageShell>
  );
}
