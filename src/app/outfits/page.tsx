import Link from "next/link";
import { redirect } from "next/navigation";
import { OutfitsList } from "@/components/outfits/OutfitsList";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOutfits } from "@/lib/outfit/queries";
import { createClient } from "@/lib/supabase/server";

export default async function OutfitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const outfits = await getOutfits();

  return (
    <PageShell
      title="Outfits"
      description="Compose looks on a blank canvas using items from your wardrobe."
      wide
      actions={
        <Link href="/outfits/new" className="btn-primary">
          Build outfit
        </Link>
      }
    >
      {outfits.length === 0 ? (
        <EmptyState
          message="No saved outfits yet."
          description="Build a look on the canvas, name it, and save it here."
          actionLabel="Build your first outfit"
          actionHref="/outfits/new"
        />
      ) : (
        <OutfitsList outfits={outfits} />
      )}
    </PageShell>
  );
}
