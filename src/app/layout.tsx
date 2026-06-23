import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppNav } from "@/components/layout/AppNav";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { MainContent } from "@/components/layout/MainContent";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
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
  appleWebApp: {
    capable: true,
    title: "Garde-robe",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      <body className="flex min-h-full min-w-0 flex-col bg-[var(--background)] text-[var(--foreground)]">
        <AppNav />
        <MainContent>{children}</MainContent>
        <LegalFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
