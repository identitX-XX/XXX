// A-05 — Repli analytics : écrit un événement dans la table Supabase `events`
// via la clé service (côté serveur). Sans backend configuré : no-op gracieux.
// Ne stocke que { anon_id (anonyme), name, props (dimensions non personnelles) }.

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
  if (!url || !key) return Response.json({ ok: true, stored: false });

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
