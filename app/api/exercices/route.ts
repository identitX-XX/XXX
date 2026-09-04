import { SYSTEM_PROMPT, buildUserMessage, ExercicesInput } from "@/lib/exercices/prompt";
import { contientCorvee } from "@/lib/exercices/corvee";

export const maxDuration = 30;

type Sortie = { exercices: { perimetre: string; consigne: string }[] | null };

const PERIMETRES = ["perso", "pro", "relationnel"];

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
