import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdmin();

  return (
    <div className="mx-auto min-w-0 w-full max-w-5xl px-[var(--space-page-x)] py-[var(--space-page-y)]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-6">
        <div>
          <p className="text-overline text-[var(--muted)]">Administration</p>
          <h1 className="text-display mt-1">Panneau admin</h1>
        </div>
        <Link href="/wardrobe" className="btn-ghost text-sm">
          Retour à l&apos;app
        </Link>
      </div>
      {children}
    </div>
  );
}
