import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";
import { StateSync } from "@/components/StateSync";

// Typographie « éditoriale élégante » — Playfair Display pour les titres (serif
// chic, féminin, à contraste marqué, qui monte en gras pour des titres grands et
// affirmés) + Manrope pour le corps (sans-serif humaniste, très lisible et
// ergonomique). Les noms de variables historiques sont conservés
// (--font-fraunces = titres, --font-inter = corps) pour ne rien casser ailleurs.
const titre = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const corps = Manrope({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://identitx.app"),
  title: {
    default: "IdentitX — ta quête identitaire",
    template: "%s · IdentitX",
  },
  description:
    "Transforme tes objectifs dispersés en un scénario clair et aligné. 30 jours, 20 signatures, en local.",
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
    title: "IdentitX — ta quête identitaire",
    description:
      "Transforme tes objectifs dispersés en un scénario clair et aligné. 30 jours, 20 signatures, en local.",
    type: "website",
    locale: "fr_FR",
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
    <html lang="fr" className={titre.variable + " " + corps.variable + " pal-nuit"}>
      <body>
        {/* Synchro compte ↔ progression (connexion = reprise). Hors Gate/Shell
            pour agir partout, y compris au retour du lien magique. No-op sans
            backend Supabase configuré. */}
        <StateSync />
        <Gate>
          <ClientShell>{children}</ClientShell>
        </Gate>
      </body>
    </html>
  );
}
