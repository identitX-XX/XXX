import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";
import { StateSync } from "@/components/StateSync";
import { EtatSync } from "@/components/EtatSync";
import { VersionGuard } from "@/components/VersionGuard";

// Typographie ÉDITORIALE & SINGULIÈRE : DEUX voix seulement — Fraunces, un serif
// à caractère (chaleureux, légèrement « wonky », magazine) pour les titres ET les
// accroches (normal + italique), et une sans neutre pour le corps et les
// micro-libellés (Inter). Plus de monospace : la 3ᵉ police faisait « technique ».
// --font-fraunces porte donc bien Fraunces ; --font-mono pointe désormais la sans.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
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
          "--font-mono": inter.style.fontFamily,
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
