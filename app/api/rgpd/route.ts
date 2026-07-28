// Backend A — droit à l'effacement (RGPD). Supprime, côté serveur, toutes les
// lignes rattachées à l'identité anonyme : événements, feedback, consentements,
// profil. Sans backend provisionné : no-op gracieux (rien à effacer côté serveur,
// l'effacement local reste géré par l'app).

const TABLES = ["events", "feedback", "consents", "profiles"];

export async function POST(req: Request) {
  let body: { anon_id?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!body.anon_id || body.action !== "delete") {
    return Response.json({ ok: false }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return Response.json({ ok: true, deleted: false });
  }

  const headers = {
    apikey: key,
    authorization: `Bearer ${key}`,
    prefer: "return=minimal",
  };
  const anon = encodeURIComponent(body.anon_id);

  try {
    await Promise.all(
      TABLES.map((t) =>
        fetch(`${url}/rest/v1/${t}?anon_id=eq.${anon}`, { method: "DELETE", headers })
      )
    );
    return Response.json({ ok: true, deleted: true });
  } catch {
    return Response.json({ ok: false, deleted: false }, { status: 502 });
  }
}
