import type { MetadataRoute } from "next";

// Rend l'app installable (« Ajouter à l'écran d'accueil ») — cohérent avec un
// rituel quotidien local-first.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IdentitX — La Traversée",
    short_name: "La Traversée",
    description:
      "Trente jours. Un seul geste par jour. On choisit ce qu'on emporte.",
    start_url: "/",
    display: "standalone",
    background_color: "#08060f",
    theme_color: "#08060f",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
