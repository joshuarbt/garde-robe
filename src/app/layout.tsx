import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CookieConsentBanner } from "@/components/cookies/CookieConsentBanner";
import { CookieConsentPreferences } from "@/components/cookies/CookieConsentPreferences";
import { NonEssentialScripts } from "@/components/cookies/NonEssentialScripts";
import { AppNav } from "@/components/layout/AppNav";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { MainContent } from "@/components/layout/MainContent";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CookieConsentProvider } from "@/lib/cookies/context";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Garde-robe",
  description: "Gestionnaire de garde-robe personnelle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <CookieConsentProvider>
          <AppNav />
          <MainContent>{children}</MainContent>
          <LegalFooter />
          <CookieConsentBanner />
          <CookieConsentPreferences />
          <NonEssentialScripts />
          <MobileTabBar />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
