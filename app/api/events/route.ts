// Backend A — endpoint d'événements. Écrit dans Supabase (REST, région UE) via
// la clé service, côté serveur. Sans backend provisionné : no-op gracieux, pour
// que l'app fonctionne à l'identique avant même la mise en place.

export async function POST(req: Request) {
  let body: { anon_id?: string; name?: string; props?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!body.anon_id || !body.name) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Pas encore provisionné → succès neutre (rien à stocker).
  if (!url || !key) {
    return Response.json({ ok: true, stored: false });
  }

  try {
    const r = await fetch(`${url}/rest/v1/events`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        anon_id: body.anon_id,
        name: body.name,
        props: body.props ?? {},
      }),
    });
    return Response.json({ ok: r.ok, stored: r.ok });
  } catch {
    return Response.json({ ok: false, stored: false }, { status: 502 });
  }
}
