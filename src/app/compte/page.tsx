import Link from "next/link";
import { redirect } from "next/navigation";
import { CookiePreferencesSection } from "@/components/cookies/CookiePreferencesSection";
import { DeleteAccountSection } from "@/components/privacy/DeleteAccountSection";
import { ExportDataSection } from "@/components/privacy/ExportDataSection";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { PageShell } from "@/components/layout/PageShell";
import { legalConfig } from "@/lib/legal/config";
import { getDeleteAccountAvailability } from "@/lib/privacy/actions";
import { hasPublicEnv } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export default async function ComptePage() {
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

  const { available: deletionAvailable } = await getDeleteAccountAvailability();

  return (
    <PageShell
      title="Compte et confidentialité"
      subtitle="Gérez vos données personnelles et vos droits en matière de confidentialité."
      wide
    >
      <div className="space-y-2">
        <p className="text-overline">Compte</p>
        <p className="text-sm text-[var(--foreground)]">{user.email}</p>
        <SignOutButton />
      </div>

      <div className="space-y-2 border-t border-[var(--border-hairline)] pt-8">
        <p className="text-overline">Mentions légales</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href="/confidentialite" className="underline-offset-2 hover:underline">
            Politique de confidentialité
          </Link>
          <Link href="/cgu" className="underline-offset-2 hover:underline">
            Conditions générales d&apos;utilisation
          </Link>
          <a href={`mailto:${legalConfig.contactEmail}`} className="underline-offset-2 hover:underline">
            {legalConfig.contactEmail}
          </a>
        </nav>
      </div>

      <ExportDataSection />
      <CookiePreferencesSection />
      <DeleteAccountSection deletionAvailable={deletionAvailable} />
    </PageShell>
  );
}
