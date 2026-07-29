// Backend — rattache le PRÉNOM à l'identité (table profiles), en complément de
// l'email capté à l'entrée. Appelé à la fin de l'onboarding. Upsert idempotent
// sur anon_id : on met à jour le prénom sans toucher à l'email déjà enregistré.
// Sans backend provisionné : no-op gracieux (jamais bloquant).

export async function POST(req: Request) {
  let body: { anon_id?: string; prenom?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const anon_id = (body.anon_id ?? "").trim();
  const prenom = (body.prenom ?? "").trim().slice(0, 80);
  if (!anon_id || !prenom) {
    return Response.json({ ok: false, error: "champ" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    return Response.json({ ok: true, stored: false });
  }

  try {
    // merge-duplicates : ne met à jour que les colonnes envoyées (anon_id,
    // prenom) — l'email déjà présent sur la ligne est préservé.
    await fetch(`${url}/rest/v1/profiles?on_conflict=anon_id`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: service,
        authorization: `Bearer ${service}`,
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ anon_id, prenom }),
    });
  } catch {
    /* la capture du prénom ne doit jamais bloquer l'accès */
  }

  return Response.json({ ok: true, stored: true });
}
