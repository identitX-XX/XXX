// Sauvegarde serveur du parcours, clée sur l'E-MAIL collecté à l'entrée (pas sur
// une session auth). C'est le mécanisme de durabilité : une testeuse qui vide son
// cache ou change d'appareil récupère sa progression en re-saisissant son e-mail.
//
// Écrit via la clé service (contourne la RLS) — la table `etats` a la RLS activée
// sans policy, donc la clé publique ne peut rien lire. Sans backend configuré :
// no-op gracieux (l'app reste 100 % locale).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function env() {
  return { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
}

// GET /api/etat?email=... → { ok, stores }
export async function GET(req: Request) {
  const email = (new URL(req.url).searchParams.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return Response.json({ ok: false, stores: null }, { status: 400 });

  const { url, key } = env();
  if (!url || !key) return Response.json({ ok: true, stores: null });

  try {
    const r = await fetch(
      `${url}/rest/v1/etats?email=eq.${encodeURIComponent(email)}&select=stores`,
      { headers: { apikey: key, authorization: `Bearer ${key}` }, cache: "no-store" }
    );
    const rows = (await r.json().catch(() => [])) as { stores?: unknown }[];
    const stores = Array.isArray(rows) && rows[0] ? rows[0].stores ?? null : null;
    return Response.json({ ok: true, stores });
  } catch {
    return Response.json({ ok: true, stores: null });
  }
}

// POST /api/etat  { email, anon_id, stores } → { ok, stored }
export async function POST(req: Request) {
  let body: { email?: string; anon_id?: string; stores?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || typeof body.stores !== "object" || body.stores === null) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { url, key } = env();
  if (!url || !key) return Response.json({ ok: true, stored: false });

  try {
    const r = await fetch(`${url}/rest/v1/etats?on_conflict=email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        email,
        anon_id: body.anon_id ?? null,
        stores: body.stores,
        updated_at: new Date().toISOString(),
      }),
    });
    return Response.json({ ok: r.ok, stored: r.ok });
  } catch {
    return Response.json({ ok: false, stored: false }, { status: 502 });
  }
}
