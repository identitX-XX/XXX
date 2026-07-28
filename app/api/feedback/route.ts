// Backend A — endpoint de feedback libre. Recueille les mots des testeuses et
// les écrit dans Supabase (REST, région UE) via la clé service, côté serveur.
// Sans backend provisionné : no-op gracieux — l'app fonctionne à l'identique.

export async function POST(req: Request) {
  let body: { anon_id?: string; message?: string; route?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!body.anon_id || !message) {
    return Response.json({ ok: false }, { status: 400 });
  }
  // Garde-fou : on borne la taille pour rester dans un champ « quelques mots ».
  const clean = message.slice(0, 4000);

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Pas encore provisionné → succès neutre (rien à stocker, mais l'UI remercie).
  if (!url || !key) {
    return Response.json({ ok: true, stored: false });
  }

  try {
    const r = await fetch(`${url}/rest/v1/feedback`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        anon_id: body.anon_id,
        message: clean,
        route: body.route ?? null,
      }),
    });
    return Response.json({ ok: r.ok, stored: r.ok });
  } catch {
    return Response.json({ ok: false, stored: false }, { status: 502 });
  }
}
