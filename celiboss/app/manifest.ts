import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Première déclinaison « appli » : le site s'installe sur l'écran d'accueil (PWA).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.nom} — ${site.signature}`,
    short_name: site.nom,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: site.og.fond,
    theme_color: site.og.fond,
    lang: "fr",
    // TODO: ajouter icon-192.png / icon-512.png dans /public et les déclarer ici.
  };
}
