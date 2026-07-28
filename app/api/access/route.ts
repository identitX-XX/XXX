// Backend A — accès par email (alternative au code d'invitation). Enregistre
// l'email de la testeuse (table profiles, région UE) et, si l'auth Supabase est
// configurée, lui envoie un LIEN MAGIQUE de confirmation. Sans backend
// provisionné : no-op gracieux — l'accès est accordé quand même (bêta).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { anon_id?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!body.anon_id || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "email" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.SUPABASE_ANON_KEY;

  // Pas de backend → accès accordé (bêta), rien de stocké, pas de lien magique.
  if (!url || !service) {
    return Response.json({ ok: true, stored: false, magic: false });
  }

  // 1) On relie l'email à l'identité anonyme (upsert idempotent sur anon_id).
  try {
    await fetch(`${url}/rest/v1/profiles?on_conflict=anon_id`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: service,
        authorization: `Bearer ${service}`,
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ anon_id: body.anon_id, email }),
    });
  } catch {
    /* la capture d'email ne doit jamais bloquer l'accès */
  }

  // 2) Lien magique de confirmation — seulement si l'auth Supabase est branchée.
  let magic = false;
  if (anon) {
    try {
      const r = await fetch(`${url}/auth/v1/otp`, {
        method: "POST",
        headers: { "content-type": "application/json", apikey: anon },
        body: JSON.stringify({ email, create_user: true }),
      });
      magic = r.ok;
    } catch {
      magic = false;
    }
  }

  return Response.json({ ok: true, stored: true, magic });
}
