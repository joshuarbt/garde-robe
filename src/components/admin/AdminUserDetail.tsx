import type { AdminUserDetail as AdminUserDetailType } from "@/lib/admin/types";
import type { ItemWithRelations } from "@/lib/types/item";
import type { OutfitSummary } from "@/lib/types/outfit";
import { AdminDeleteUserForm } from "@/components/admin/AdminDeleteUserForm";
import { AdminEmailForm } from "@/components/admin/AdminEmailForm";
import { AdminPasswordForm } from "@/components/admin/AdminPasswordForm";
import { AdminWardrobePreview } from "@/components/admin/AdminWardrobePreview";

type AdminUserDetailProps = {
  user: AdminUserDetailType;
  items: ItemWithRelations[];
  outfits: OutfitSummary[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Jamais";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminUserDetail({ user, items, outfits }: AdminUserDetailProps) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="text-title">{user.email}</h2>
          <p className="text-caption mt-1 break-all text-[var(--muted)]">{user.id}</p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-panel p-4">
            <dt className="text-overline">Articles</dt>
            <dd className="text-title mt-1">{user.itemCount}</dd>
          </div>
          <div className="surface-panel p-4">
            <dt className="text-overline">Tenues</dt>
            <dd className="text-title mt-1">{user.outfitCount}</dd>
          </div>
          <div className="surface-panel p-4">
            <dt className="text-overline">Voyages</dt>
            <dd className="text-title mt-1">{user.tripCount}</dd>
          </div>
          <div className="surface-panel p-4">
            <dt className="text-overline">Dernière connexion</dt>
            <dd className="text-caption mt-1">{formatDate(user.lastSignInAt)}</dd>
          </div>
        </dl>
      </section>

      <AdminWardrobePreview items={items} outfits={outfits} />

      <section className="grid gap-8 lg:grid-cols-2">
        <AdminEmailForm userId={user.id} currentEmail={user.email} />
        <AdminPasswordForm userId={user.id} />
      </section>

      <AdminDeleteUserForm userId={user.id} email={user.email} />
    </div>
  );
}
