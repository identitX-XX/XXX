import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";
import { StateSync } from "@/components/StateSync";
import { EtatSync } from "@/components/EtatSync";

// Typographie « douce ronde » — Poppins partout : une sans-serif géométrique aux
// formes rondes, chaleureuse et accueillante, pour les titres (en gras) comme
// pour le corps. Une seule famille, deux graisses de rôle. On l'expose sur les
// deux variables historiques (--font-fraunces = titres, --font-inter = corps)
// via une inline-style sur <html>, sans double téléchargement.
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xxx-pi-eight.vercel.app"),
  title: {
    default: "Constellation — La Traversée",
    template: "%s · Constellation",
  },
  description:
    "30 jours pour retirer ce qui n'est plus toi. Cinq actes, un portrait qui se précise.",
  applicationName: "Constellation",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Constellation",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Constellation — La Traversée",
    description:
      "30 jours pour retirer ce qui n'est plus toi. Cinq actes, un portrait qui se précise.",
    type: "website",
    locale: "fr_FR",
    siteName: "Constellation",
    // L'image est fournie par app/opengraph-image.tsx (génération dynamique).
  },
  twitter: {
    card: "summary_large_image",
    title: "Constellation — La Traversée",
    description:
      "30 jours pour retirer ce qui n'est plus toi. Cinq actes, un portrait qui se précise.",
    // L'image est fournie par app/twitter-image.tsx (génération dynamique).
  },
};

export const viewport: Viewport = {
  themeColor: "#0a090d",
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
      className={poppins.className + " pal-nuit"}
      style={
        {
          "--font-fraunces": poppins.style.fontFamily,
          "--font-inter": poppins.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body>
        {/* Synchro compte ↔ progression (connexion = reprise). Hors Gate/Shell
            pour agir partout, y compris au retour du lien magique. No-op sans
            backend Supabase configuré. */}
        <StateSync />
        <EtatSync />
        <Gate>
          <ClientShell>{children}</ClientShell>
        </Gate>
      </body>
    </html>
  );
}
