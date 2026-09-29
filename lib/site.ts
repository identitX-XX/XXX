export const site = {
  nom: "CéliBOSS",
  signature: "par Maï Diaw",
  devise: "Choisir sa vie. Choisir ses relations. Choisir son cercle.",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://celiboss.fr",
  description:
    "CéliBOSS™, par Maï Diaw, matchmakeuse d'exception : faire converger votre mindset, vos relations et votre style de vie vers leur meilleure version.",
  locale: "fr_FR",
  og: {
    fond: "#F3EDE3",
    encre: "#291D1B",
    bordeaux: "#5A1726",
    champagne: "#B7A27A",
  },
} as const;
