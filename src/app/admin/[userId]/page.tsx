import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminUserDetail } from "@/components/admin/AdminUserDetail";
import { getUserDetail, getUserItems, getUserOutfits } from "@/lib/admin/queries";
import { isUuid } from "@/lib/wardrobe/validation";

type AdminUserPageProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const { userId } = await params;

  if (!isUuid(userId)) {
    notFound();
  }

  const [user, items, outfits] = await Promise.all([
    getUserDetail(userId),
    getUserItems(userId),
    getUserOutfits(userId),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link href="/admin" className="btn-ghost inline-flex text-sm">
        Retour à la liste
      </Link>
      <AdminUserDetail user={user} items={items} outfits={outfits} />
    </div>
  );
}
