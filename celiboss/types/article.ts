import type { RubriqueId } from "@/lib/rubriques";

/** Frontmatter attendu en tête de chaque fichier content/journal/*.mdx. */
export type ArticleFrontmatter = {
  titre: string;
  chapo: string;
  date: string; // ISO — AAAA-MM-JJ
  rubrique: RubriqueId;
  couverture?: string; // chemin dans /public/images
  brouillon?: boolean;
};

export type Article = ArticleFrontmatter & {
  slug: string;
  contenu: string; // corps MDX brut, compilé à l'affichage
  lecture: number; // minutes estimées
};
