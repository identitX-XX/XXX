import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/turbine/prompt";
import { mockOutput } from "@/lib/turbine/mock";
import { TurbineInput, TurbineOutput } from "@/lib/turbine/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  let input: TurbineInput;
  try {
    input = (await req.json()) as TurbineInput;
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const apiKey = process.env.MISTRAL_API_KEY;

  // Mode maquette : sans clé, l'écran vit avec des scénarios dérivés des
  // directions réelles envoyées (jamais un profil codé en dur).
  if (!apiKey) {
    return Response.json({ ...mockOutput(input), _mock: true });
  }

  try {
    const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserMessage(input) },
        ],
      }),
    });

    const data = await r.json();

    // Résilience : si Mistral échoue (crédit, quota, saturation…), on ne laisse
    // JAMAIS l'écran vide. On dégrade vers des scénarios « maquette » dérivés des
    // vraies directions, pour que l'utilisatrice ait toujours de la matière.
    if (!r.ok) {
      console.error("[turbine] Mistral non-ok", r.status, data?.error?.message ?? data?.message);
      return Response.json({ ...mockOutput(input), _mock: true });
    }

    const content: string = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: TurbineOutput;
    try {
      parsed = JSON.parse(content) as TurbineOutput;
    } catch {
      console.error("[turbine] JSON illisible");
      return Response.json({ ...mockOutput(input), _mock: true });
    }

    // Le modèle a renvoyé un vide alors qu'il y a des directions → on complète
    // avec la maquette plutôt que d'afficher « rien à proposer ».
    if (!parsed.scenarios?.length && input.directions?.length) {
      return Response.json({ ...mockOutput(input), _mock: true });
    }

    return Response.json(parsed);
  } catch {
    console.error("[turbine] injoignable");
    return Response.json({ ...mockOutput(input), _mock: true });
  }
}

export function GET() {
  return Response.json({ ok: true, hasKey: Boolean(process.env.MISTRAL_API_KEY) });
}
