import type { Metadata, Viewport } from "next";
import { Nunito, Plus_Jakarta_Sans, Press_Start_2P, VT323 } from "next/font/google";
import Script from "next/script";
import { AppNav } from "@/components/layout/AppNav";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { MainContent } from "@/components/layout/MainContent";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { ThemeEffects } from "@/components/theme/ThemeEffects";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { THEME_STORAGE_KEY } from "@/lib/theme/constants";
import "./globals.css";
import "@/styles/theme-aero.css";
import "@/styles/theme-matrix.css";
import "@/styles/theme-gameboy.css";
import "@/styles/theme-barbie.css";
import "@/styles/theme-vaporwave.css";
import "@/styles/theme-ghibli.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
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
      className={`${plusJakarta.variable} ${pressStart2P.variable} ${nunito.variable} ${vt323.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t&&t!=="default"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`}
        </Script>
      </head>
      <body className="flex min-h-full min-w-0 flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <ThemeEffects />
          <div className="relative z-10 flex min-h-full min-w-0 flex-1 flex-col">
            <AppNav />
            <MainContent>{children}</MainContent>
            <LegalFooter />
            <MobileTabBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
