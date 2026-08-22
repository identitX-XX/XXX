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

// Emails de l'éditrice à EXCLURE des chiffres (elle se connecte beaucoup en
// test, avec plein de variantes/typos → elle polluerait le compte et la liste).
// Exclusion par MOTIF (sous-chaîne) : tout email contenant l'un de ces motifs
// est écarté — donc toutes les variantes (gmail/gmaill/fmail/yahoo…) et les
// futures fautes de frappe. Source : Vercel ADMIN_EXCLUDE_PATTERNS et/ou ci-dessous.
const PATTERNS_EXCLUS: string[] = [
  "marinabignon", // éditrice — toutes ses variantes
];
function patternsExclus(): string[] {
  const env = (process.env.ADMIN_EXCLUDE_PATTERNS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const set = new Set([...env, ...PATTERNS_EXCLUS.map((s) => s.trim().toLowerCase())]);
  return Array.from(set).filter(Boolean);
}
// Fragment PostgREST « email ne contient aucun des motifs » (ANDés). Vide si rien.
function exclusionEmail(): string {
  const pats = patternsExclus();
  if (!pats.length) return "";
  return pats.map((p) => `email=not.ilike.${encodeURIComponent(`*${p}*`)}`).join("&");
}

export async function GET(req: Request) {
  const admin = process.env.ADMIN_KEY;
  const given = new URL(req.url).searchParams.get("key") || "";
  // Comparaison tolérante : on ignore les espaces autour et la casse, pour
  // neutraliser les pièges de saisie mobile (majuscule auto, espace collé) qui
  // font échouer une clé pourtant « bonne ». Suffisant pour un tableau de bord
  // privé de bêta.
  const norm = (s: string) => s.trim().toLowerCase();
  if (!admin || norm(given) !== norm(admin)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return Response.json({ ok: true, configured: false });
  }

  const headers = { apikey: key, authorization: `Bearer ${key}` };

  const exclEmail = exclusionEmail(); // exclut les emails de l'éditrice

  const [users, opens, scenarios, feedback, consentsOui] = await Promise.all([
    count(url, key, "profiles", exclEmail),
    count(url, key, "events", "name=eq.app_open"),
    count(url, key, "events", "name=eq.scenario_generated"),
    count(url, key, "feedback"),
    count(url, key, "consents", "granted=eq.true"),
  ]);

  const view = async (name: string, query = "") => {
    try {
      const r = await fetch(`${url}/rest/v1/${name}?select=*${query ? "&" + query : ""}`, { headers });
      return r.ok ? await r.json() : [];
    } catch {
      return [];
    }
  };

  const [retention, funnelRows, growth, engagement] = await Promise.all([
    view("retention_days", "order=cohorte.desc&limit=14"),
    view("funnel"),
    view("signups_daily", "order=jour.asc&limit=90"),
    view("page_engagement", "limit=40"),
  ]);

  // Liste nominative des inscrites (e-mail + prénom + date) — réservée à
  // l'éditrice, sous ADMIN_KEY. C'est le « qui », complément des compteurs.
  let inscriptions: unknown[] = [];
  try {
    const r = await fetch(
      `${url}/rest/v1/profiles?select=email,prenom,created_at&order=created_at.desc&limit=500${exclEmail ? "&" + exclEmail : ""}`,
      { headers }
    );
    inscriptions = r.ok ? await r.json() : [];
  } catch {
    inscriptions = [];
  }

  // Verbatims — les mots des testeuses (feedback libre), texte + page + date.
  let verbatims: unknown[] = [];
  try {
    const r = await fetch(
      `${url}/rest/v1/feedback?select=message,route,created_at&order=created_at.desc&limit=300`,
      { headers }
    );
    verbatims = r.ok ? await r.json() : [];
  } catch {
    verbatims = [];
  }

  // Testeuses ACTIVES = ont terminé au moins une journée (event « day_completed »),
  // nettes des sessions de l'éditrice. C'est LE chiffre d'engagement réel.
  let actives = 0;
  let joursTermines = 0;
  try {
    const exclAnon = new Set<string>();
    for (const p of patternsExclus()) {
      const rr = await fetch(
        `${url}/rest/v1/profiles?select=anon_id&email=ilike.${encodeURIComponent(`*${p}*`)}`,
        { headers }
      );
      const rows = rr.ok ? await rr.json() : [];
      for (const row of rows) if (row?.anon_id) exclAnon.add(row.anon_id as string);
    }
    const rc = await fetch(
      `${url}/rest/v1/events?select=anon_id&name=eq.day_completed&limit=100000`,
      { headers }
    );
    const evts = rc.ok ? await rc.json() : [];
    const set = new Set<string>();
    for (const e of evts as { anon_id?: string }[]) {
      const a = e?.anon_id;
      if (!a || exclAnon.has(a)) continue;
      set.add(a);
      joursTermines++;
    }
    actives = set.size;
  } catch {}

  return Response.json({
    ok: true,
    configured: true,
    kpis: { users, opens, scenarios, feedback, consentsOui },
    actives,
    joursTermines,
    funnel: Array.isArray(funnelRows) ? funnelRows[0] ?? null : null,
    growth,
    retention,
    engagement,
    inscriptions,
    verbatims,
  });
}
