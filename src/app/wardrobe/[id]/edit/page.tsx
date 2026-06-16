import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteItemButton } from "@/components/wardrobe/DeleteItemButton";
import { ItemForm } from "@/components/wardrobe/ItemForm";
import { ItemImage } from "@/components/wardrobe/ItemImage";
import { PageShell } from "@/components/layout/PageShell";
import { getItemById, getWardrobeLookups, getProfileCurrency } from "@/lib/wardrobe/queries";
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
  const [lookups, item, defaultCurrency] = await Promise.all([
    getWardrobeLookups(),
    getItemById(id),
    getProfileCurrency(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <PageShell title={item.name}>
      <Link href="/wardrobe" className="btn-ghost mb-6 inline-flex items-center">
        Retour
      </Link>

      <div className="mb-8 max-w-sm">
        <ItemImage
          src={item.image_url}
          alt={item.name}
          className="aspect-[3/4] w-full border border-[var(--border-subtle)]"
          sizes="512px"
          priority
        />
      </div>

      <div>
        <ItemForm
          lookups={lookups}
          userId={user.id}
          itemId={item.id}
          currentImageUrl={item.image_url}
          defaultCurrency={defaultCurrency}
          submitLabel="Enregistrer les modifications"
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
            price: item.price !== null ? String(item.price) : "",
            currency_code: item.currency_code ?? defaultCurrency,
          }}
        />
      </div>

      <div className="divider-hairline mt-10 pt-8">
        <DeleteItemButton itemId={item.id} />
      </div>
    </PageShell>
  );
}
