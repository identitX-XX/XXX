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

  // Pas de backend → accès accordé (bêta), rien de stocké.
  if (!url || !service) {
    return Response.json({ ok: true, stored: false });
  }

  // On relie l'email à l'identité anonyme (upsert idempotent sur anon_id).
  // L'envoi du lien magique se fait désormais côté navigateur (PKCE), pour que
  // le retour /auth/callback puisse ouvrir une vraie session — pas ici.
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

  return Response.json({ ok: true, stored: true });
}
