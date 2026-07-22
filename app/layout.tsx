import type { Metadata, Viewport } from "next";
import { Playfair_Display, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
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
    default: "IdentitX — ta quête identitaire",
    template: "%s · IdentitX",
  },
  description:
    "Transforme tes objectifs dispersés en un scénario clair et aligné. 30 jours, 12 archétypes, en local.",
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
      "Transforme tes objectifs dispersés en un scénario clair et aligné. 30 jours, 12 archétypes, en local.",
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
        <Gate>
          <ClientShell>{children}</ClientShell>
        </Gate>
      </body>
    </html>
  );
}
