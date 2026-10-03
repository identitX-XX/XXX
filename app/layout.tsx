import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";
import { StateSync } from "@/components/StateSync";
import { EtatSync } from "@/components/EtatSync";
import { VersionGuard } from "@/components/VersionGuard";

// Typographie MODERNE & éditoriale : un serif moderne élégant pour les titres
// (Instrument Serif — haute lisibilité en grand, « magazine », féminin), un
// MONOSPACE pour les petits libellés/surtitres (touche graphique), et une sans
// neutre pour le corps (Inter). La variable garde son nom historique --font-fraunces.
const fraunces = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
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
  themeColor: "#efece5",
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
      className={inter.className + " pal-lin light"}
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
