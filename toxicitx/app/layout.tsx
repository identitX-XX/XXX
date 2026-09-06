import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToxicitX — Votre organisation est-elle toxique ?",
  description:
    "En 5–7 minutes, sachez si votre organisation est juste stressée ou carrément toxique, et repartez avec un plan d'action concret (et drôle).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans min-h-screen antialiased">{children}</body>
    </html>
  );
}
