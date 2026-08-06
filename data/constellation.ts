// « Marina#constellations » — données de la page vitrine / portfolio.
// ────────────────────────────────────────────────────────────────────────────
// C'est ICI qu'on ajoute ses photos et réalisations, sans toucher au code de la
// page. Deux étapes :
//   1. Dépose tes images dans  public/portfolio/  (ex. public/portfolio/ma-photo.jpg)
//   2. Ajoute une entrée dans REALISATIONS ci-dessous avec `image: "/portfolio/ma-photo.jpg"`
// Une entrée sans `image` s'affiche avec une vignette « constellation » de repli,
// pour composer la grille avant même d'avoir la photo finale.

export type Realisation = {
  id: string;
  titre: string;
  /** Sert aussi de filtre (ex. « Photographie », « Direction artistique »). */
  categorie: string;
  annee?: string;
  description?: string;
  /** Chemin public, ex. "/portfolio/ma-photo.jpg". Optionnel (repli sinon). */
  image?: string;
  /** Lien externe optionnel (projet, article, boutique…). */
  lien?: string;
};

/** Le profil exposé en tête de page et dans le bloc contact. */
export const PROFIL = {
  nom: "Marina",
  /** Petite accroche sous le nom. */
  role: "Direction artistique · Photographie · Univers sensibles",
  lieu: "France",
  /** Deux ou trois phrases, à la première personne. */
  bio: "Je relie des fragments — images, matières, silences — jusqu'à ce qu'une figure apparaisse. Chaque projet est une constellation : des points isolés qui, reliés par le regard, dessinent un monde. Cette page est ma carte du ciel, et une porte pour se rencontrer.",
  /** Adresse de contact directe (à remplacer). */
  email: "marina@constellations.app",
  /** Réseaux (laisse `href: ""` pour masquer un lien). */
  reseaux: [
    { nom: "Instagram", href: "" },
    { nom: "Behance", href: "" },
    { nom: "LinkedIn", href: "" },
  ] as { nom: string; href: string }[],
};

/**
 * Le portfolio. Remplace ces entrées d'exemple par tes réalisations.
 * L'ordre d'affichage suit l'ordre du tableau.
 */
export const REALISATIONS: Realisation[] = [
  {
    id: "serie-nocturne",
    titre: "Série Nocturne",
    categorie: "Photographie",
    annee: "2025",
    description:
      "Une déambulation la nuit, à la recherche des lumières qui subsistent. Le noir comme fond, la présence comme sujet.",
    // image: "/portfolio/serie-nocturne.jpg",
  },
  {
    id: "identite-atelier",
    titre: "Identité — Atelier de céramique",
    categorie: "Direction artistique",
    annee: "2025",
    description:
      "Système visuel épuré pour un atelier : logotype, palette terreuse, mise en page respirante.",
    // image: "/portfolio/identite-atelier.jpg",
  },
  {
    id: "portraits-silence",
    titre: "Portraits du silence",
    categorie: "Photographie",
    annee: "2024",
    description:
      "Des visages saisis dans l'intervalle, entre deux mots. Ce qui reste quand on cesse de poser.",
    // image: "/portfolio/portraits-silence.jpg",
  },
  {
    id: "scenographie-vide",
    titre: "Scénographie — Le Vide habité",
    categorie: "Espace",
    annee: "2024",
    description:
      "Installation où l'absence devient matière. Peu d'objets, beaucoup d'air, une lumière qui guide.",
    // image: "/portfolio/scenographie-vide.jpg",
  },
  {
    id: "carnet-matieres",
    titre: "Carnet de matières",
    categorie: "Recherche",
    annee: "2023",
    description:
      "Collecte sensible : textures, papiers, patines. La bibliothèque tactile d'où naissent les projets.",
    // image: "/portfolio/carnet-matieres.jpg",
  },
  {
    id: "constellation-editorial",
    titre: "Éditorial — Constellations",
    categorie: "Direction artistique",
    annee: "2023",
    description:
      "Une revue-objet reliant textes et images par des lignes graphiques, comme on relie des étoiles.",
    // image: "/portfolio/constellation-editorial.jpg",
  },
];

/** Catégories déduites (pour les filtres), dédoublonnées, ordre d'apparition. */
export const CATEGORIES: string[] = Array.from(
  new Set(REALISATIONS.map((r) => r.categorie))
);
