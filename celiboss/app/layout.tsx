import type { Metadata, Viewport } from "next";
import { Cormorant, Hanken_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCTA } from "@/components/layout/StickyCTA";
import { site } from "@/lib/site";
import "./globals.css";

// next/font auto-héberge les fichiers au build : aucune requête vers Google
// côté visiteuse. Pour passer sur des fichiers maison, voir public/fonts/README.md.
const serif = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: { default: `${site.nom} — ${site.signature}`, template: `%s · ${site.nom}` },
  description: site.description,
  applicationName: site.nom,
  openGraph: { type: "website", locale: site.locale, siteName: site.nom },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: site.og.fond,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-encre focus:px-4 focus:py-2 focus:text-ivoire">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
