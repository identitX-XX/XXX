// Endpoint de contact pour « Marina#constellations ». Reçoit {nom, email,
// message} et l'enregistre dans Supabase (table `contact`, REST, clé service,
// côté serveur). Sans backend provisionné : succès neutre (no-op gracieux) —
// l'UI remercie, la page fonctionne à l'identique. Un repli `mailto:` reste
// proposé côté client, donc aucun message n'est jamais perdu.

export async function POST(req: Request) {
  let body: { nom?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const nom = (body.nom ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 320);
  const message = (body.message ?? "").trim();

  // Validations minimales : un message, et un email plausible.
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!message || !emailOk) {
    return Response.json({ ok: false }, { status: 400 });
  }
  const clean = message.slice(0, 4000);

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Pas encore provisionné → succès neutre (rien à stocker, l'UI remercie).
  if (!url || !key) {
    return Response.json({ ok: true, stored: false });
  }

  try {
    const r = await fetch(`${url}/rest/v1/contact`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: "return=minimal",
      },
      body: JSON.stringify({ nom: nom || null, email, message: clean }),
    });
    return Response.json({ ok: r.ok, stored: r.ok });
  } catch {
    return Response.json({ ok: false, stored: false }, { status: 502 });
  }
}
