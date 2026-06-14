import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/wardrobe");
  }

  return (
    <PageShell
      compact={false}
      title="Your personal wardrobe"
      description="Catalog what you own and build outfits visually — clothing, accessories, and jewelry in one place."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/login" className="btn-primary">
          Sign in
        </Link>
        <Link href="/signup" className="btn-secondary">
          Create account
        </Link>
      </div>
    </PageShell>
  );
}
