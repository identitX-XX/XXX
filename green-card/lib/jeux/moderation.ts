/**
 * Filtre de premier niveau pour les textes publiés entre voisins (astuces, annonces).
 * L'agent IA de modération prendra le relais à l'étape 4.
 */

// Liste volontairement courte : un filtre de premier niveau, pas une modération complète.
const MOTS_INTERDITS = ["connard", "connasse", "salope", "encule", "pute", "nique", "batard", "pd", "fdp", "ntm"];

function normaliser(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Renvoie un message d'erreur si le texte contient des coordonnées, un lien ou une insulte. */
export function problemeContenu(texte: string): string | undefined {
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(texte) || /(\+33|\b0)[1-9](?:[ .-]?\d{2}){4}\b/.test(texte))
    return "Pour votre sécurité, ne partagez pas d'e-mail ni de numéro de téléphone.";
  if (/(https?:\/\/|www\.|\b[\w.-]+\.(com|fr|net|org|io)\b)/i.test(texte)) return "Les liens ne sont pas autorisés dans les publications.";
  const mots = normaliser(texte).split(/[^a-z0-9]+/);
  if (mots.some((m) => MOTS_INTERDITS.includes(m))) return "Merci de rester courtois avec vos voisins.";
  return undefined;
}

export function nettoyerLigne(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function nettoyerTexte(s: string) {
  return s.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
}
