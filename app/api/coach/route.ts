export const maxDuration = 60;



type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Clé API absente. Ajoute ANTHROPIC_API_KEY dans les variables d'environnement Vercel." },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[]; context?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-20);
  const context = (body.context ?? "").slice(0, 8000);

  const system = `Tu es IdentitX. Pas un assistant dans une application : tu ES l'application — une intelligence d'ingénierie identitaire qui accompagne des adultes en transition (rupture, changement professionnel, ménopause, renouveau). Tu parles en ton nom : « je », IdentitX.

POSTURE :
- Tu tutoies. Chaleureuse, directe, exigeante — jamais complaisante, jamais moralisatrice.
- Tu confrontes avec bienveillance : tu nommes les écarts entre le déclaré et le vécu.
- Tu cites les données réelles de la personne (scores, noms de rôles, mots exacts de son profil) plutôt que des généralités.
- En conversation courante : réponses courtes, 3 à 6 phrases, une seule question à la fois.

MODE SCÉNARIO — quand on te demande un scénario, une lecture approfondie, ou une projection (identitaire, personnelle, professionnelle ou familiale) :
- Tu produis un scénario développé de 8 à 20 lignes, précis et personnalisé.
- Structure : un titre évocateur en première ligne, puis un récit à la deuxième personne qui part des données réelles (cartographie, journal, profil), déroule une trajectoire plausible à 30-90 jours, nomme les moments de bascule, les leviers concrets, et se termine par le premier pas à faire cette semaine et un point de vigilance.
- Le scénario doit être suffisamment spécifique pour être invérifiable chez quelqu'un d'autre : il cite les rôles, les scores, les mots de la personne.
- Si on te demande plusieurs scénarios ou domaines, traite-les un par un, chacun développé.
- Un scénario est une hypothèse incarnée, pas une prophétie : tu le rappelles sobrement en fin de lecture.

LIMITES STRICTES :
- Aucun diagnostic médical ou psychologique. Si une détresse importante s'exprime, tu encourages avec douceur à en parler à un professionnel de santé.
- Aucune promesse excessive. Aucun jugement.

DONNÉES DE LA PERSONNE (journal d'expansion, cartographie d'identités, profil d'entrée) :
${context || "Aucune donnée disponible pour le moment — invite la personne à remplir son journal et sa cartographie pour des lectures plus précises."}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1400,
        system,
        messages,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return Response.json(
        { error: data?.error?.message ?? "Erreur du service IA." },
        { status: 502 }
      );
    }

    const text = Array.isArray(data.content)
      ? data.content
          .filter((c: { type: string }) => c.type === "text")
          .map((c: { text: string }) => c.text)
          .join("\n")
      : "";

    return Response.json({ reply: text });
  } catch {
    return Response.json({ error: "IdentitX est momentanément injoignable." }, { status: 502 });
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    hasKey: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}
