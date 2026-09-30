import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// L'appli installable (PWA) : ajoutée à l'écran d'accueil de l'iPhone ou
// d'Android, elle s'ouvre directement sur l'espace du Compagnon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.nom} · Le Compagnon`,
    short_name: "Compagnon",
    description: site.description,
    id: "/espace",
    start_url: "/espace",
    scope: "/",
    display: "standalone",
    background_color: site.og.fond,
    theme_color: site.og.fond,
    lang: "fr",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
