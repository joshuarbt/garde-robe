import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteItemButton } from "@/components/wardrobe/DeleteItemButton";
import { ItemForm } from "@/components/wardrobe/ItemForm";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import { PageShell } from "@/components/layout/PageShell";
import { getItemById, getWardrobeLookups } from "@/lib/wardrobe/queries";
import { createClient } from "@/lib/supabase/server";

type EditWardrobeItemPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditWardrobeItemPage({
  params,
}: EditWardrobeItemPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const [lookups, item] = await Promise.all([
    getWardrobeLookups(),
    getItemById(id),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <PageShell title="Edit item" description="Update this wardrobe item.">
      <div className="mb-6">
        <Link href="/wardrobe" className="text-sm text-stone-600 hover:text-stone-900">
          Back to wardrobe
        </Link>
      </div>

      <div className="mb-8">
        <ItemImage
          src={item.image_url}
          alt={item.name}
          className="aspect-[4/3] w-full max-w-lg rounded-lg border border-stone-200"
          sizes="512px"
          priority
        />
      </div>

      <ItemForm
        lookups={lookups}
        userId={user.id}
        itemId={item.id}
        currentImageUrl={item.image_url}
        submitLabel="Save changes"
        initialValues={{
          name: item.name,
          item_type: item.item_type,
          category_id: item.category_id ?? "",
          new_category_name: "",
          color_id: item.color_id ?? "",
          brand_id: item.brand_id ?? "",
          new_brand_name: "",
          season_ids: item.seasons.map((season) => season.id),
          occasion_tags: item.occasion_tags.join(", "),
          notes: item.notes ?? "",
        }}
      />

      <div className="mt-8 border-t border-stone-200 pt-6">
        <DeleteItemButton itemId={item.id} />
      </div>
    </PageShell>
  );
}
