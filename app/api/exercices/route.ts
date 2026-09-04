import { SYSTEM_PROMPT, buildUserMessage, ExercicesInput } from "@/lib/exercices/prompt";

export const maxDuration = 30;

type Sortie = { exercices: { perimetre: string; consigne: string }[] | null };

const PERIMETRES = ["perso", "pro", "relationnel"];

// Filet anti-dérive : même avec un prompt strict, le modèle glisse parfois vers
// la corvée domestique (cuisine, courses, ménage…), hors sujet pour une appli
// d'identité. Si UNE seule consigne contient un de ces mots, on jette tout le
// lot → le client garde ses exercices « modèle » (déterministes, jamais hors
// sujet). Recherche insensible aux accents et à la casse.
const MOTS_INTERDITS = [
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

// Génère l'exercice du jour par l'IA. En cas d'échec (pas de clé, quota,
// lenteur, JSON illisible) → { exercices: null } : le client garde alors son
// exercice « modèle », donc jamais d'écran vide ni de spinner.
export async function POST(req: Request): Promise<Response> {
  let input: ExercicesInput;
  try {
    input = (await req.json()) as ExercicesInput;
  } catch {
    return Response.json({ exercices: null } satisfies Sortie);
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) return Response.json({ exercices: null } satisfies Sortie);

  try {
    const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "mistral-large-latest",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(input) },
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return Response.json({ exercices: null } satisfies Sortie);
    const data = await r.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as Sortie;
    const ex = Array.isArray(parsed?.exercices) ? parsed.exercices : [];
    // On ne garde que des entrées valides sur les 3 périmètres attendus.
    const propre = ex.filter(
      (e) => e && PERIMETRES.includes(e.perimetre) && typeof e.consigne === "string" && e.consigne.trim()
    );
    if (propre.length < 3) return Response.json({ exercices: null } satisfies Sortie);
    // Si le modèle a glissé vers la corvée domestique, on rejette TOUT le lot :
    // le client garde ses exercices « modèle », propres et dans le sujet.
    if (propre.some((e) => contientCorvee(e.consigne)))
      return Response.json({ exercices: null } satisfies Sortie);
    return Response.json({ exercices: propre } satisfies Sortie);
  } catch {
    return Response.json({ exercices: null } satisfies Sortie);
  }
}
