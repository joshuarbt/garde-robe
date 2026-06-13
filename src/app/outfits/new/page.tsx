import Link from "next/link";
import { redirect } from "next/navigation";
import { OutfitBuilderLoader } from "@/components/canvas/OutfitBuilderLoader";
import { getItems } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";
import type { WardrobeCanvasItem } from "@/lib/types/outfit";

export default async function NewOutfitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const items = await getItems();
  const wardrobeItems: WardrobeCanvasItem[] = items
    .filter((item) => item.image_url)
    .map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.image_url as string,
    }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link href="/outfits" className="text-sm text-stone-600 hover:text-stone-900">
          Back to outfits
        </Link>
        <h1 className="mt-4 text-2xl font-medium tracking-tight text-stone-900">
          Build outfit
        </h1>
        <p className="mt-2 text-stone-600">
          Click wardrobe items to add them. Drag, resize, and rotate on the canvas.
        </p>
      </div>

      <OutfitBuilderLoader wardrobeItems={wardrobeItems} />
    </div>
  );
}
