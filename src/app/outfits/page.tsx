import Link from "next/link";
import { redirect } from "next/navigation";
import { OutfitsList } from "@/components/outfits/OutfitsList";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconLink } from "@/components/ui/IconButton";
import { actionIcons } from "@/lib/icons";
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
      title="Tenues"
      wide
      actionsAlign="baseline"
      actions={
        <>
          <Link
            href="/outfits/new"
            className="btn-ghost hidden min-h-[var(--touch-min)] sm:inline-flex"
          >
            Nouvelle tenue
          </Link>
          <IconLink
            href="/outfits/new"
            icon={actionIcons.add}
            label="Composer une tenue"
            className="sm:hidden"
          />
        </>
      }
    >
      {outfits.length === 0 ? (
        <EmptyState
          message="Aucune tenue enregistrée."
          description="Composez sur le canevas, nommez-la et enregistrez-la ici."
        />
      ) : (
        <OutfitsList outfits={outfits} />
      )}
    </PageShell>
  );
}
