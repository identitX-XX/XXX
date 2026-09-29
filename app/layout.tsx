import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";
import { StateSync } from "@/components/StateSync";
import { EtatSync } from "@/components/EtatSync";
import { VersionGuard } from "@/components/VersionGuard";

// Typographie ÉDITORIALE (premium, graphique — esprit Co-Star) : un serif de
// caractère à fort contraste pour les titres (Fraunces — « haute couture »,
// optical-sizing), un MONOSPACE pour les petits libellés/surtitres (la signature
// graphique), et une sans neutre pour le corps (Inter).
// --font-fraunces = titres · --font-mono = libellés · --font-inter = corps.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xxx-pi-eight.vercel.app"),
  title: {
    default: "IdentitX",
    template: "%s · IdentitX",
  },
  description: "IdentitX",
  applicationName: "IdentitX",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IdentitX",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "IdentitX",
    // Pas de description : aucun sous-titre sous l'aperçu du lien.
    type: "website",
    locale: "fr_FR",
    siteName: "IdentitX",
    // L'image de couverture est le fichier statique app/opengraph-image.png
    // (masque au fusain + nom en serif Cormorant, la typo de la marque).
  },
  twitter: {
    card: "summary_large_image",
    title: "IdentitX",
    // Pas de description : aucun sous-titre sous l'aperçu du lien.
    // Couverture : app/twitter-image.png (même visuel que l'OpenGraph).
  },
};

export const viewport: Viewport = {
  themeColor: "#151517",
  width: "device-width",
  initialScale: 1,
  // Permet aux retraits « safe area » (encoche, barre d'accueil iOS) d'agir.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={inter.className + " pal-lin"}
      style={
        {
          "--font-fraunces": fraunces.style.fontFamily,
          "--font-mono": plexMono.style.fontFamily,
          "--font-inter": inter.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body>
        {/* Synchro compte ↔ progression (connexion = reprise). Hors Gate/Shell
            pour agir partout, y compris au retour du lien magique. No-op sans
            backend Supabase configuré. */}
        <StateSync />
        <EtatSync />
        <VersionGuard />
        <Gate>
          <ClientShell>{children}</ClientShell>
        </Gate>
      </body>
    </html>
  );
}
