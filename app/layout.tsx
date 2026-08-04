import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";
import { StateSync } from "@/components/StateSync";

// Typographie « moderne épurée » — tout en sans-serif, contemporaine et
// ergonomique : Bricolage Grotesque pour les titres (grotesque de caractère,
// affirmé, très lisible en gros) + Plus Jakarta Sans pour le corps (rond, clair,
// confortable à lire). Les noms de variables historiques sont conservés
// (--font-fraunces = titres, --font-inter = corps) pour ne rien casser ailleurs.
const titre = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const corps = Plus_Jakarta_Sans({
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
