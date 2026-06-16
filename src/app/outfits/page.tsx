import { redirect } from "next/navigation";
import { OutfitsList } from "@/components/outfits/OutfitsList";
import { OutfitsAddAction } from "@/components/outfits/OutfitsAddAction";
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
      title="Tenues"
      wide
      actionsAlign="baseline"
      actions={<OutfitsAddAction />}
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
