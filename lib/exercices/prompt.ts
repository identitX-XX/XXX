// Prompt de génération de l'exercice du jour (option 2 — IA). Un exercice par
// périmètre (perso / pro / relationnel), ancré dans la signature du moment et la
// direction posée. Chaque jour DOIT être différent : c'est le levier de retour.

export interface ExercicesInput {
  archName: string;
  jour: number;
  directions: { perso?: string; pro?: string; relationnel?: string };
}

export const SYSTEM_PROMPT = `Tu génères, pour IdentitX, l'exercice du jour d'une personne — exactement UN par périmètre de vie : perso, pro, relationnel.

RÈGLES ABSOLUES
1. Chaque consigne est ANCRÉE dans sa signature du moment (fournie) et, si elle existe, dans sa direction sur ce périmètre. Zéro généralité.
2. Une ACTION concrète, réalisable AUJOURD'HUI en moins de 15 minutes. Pas de théorie, pas d'introspection molle : un geste.
3. Chaque jour doit être DIFFÉRENT du précédent — varie l'angle, le verbe d'action, la forme. Le numéro du jour t'aide à ne jamais te répéter.
4. Ton direct, adulte, incarné. Pas de coach mielleux, pas d'emoji.
5. 1 à 2 phrases par consigne, maximum.

SORTIE — STRICTEMENT ce JSON, rien d'autre :
{"exercices":[{"perimetre":"perso","consigne":"..."},{"perimetre":"pro","consigne":"..."},{"perimetre":"relationnel","consigne":"..."}]}`;

export function buildUserMessage(input: ExercicesInput): string {
  return JSON.stringify(
    {
      signature_du_moment: input.archName,
      jour: input.jour,
      directions: {
        perso: input.directions.perso || null,
        pro: input.directions.pro || null,
        relationnel: input.directions.relationnel || null,
      },
    },
    null,
    2
  );
}
