import type { Metadata, Viewport } from "next";
import { Cormorant, Inter } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { Gate } from "@/components/Gate";
import { StateSync } from "@/components/StateSync";
import { EtatSync } from "@/components/EtatSync";
import { VersionGuard } from "@/components/VersionGuard";

// Typographie ÉDITORIALE (premium) : un serif de caractère pour les titres
// (Fraunces — chaleureux, un peu « haute couture ») + une sans nette et neutre
// pour le corps (Inter). Le contraste serif/sans donne l'assise « haut de
// gamme ». --font-fraunces = titres · --font-inter = corps.
const cormorant = Cormorant({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
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
    description: "IdentitX",
    type: "website",
    locale: "fr_FR",
    siteName: "IdentitX",
    // L'image est fournie par app/opengraph-image.tsx (génération dynamique).
  },
  twitter: {
    card: "summary_large_image",
    title: "IdentitX",
    description: "IdentitX",
    // L'image est fournie par app/twitter-image.tsx (génération dynamique).
  },
};

export const viewport: Viewport = {
  themeColor: "#eceae7",
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
          "--font-fraunces": cormorant.style.fontFamily,
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
