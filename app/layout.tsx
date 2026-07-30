import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";

// Typographie premium : Fraunces (titres — serif à contraste DOUX, chaleureux,
// distinctif ; tient sur fond sombre sans vibrer, contrairement à une Didone) +
// Hanken Grotesk (corps, lisible). Noms de variables historiques conservés
// (--font-fraunces / --font-inter) pour ne rien casser ailleurs.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const inter = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
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
    <html lang="fr" className={fraunces.variable + " " + inter.variable + " pal-nuit"}>
      <body>
        <Gate>
          <ClientShell>{children}</ClientShell>
        </Gate>
      </body>
    </html>
  );
}
