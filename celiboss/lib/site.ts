export const site = {
  nom: "Celiboss",
  signature: "par Maï Diaw",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://celiboss.fr",
  description:
    "Le média des femmes qui choisissent. Journal, méthode et matchmaking sélectif par Maï Diaw.",
  locale: "fr_FR",
  og: {
    fond: "#F4EFE7",
    encre: "#1C1A17",
    bronze: "#9A6B3F",
  },
} as const;
