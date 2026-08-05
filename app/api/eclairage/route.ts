// Éclairage quotidien : analyse l'écart CROIS / PENSE / FAIS rempli par la
// personne, le relie à sa signature du moment, et projette la suite de la quête.
// Même intégration Mistral que les scénarios, avec repli maquette (sans clé) —
// dérivé des vraies réponses, jamais un texte codé en dur.

export const maxDuration = 60;

type Perimetre = "perso" | "pro" | "relationnel";
interface Triplet {
  crois: string;
  pense: string;
  fais: string;
}
interface EclairageInput {
  jour: number;
  signature: string;
  directions: Record<Perimetre, string>;
  gaps: Record<Perimetre, Triplet>;
}

const LABEL: Record<Perimetre, string> = {
  perso: "Perso",
  pro: "Pro",
  relationnel: "Relationnel",
};

const SYSTEM_PROMPT = `Tu es un analyste identitaire chaleureux et précis, qui accompagne des femmes multipotentielles en transition. On te donne, pour trois périmètres de vie (perso, pro, relationnel), l'écart entre ce que la personne CROIT, ce qu'elle PENSE et ce qu'elle FAIT, ainsi que sa "signature du moment" (une dynamique identitaire active) et ses directions.
Ton travail : repérer l'écart le plus parlant (croyance ↔ pensée ↔ action), l'éclairer avec justesse, le relier à la signature du moment, puis projeter la suite de la quête.
Règles : tutoiement, ton bienveillant, JAMAIS de jugement ni d'injonction. Concret, incarné. Pas de jargon. Tu ne fabriques rien : tu t'appuies uniquement sur ce qui est rempli.
Réponds STRICTEMENT en JSON : { "eclairage": string (2 à 3 phrases), "tensions": [{ "perimetre": "perso"|"pro"|"relationnel", "note": string (1 phrase, l'écart repéré) }], "projection": string (1 à 2 phrases, une piste concrète pour la suite de la quête) }.`;

function buildUserMessage(input: EclairageInput): string {
  const blocs = (["perso", "pro", "relationnel"] as Perimetre[])
    .map((p) => {
      const g = input.gaps[p] ?? { crois: "", pense: "", fais: "" };
      const dir = input.directions?.[p]?.trim();
      return `# ${LABEL[p]}${dir ? ` (direction : ${dir})` : ""}
- Ce que je crois : ${g.crois?.trim() || "—"}
- Ce que je pense : ${g.pense?.trim() || "—"}
- Ce que je fais : ${g.fais?.trim() || "—"}`;
    })
    .join("\n\n");
  return `Signature du moment : ${input.signature}\nJour de quête : ${input.jour}\n\n${blocs}`;
}

// Repli maquette : un éclairage dérivé des réponses réelles (le périmètre le
// plus renseigné, l'écart pense↔fais), sans clé API.
function mockEclairage(input: EclairageInput) {
  const per = (["perso", "pro", "relationnel"] as Perimetre[]).filter((p) => {
    const g = input.gaps[p];
    return g && [g.crois, g.pense, g.fais].some((v) => (v ?? "").trim());
  });
  const focus = per[0] ?? "perso";
  const g = input.gaps[focus] ?? { crois: "", pense: "", fais: "" };
  const ecart =
    g.pense?.trim() && g.fais?.trim()
      ? `tu penses « ${g.pense.trim()} », mais dans les faits « ${g.fais.trim()} »`
      : g.crois?.trim()
      ? `ce que tu crois — « ${g.crois.trim()} » — ne se traduit pas encore en actes`
      : "l'écart entre ton intention et ton geste reste à explorer";
  return {
    eclairage: `Sur ton ${LABEL[focus].toLowerCase()}, ${ecart}. Vu depuis « ${input.signature} », ta signature du moment, cet écart n'est pas une faute : c'est le lieu exact où ton identité cherche à se réaligner.`,
    tensions: per.map((p) => ({
      perimetre: p,
      note: `${LABEL[p]} : un écart entre ce que tu penses et ce que tu fais.`,
    })),
    projection: `Pour la suite de ta quête : choisis un tout petit acte, sur ton ${LABEL[focus].toLowerCase()}, qui rapproche ce que tu FAIS de ce que tu CROIS. La signature « ${input.signature} » te donne l'élan.`,
    _mock: true,
  };
}

export async function POST(req: Request) {
  let input: EclairageInput;
  try {
    input = (await req.json()) as EclairageInput;
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return Response.json(mockEclairage(input));
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
          { role: "user", content: buildUserMessage(input) },
        ],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return Response.json(
        { error: data?.error?.message ?? "Erreur du service IA." },
        { status: 502 }
      );
    }
    const content: string = data?.choices?.[0]?.message?.content ?? "{}";
    try {
      return Response.json(JSON.parse(content));
    } catch {
      return Response.json({ error: "Réponse du modèle illisible." }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "Service d'éclairage momentanément injoignable." }, { status: 502 });
  }
}

export function GET() {
  return Response.json({ ok: true, hasKey: Boolean(process.env.MISTRAL_API_KEY) });
}
