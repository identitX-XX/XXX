// Filet anti-dérive des exercices générés par l'IA. Même avec un prompt strict,
// le modèle glisse parfois vers la corvée domestique (cuisine, courses, ménage…),
// hors sujet pour une appli d'identité. Isolé ici (hors du route.ts) pour être
// importable et testable — un route.ts Next.js ne peut exporter que ses
// handlers HTTP.

// Racines interdites (recherche insensible aux accents et à la casse).
export const MOTS_INTERDITS = [
  "cuisin", "recette", "repas", "diner", "dejeuner", "petit-dejeuner", "gouter",
  "course", "supermarch", "epicerie", "frigo", "placard", "garde-manger",
  "menage", "rang", "vaisselle", "lessive", "linge", "plier", "repasser",
  "aspirateur", "balai", "poussiere", "poubelle", "nettoy", "laver", "lavage",
  "jardin", "arros", "bricol", "voiture", "garage",
];

export function contientCorvee(texte: string): boolean {
  const t = texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // retire les accents
  // Chaque racine est testee en debut de mot (\b) : "rang" attrape "ranger" et
  // "rangement", mais jamais "orange" ni "deranger".
  return MOTS_INTERDITS.some((mot) => new RegExp(`\\b${mot}`).test(t));
}
