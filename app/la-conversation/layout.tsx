import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

// Titres : Instrument Serif, weight 400 uniquement. Corps : Inter, 400 et 500.
// Chargées ici (et non au layout racine) pour rester locales à la landing.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter-body",
});

const H1_PHRASE =
  "Il arrive un moment où on exécute très bien une vie qu'on ne signe plus.";

export const metadata: Metadata = {
  title: { absolute: "La Conversation — 3 heures, une fois" },
  description: H1_PHRASE,
};

export default function LaConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${instrumentSerif.variable} ${inter.variable} min-h-[100svh] bg-[var(--ivoire)] text-[color:var(--encre)] font-[family-name:var(--font-inter-body)] antialiased`}
    >
      {children}
    </div>
  );
}
