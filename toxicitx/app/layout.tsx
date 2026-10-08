import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "ToxicitX — Quel climat règne dans votre organisation ?",
  description:
    "Diagnostic anonyme de la toxicité organisationnelle en 5 à 7 minutes : trois axes, un niveau de 1 à 6, un profil dominant et des pistes d'action concrètes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap"
        />
      </head>
      <body>
        <div className="wrap">
          <div className="topbar">
            <Link href="/" className="brand">
              Toxicit<b>X</b>
            </Link>
            <ThemeToggle />
          </div>
          <main aria-live="polite">{children}</main>
          <footer>Diagnostic anonyme · aucune donnée identifiante</footer>
        </div>
      </body>
    </html>
  );
}
