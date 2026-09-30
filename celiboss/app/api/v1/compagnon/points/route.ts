import { NextResponse } from "next/server";
import { validerPoint, versLigne } from "@/lib/compagnon/point";
import { supabaseConfigure } from "@/lib/supabase/config";
import { supabaseJeton } from "@/lib/supabase/serveur";

// API du Compagnon pour les autres appareils (application mobile, montre via
// Apple Santé / Health Connect). Authentification : « Authorization: Bearer
// <jeton d'accès Supabase> ». Les règles RLS s'appliquent comme sur le web.
//
//   GET  /api/v1/compagnon/points?depuis=AAAA-MM-JJ  → { points: [...] }
//   POST /api/v1/compagnon/points  { jour, sommeilMinutes, cardioRepos, humeur, …, source }

export const dynamic = "force-dynamic";

async function authentifier(req: Request) {
  if (!supabaseConfigure) return { erreur: NextResponse.json({ erreur: "Service non configuré." }, { status: 503 }) };
  const jeton = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!jeton) return { erreur: NextResponse.json({ erreur: "Jeton manquant." }, { status: 401 }) };
  const supabase = supabaseJeton(jeton);
  const {
    data: { user },
  } = await supabase.auth.getUser(jeton);
  if (!user) return { erreur: NextResponse.json({ erreur: "Jeton invalide ou expiré." }, { status: 401 }) };
  return { supabase, user };
}

export async function GET(req: Request) {
  const a = await authentifier(req);
  if ("erreur" in a) return a.erreur;
  const depuis = new URL(req.url).searchParams.get("depuis");
  let requete = a.supabase
    .from("points")
    .select("jour, humeur, energie, ambition, esprit, sommeil_minutes, cardio_repos, source, modifie_le")
    .eq("user_id", a.user.id)
    .order("jour", { ascending: false })
    .limit(90);
  if (depuis && /^\d{4}-\d{2}-\d{2}$/.test(depuis)) requete = requete.gte("jour", depuis);
  const { data, error } = await requete;
  if (error) return NextResponse.json({ erreur: "Lecture impossible." }, { status: 500 });
  return NextResponse.json({ points: data });
}

export async function POST(req: Request) {
  const a = await authentifier(req);
  if ("erreur" in a) return a.erreur;
  const brut = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!brut) return NextResponse.json({ erreur: "Corps JSON invalide." }, { status: 400 });

  const { data: profil } = await a.supabase.from("profils").select("sante_consentie_le").eq("id", a.user.id).single();
  const r = validerPoint(brut, Boolean(profil?.sante_consentie_le));
  if (!r.ok) return NextResponse.json({ erreurs: r.erreurs }, { status: 422 });

  // Fusion : la montre n'écrase pas l'humeur saisie le matin, et inversement.
  const { data: existant } = await a.supabase
    .from("points")
    .select("humeur, energie, ambition, esprit, sommeil_minutes, cardio_repos, source")
    .eq("user_id", a.user.id)
    .eq("jour", r.point.jour)
    .maybeSingle();
  const ligne = versLigne(a.user.id, r.point);
  const fusion = existant
    ? {
        ...ligne,
        humeur: ligne.humeur ?? existant.humeur,
        energie: ligne.energie ?? existant.energie,
        ambition: ligne.ambition ?? existant.ambition,
        esprit: ligne.esprit ?? existant.esprit,
        sommeil_minutes: ligne.sommeil_minutes ?? existant.sommeil_minutes,
        cardio_repos: ligne.cardio_repos ?? existant.cardio_repos,
        source: existant.source !== ligne.source ? "mixte" : ligne.source,
      }
    : ligne;

  const { error } = await a.supabase.from("points").upsert(fusion, { onConflict: "user_id,jour" });
  if (error) return NextResponse.json({ erreur: "Enregistrement impossible." }, { status: 500 });
  return NextResponse.json({ ok: true, jour: r.point.jour });
}
