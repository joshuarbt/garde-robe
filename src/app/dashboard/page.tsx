import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { PageShell } from "@/components/layout/PageShell";
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

  return (
    <PageShell
      title="Dashboard"
      description="Your wardrobe overview will appear here — item counts, recent additions, and quick links."
    >
      <div className="space-y-4 rounded-lg border border-stone-200 bg-white p-4">
        <p className="text-sm text-stone-600">
          Signed in as{" "}
          <span className="font-medium text-stone-900">{user.email}</span>
        </p>
        <SignOutButton />
      </div>
    </PageShell>
  );
}
