import Link from "next/link";
import { redirect } from "next/navigation";
import { ItemForm } from "@/components/wardrobe/ItemForm";
import { PageShell } from "@/components/layout/PageShell";
import { getWardrobeLookups } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";

export default async function NewWardrobeItemPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const lookups = await getWardrobeLookups();

  return (
    <PageShell
      title="Add item"
      description="Add a new piece to your wardrobe."
    >
      <div className="mb-6">
        <Link href="/wardrobe" className="text-sm text-stone-600 hover:text-stone-900">
          Back to wardrobe
        </Link>
      </div>
      <ItemForm lookups={lookups} userId={user.id} submitLabel="Create item" />
    </PageShell>
  );
}
