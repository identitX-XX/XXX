// Backend A — trace du consentement (RGPD, preuve horodatée). Écrit chaque
// décision (accordé / refusé) dans Supabase (table consents, région UE) via la
// clé service. Sans backend provisionné : no-op gracieux — la décision reste
// appliquée côté client quoi qu'il arrive.

export async function POST(req: Request) {
  let body: { anon_id?: string; granted?: boolean; version?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!body.anon_id || typeof body.granted !== "boolean") {
    return Response.json({ ok: false }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return Response.json({ ok: true, stored: false });
  }

  try {
    const r = await fetch(`${url}/rest/v1/consents`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        anon_id: body.anon_id,
        granted: body.granted,
        version: body.version ?? "v1",
      }),
    });
    return Response.json({ ok: r.ok, stored: r.ok });
  } catch {
    return Response.json({ ok: false, stored: false }, { status: 502 });
  }
}
