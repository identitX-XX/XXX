// X-sens — génère le bilan de transition (boussole + scénarios + plan à son rythme) à
// partir des réponses. Intégration Mistral avec repli maquette (sans clé) dérivé
// des vraies réponses. Le prompt suit la méthode X-sens : plusieurs options,
// jamais une seule vérité, ton bienveillant, aucun conseil médical/juridique.

import { mockBilan, resumeMarkdown, Reponses, Bilan } from "@/lib/xsens/xsens";

export const maxDuration = 60;

const SYSTEM_PROMPT = `Tu es X-sens, un agent spécialisé dans les transitions de vie et d'identité, pour une personne francophone adulte en réflexion (reconversion, changement de vie, projet, déménagement…).
Ton : clair, bienveillant, concret, non-jugeant. Tu proposes TOUJOURS plusieurs options, jamais une seule vérité. Tu NE donnes PAS de conseils médicaux, juridiques ou financiers précis ; reste sur des pistes générales.
On te donne l'état des lieux et la boussole intérieure de la personne. Tu produis : une courte synthèse de sa boussole, 3 scénarios de transition réalistes (horizons différents : ~6 mois, ~2 ans, ~5 ans), et un plan d'action SANS AUCUNE unité de temps imposée (jamais « 7 jours », « 30 jours », ni dates) — la personne avance À SON RYTHME, quand elle s'y met.
Le plan se décline en deux temps : "premiers" (les tout premiers pas, quand elle s'y met) et "ensuite" (la suite, une fois les premiers faits). Formule les actions sans calendrier.
Chaque scénario : titre court, horizon, description (2–4 phrases), avantages, points de vigilance (inconvénients/risques + comment les réduire), ressources nécessaires (temps, argent, compétences, réseau).
Tu t'appuies UNIQUEMENT sur ce qui est rempli, sans rien inventer sur la personne.
Réponds STRICTEMENT en JSON : { "boussole": string, "scenarios": [{ "titre": string, "horizon": string, "description": string, "avantages": string[], "vigilance": string[], "ressources": string[] }], "plan": { "premiers": string[], "ensuite": string[], "indicateurs": string[] } }.`;

function buildUserMessage(r: Reponses): string {
  const ligne = (label: string, val?: string) =>
    val && val.trim() ? `- ${label} : ${val.trim()}` : null;
  const blocs = [
    "# État des lieux",
    ligne("Pro", r.pro),
    ligne("Perso & relations", r.perso),
    ligne("Lieu de vie / mobilité", r.lieu),
    ligne("Contrainte majeure", r.contrainte),
    ligne("Ce qui pèse / ce qui recharge", r.energie),
    "",
    "# Boussole intérieure",
    ligne("Valeurs clés", r.valeurs),
    ligne("Envie profonde", r.envie),
    ligne("Peur / blocage", r.peur),
    ligne("Critère de réussite", r.reussite),
    ligne("Aujourd'hui → dans 3 ans", r.horizon),
  ].filter(Boolean);
  return blocs.join("\n");
}

function estBilan(x: unknown): x is Bilan {
  const b = x as Bilan;
  return Boolean(
    b && typeof b.boussole === "string" && Array.isArray(b.scenarios) && b.plan && Array.isArray(b.plan.premiers)
  );
}

export async function POST(req: Request) {
  let reponses: Reponses;
  try {
    reponses = ((await req.json()) as { reponses?: Reponses }).reponses ?? {};
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    const bilan = mockBilan(reponses);
    return Response.json({ bilan, resume: resumeMarkdown(reponses, bilan), _mock: true });
  }

  try {
    const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "mistral-large-latest",
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(reponses) },
        ],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      const bilan = mockBilan(reponses);
      return Response.json({ bilan, resume: resumeMarkdown(reponses, bilan), _mock: true });
    }
    const content: string = data?.choices?.[0]?.message?.content ?? "{}";
    let bilan: Bilan;
    try {
      const parsed = JSON.parse(content);
      bilan = estBilan(parsed) ? parsed : mockBilan(reponses);
    } catch {
      bilan = mockBilan(reponses);
    }
    return Response.json({ bilan, resume: resumeMarkdown(reponses, bilan) });
  } catch {
    const bilan = mockBilan(reponses);
    return Response.json({ bilan, resume: resumeMarkdown(reponses, bilan), _mock: true });
  }
}

export function GET() {
  return Response.json({ ok: true, hasKey: Boolean(process.env.MISTRAL_API_KEY) });
}
