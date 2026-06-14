import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { StatsCards } from "@/components/dashboard/StatsCards";
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
    <PageShell title="Your collection">
      {stats.itemCount === 0 ? (
        <EmptyState
          message="Add pieces to your wardrobe to see your collection summary."
          actionLabel="Add your first piece"
          actionHref="/wardrobe/new"
        />
      ) : (
        <>
          <StatsCards stats={stats} />
          <CategoryBreakdown
            breakdown={stats.categoryBreakdown}
            className="mt-[var(--space-section)]"
          />
          <div className="mt-[var(--space-section)] flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <p className="text-meta">
              Signed in as{" "}
              <span className="text-[var(--foreground)]">{user.email}</span>
            </p>
            <SignOutButton />
          </div>
        </>
      )}
    </PageShell>
  );
}
