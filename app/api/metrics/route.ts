// Backend A — lecture des métriques (réservé à l'éditrice). Agrège côté serveur
// depuis Supabase : inscriptions, activation, usage, rétention par cohorte.
// Protégé par ADMIN_KEY. No-op gracieux sans backend ni clé.

async function count(
  url: string,
  key: string,
  table: string,
  query = ""
): Promise<number> {
  try {
    const r = await fetch(`${url}/rest/v1/${table}?select=id${query ? "&" + query : ""}`, {
      method: "GET",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: "count=exact",
        range: "0-0",
      },
    });
    const cr = r.headers.get("content-range") || "";
    const total = cr.split("/")[1];
    return total && total !== "*" ? Number(total) : 0;
  } catch {
    return 0;
  }
}

export async function GET(req: Request) {
  const admin = process.env.ADMIN_KEY;
  const given = new URL(req.url).searchParams.get("key") || "";
  if (!admin || given !== admin) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return Response.json({ ok: true, configured: false });
  }

  const headers = { apikey: key, authorization: `Bearer ${key}` };

  const [users, opens, scenarios, feedback, consentsOui] = await Promise.all([
    count(url, key, "profiles"),
    count(url, key, "events", "name=eq.app_open"),
    count(url, key, "events", "name=eq.scenario_generated"),
    count(url, key, "feedback"),
    count(url, key, "consents", "granted=eq.true"),
  ]);

  let retention: unknown[] = [];
  try {
    const r = await fetch(`${url}/rest/v1/retention_days?select=*&order=cohorte.desc&limit=14`, { headers });
    if (r.ok) retention = await r.json();
  } catch {
    /* vue absente → tableau vide */
  }

  return Response.json({
    ok: true,
    configured: true,
    kpis: { users, opens, scenarios, feedback, consentsOui },
    retention,
  });
}
