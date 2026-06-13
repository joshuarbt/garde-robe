import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";

export default async function OutfitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PageShell
      title="Outfits"
      description="Compose looks on a blank canvas using items from your wardrobe."
    >
      <Link
        href="/outfits/new"
        className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
      >
        Build outfit
      </Link>
      <p className="mt-4 text-sm text-stone-600">
        Saved outfits and load support are coming soon. For now, build and export a
        composition as PNG.
      </p>
    </PageShell>
  );
}
