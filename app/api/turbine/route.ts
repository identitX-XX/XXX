import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/turbine/prompt";
import { MOCK_OUTPUT } from "@/lib/turbine/mock";
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

  // Mode maquette : sans clé, l'écran vit avec des scénarios d'exemple.
  if (!apiKey) {
    return Response.json({ ...MOCK_OUTPUT, _mock: true });
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

    if (!r.ok) {
      return Response.json(
        { error: data?.error?.message ?? data?.message ?? "Erreur du service IA." },
        { status: 502 }
      );
    }

    const content: string = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: TurbineOutput;
    try {
      parsed = JSON.parse(content) as TurbineOutput;
    } catch {
      return Response.json(
        { error: "Réponse du modèle illisible (JSON invalide)." },
        { status: 502 }
      );
    }

    return Response.json(parsed);
  } catch {
    return Response.json(
      { error: "La Turbine est momentanément injoignable." },
      { status: 502 }
    );
  }
}

export function GET() {
  return Response.json({ ok: true, hasKey: Boolean(process.env.MISTRAL_API_KEY) });
}
