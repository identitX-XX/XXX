// Prompt de génération de l'exercice du jour (option 2 — IA). Un exercice par
// périmètre (perso / pro / relationnel), ancré dans la signature du moment et la
// direction posée. Chaque jour DOIT être différent : c'est le levier de retour.

export interface ExercicesInput {
  archName: string;
  jour: number;
  directions: { relationnel?: string; love?: string; pro?: string; perso?: string };
}

// Sens de chaque pilier — fourni au modèle pour qu'il ancre l'action dans le
// bon domaine de vie SANS inventer de scène concrète (cuisine, courses…).
const ANGLES: Record<string, string> = {
  relationnel: "tes proches, ta famille, tes amis, ta manière d'être en lien",
  love: "ton couple, l'amour, l'intimité, ta vie sentimentale",
  pro: "ton travail, tes projets, ta façon d'agir et de décider",
  perso: "ta santé, ton corps, ton énergie, ton sommeil, ton équilibre intérieur",
};

export const SYSTEM_PROMPT = `Tu génères, pour IdentitX, l'exercice du jour d'une personne — exactement UN par pilier de vie : relationnel (relationnel & famille), love (couple, amour), pro, perso (santé).

IdentitX explore l'IDENTITÉ : chaque exercice fait OBSERVER, HABITER ou EXPRIMER une facette de soi (la signature du moment) dans sa vie réelle. Ce n'est JAMAIS une tâche ménagère, logistique ou d'organisation.

RÈGLES ABSOLUES
1. Registre identitaire uniquement : posture, parole, regard, choix, attention, ressenti, limite, façon d'être. INTERDIT d'inventer une scène ou un objet concret étranger à la personne (cuisine, courses, ménage, rangement, sport précis, recette, objet…). Si tu écris « cuisine », « ranger », « liste de courses » ou équivalent, tu as échoué.
2. Ancre CHAQUE consigne dans la signature du moment (fournie) et, si elle existe, dans la direction posée sur ce périmètre. S'il n'y a pas de direction, reste sur le SENS du périmètre (fourni) — n'invente pas de contexte.
3. Une action incarnée, réalisable AUJOURD'HUI en moins de 15 minutes : oser dire, poser une limite, remarquer un automatisme, exprimer une facette, ajuster une posture. Un geste d'identité, pas une corvée.
4. Chaque jour doit être DIFFÉRENT du précédent — varie l'angle, le verbe, la forme. Le numéro du jour t'aide à ne jamais te répéter.
5. Ton direct, adulte, incarné. Pas de coach mielleux, pas d'emoji. 1 à 2 phrases par consigne, maximum.

SORTIE — STRICTEMENT ce JSON, rien d'autre (les 4 piliers, dans cet ordre) :
{"exercices":[{"perimetre":"relationnel","consigne":"..."},{"perimetre":"love","consigne":"..."},{"perimetre":"pro","consigne":"..."},{"perimetre":"perso","consigne":"..."}]}`;

export function buildUserMessage(input: ExercicesInput): string {
  return JSON.stringify(
    {
      signature_du_moment: input.archName,
      jour: input.jour,
      // piliers : le SENS (pour ancrer sans inventer) + la direction posée si elle existe.
      piliers: {
        relationnel: { sens: ANGLES.relationnel, direction: input.directions.relationnel || null },
        love: { sens: ANGLES.love, direction: input.directions.love || null },
        pro: { sens: ANGLES.pro, direction: input.directions.pro || null },
        perso: { sens: ANGLES.perso, direction: input.directions.perso || null },
      },
    },
    null,
    2
  );
}
