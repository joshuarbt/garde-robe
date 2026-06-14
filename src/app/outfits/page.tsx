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
      title="Outfits"
      wide
      actionsAlign="baseline"
      actions={
        <>
          <Link
            href="/outfits/new"
            className="btn-ghost hidden min-h-[var(--touch-min)] sm:inline-flex"
          >
            New look
          </Link>
          <IconLink
            href="/outfits/new"
            icon={actionIcons.add}
            label="Build outfit"
            className="sm:hidden"
          />
        </>
      }
    >
      {outfits.length === 0 ? (
        <EmptyState
          message="No saved looks yet."
          description="Compose on the canvas, name it, and save it here."
        />
      ) : (
        <OutfitsList outfits={outfits} />
      )}
    </PageShell>
  );
}
