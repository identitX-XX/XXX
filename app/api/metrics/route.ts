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
// test → elle polluerait le compte et la liste). Source : la variable Vercel
// ADMIN_EXCLUDE_EMAILS (séparés par des virgules) et/ou la liste ci-dessous.
const EMAILS_EXCLUS_MANUEL: string[] = [
  // ex. "marina@exemple.com" — je remplis avec tes adresses.
];
function emailsExclus(): string[] {
  const env = (process.env.ADMIN_EXCLUDE_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const set = new Set([...env, ...EMAILS_EXCLUS_MANUEL.map((s) => s.trim().toLowerCase())]);
  return Array.from(set).filter(Boolean);
}
// Fragment PostgREST « email pas dans la liste exclue » (vide si rien à exclure).
function exclusionEmail(): string {
  const ex = emailsExclus();
  if (!ex.length) return "";
  const liste = ex.map((e) => `"${e}"`).join(",");
  return `email=${encodeURIComponent(`not.in.(${liste})`)}`;
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

  return Response.json({
    ok: true,
    configured: true,
    kpis: { users, opens, scenarios, feedback, consentsOui },
    funnel: Array.isArray(funnelRows) ? funnelRows[0] ?? null : null,
    growth,
    retention,
    engagement,
    inscriptions,
    verbatims,
  });
}
