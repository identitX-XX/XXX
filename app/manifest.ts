import type { MetadataRoute } from "next";

// Rend l'app installable (« Ajouter à l'écran d'accueil ») — cohérent avec un
// rituel quotidien local-first.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IdentitX — ta quête identitaire",
    short_name: "IdentitX",
    description:
      "Transforme tes objectifs dispersés en un scénario clair et aligné. 30 jours, 12 archétypes, en local.",
    start_url: "/aujourdhui",
    display: "standalone",
    background_color: "#0a090d",
    theme_color: "#0a090d",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
