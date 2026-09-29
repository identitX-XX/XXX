import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isRubrique } from "@/lib/rubriques";
import type { Article } from "@/types/article";

const DOSSIER = path.join(process.cwd(), "content", "journal");

function lire(fichier: string): Article {
  const slug = fichier.replace(/\.mdx$/, "");
  const brut = fs.readFileSync(path.join(DOSSIER, fichier), "utf8");
  const { data, content } = matter(brut);

  for (const champ of ["titre", "chapo", "date", "rubrique"] as const) {
    if (!data[champ]) throw new Error(`[journal] ${fichier} : « ${champ} » manquant`);
  }
  if (!isRubrique(data.rubrique)) {
    throw new Error(`[journal] ${fichier} : rubrique inconnue « ${data.rubrique} »`);
  }

  const mots = content.trim().split(/\s+/).length;
  return {
    slug,
    titre: data.titre,
    chapo: data.chapo,
    // gray-matter convertit les dates YAML en Date : on normalise en ISO.
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
    rubrique: data.rubrique,
    couverture: data.couverture,
    brouillon: Boolean(data.brouillon),
    contenu: content,
    lecture: Math.max(1, Math.round(mots / 220)),
  };
}

/** Articles publiés, du plus récent au plus ancien. Brouillons visibles en dev. */
export function getArticles(): Article[] {
  const montrerBrouillons = process.env.NODE_ENV === "development";
  return fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".mdx"))
    .map(lire)
    .filter((a) => montrerBrouillons || !a.brouillon)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
