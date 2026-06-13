import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import {
  DashboardQuickLinks,
  StatsCards,
} from "@/components/dashboard/StatsCards";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDashboardStats } from "@/lib/dashboard/queries";
import { hasPublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  if (!hasPublicEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const stats = await getDashboardStats();

  return (
    <PageShell
      title="Dashboard"
      description="Your wardrobe at a glance."
      wide
    >
      {stats.itemCount === 0 ? (
        <EmptyState
          className="mb-8"
          message="Add clothing to your wardrobe to see stats here."
          actionLabel="Add your first item"
          actionHref="/wardrobe/new"
        />
      ) : (
        <StatsCards stats={stats} />
      )}

      {stats.itemCount > 0 ? (
        <CategoryBreakdown breakdown={stats.categoryBreakdown} className="mt-10" />
      ) : null}

      <DashboardQuickLinks className="mt-10 divider-hairline pt-10" />

      <div className="mt-10 divider-hairline pt-8">
        <p className="text-xs text-[var(--muted)]">
          Signed in as{" "}
          <span className="text-[var(--foreground)]">{user.email}</span>
        </p>
        <div className="mt-3">
          <SignOutButton />
        </div>
      </div>
    </PageShell>
  );
}
