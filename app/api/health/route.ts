// Diagnostic public (booléens uniquement, aucun secret) : dit ce qui est
// branché sur ce déploiement, et si Supabase est réellement joignable + la
// table `profiles` présente. Sert à vérifier « le backend est-il allumé ? »
// sans fouiller les consoles.

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const out: {
    supabase: {
      configured: boolean;
      reachable: boolean;
      profilesTable: boolean;
      feedbackTable: boolean;
      eventsTable: boolean;
    };
    supabaseAuth: boolean;
    mistral: boolean;
    adminKey: boolean;
    calLink: boolean;
  } = {
    supabase: {
      configured: Boolean(url && key),
      reachable: false,
      profilesTable: false,
      feedbackTable: false,
      eventsTable: false,
    },
    supabaseAuth: Boolean(process.env.SUPABASE_ANON_KEY),
    mistral: Boolean(process.env.MISTRAL_API_KEY),
    adminKey: Boolean(process.env.ADMIN_KEY),
    calLink: Boolean(process.env.NEXT_PUBLIC_CAL_LINK),
  };

  if (url && key) {
    const headers = { apikey: key, authorization: `Bearer ${key}` };
    const table = async (name: string) => {
      try {
        const r = await fetch(`${url}/rest/v1/${name}?select=id&limit=1`, { headers });
        return { reachable: r.status !== 0, exists: r.ok };
      } catch {
        return { reachable: false, exists: false };
      }
    };
    const [prof, fb, ev] = await Promise.all([
      table("profiles"),
      table("feedback"),
      table("events"),
    ]);
    out.supabase.reachable = prof.reachable;
    out.supabase.profilesTable = prof.exists;
    out.supabase.feedbackTable = fb.exists;
    out.supabase.eventsTable = ev.exists;
  }

  return Response.json({ ok: true, ...out });
}
