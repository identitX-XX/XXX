import type { Metadata, Viewport } from "next";
import { Playfair_Display, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Gate } from "@/components/Gate";

// Typographie premium : Playfair Display (titres, fort contraste couture) +
// Hanken Grotesk (corps, chaleureux et lisible). On conserve les noms de
// variables historiques (--font-fraunces / --font-inter) pour ne rien changer
// dans globals.css / Tailwind / les composants à styles inline.
const fraunces = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://identitx.app"),
  title: {
    default: "IdentitX — La Traversée",
    template: "%s · IdentitX",
  },
  description:
    "Trente jours. Un seul geste par jour. On ne se recompose pas en s'ajoutant — on choisit ce qu'on emporte.",
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
    title: "IdentitX — La Traversée",
    description:
      "Trente jours. Un seul geste par jour. On choisit ce qu'on emporte.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a090d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={fraunces.variable + " " + inter.variable}>
      <body>
        <Gate>{children}</Gate>
      </body>
    </html>
  );
}
