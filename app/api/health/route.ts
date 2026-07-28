// Diagnostic public (booléens uniquement, aucun secret) : dit ce qui est
// branché sur ce déploiement, et si Supabase est réellement joignable + la
// table `profiles` présente. Sert à vérifier « le backend est-il allumé ? »
// sans fouiller les consoles.

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const out: {
    supabase: { configured: boolean; reachable: boolean; profilesTable: boolean };
    supabaseAuth: boolean;
    mistral: boolean;
    adminKey: boolean;
    calLink: boolean;
  } = {
    supabase: { configured: Boolean(url && key), reachable: false, profilesTable: false },
    supabaseAuth: Boolean(process.env.SUPABASE_ANON_KEY),
    mistral: Boolean(process.env.MISTRAL_API_KEY),
    adminKey: Boolean(process.env.ADMIN_KEY),
    calLink: Boolean(process.env.NEXT_PUBLIC_CAL_LINK),
  };

  if (url && key) {
    try {
      const r = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
        headers: { apikey: key, authorization: `Bearer ${key}` },
      });
      out.supabase.reachable = r.status !== 0;
      out.supabase.profilesTable = r.ok; // 200 = la table existe et répond
    } catch {
      /* injoignable → reachable reste false */
    }
  }

  return Response.json({ ok: true, ...out });
}
