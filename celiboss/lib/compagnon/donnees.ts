// Lecture des données de l'espace membre (côté serveur, sous RLS).
import { calculerElan, referenceCardio, type Echelle, type Elan } from "@/lib/compagnon/elan";
import { aujourdhui, type LignePoint } from "@/lib/compagnon/point";
import { supabaseServeur } from "@/lib/supabase/serveur";

export type Profil = {
  id: string;
  prenom: string;
  cap_du_mois: string | null;
  sante_consentie_le: string | null;
  cgu_acceptees_le: string;
};

export type JourElan = { jour: string; point: LignePoint; elan: Elan };

export function elanDe(p: LignePoint, refCardio: number | null): Elan {
  return calculerElan(
    {
      humeur: p.humeur as Echelle | null,
      energie: p.energie as Echelle | null,
      ambition: p.ambition as Echelle | null,
      sommeilMinutes: p.sommeil_minutes,
      cardioRepos: p.cardio_repos,
    },
    refCardio,
  );
}

/** Profil, point du jour, élan du jour et historique (30 derniers points). */
export async function chargerEspace() {
  const supabase = supabaseServeur();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profil }, { data: points }] = await Promise.all([
    supabase.from("profils").select("id, prenom, cap_du_mois, sante_consentie_le, cgu_acceptees_le").eq("id", user.id).single<Profil>(),
    supabase
      .from("points")
      .select("jour, humeur, energie, ambition, esprit, sommeil_minutes, cardio_repos, source")
      .eq("user_id", user.id)
      .order("jour", { ascending: false })
      .limit(30)
      .returns<LignePoint[]>(),
  ]);

  const liste = points ?? [];
  // Référence cardio : la normale personnelle des 14 derniers points.
  const ref = referenceCardio(liste.slice(0, 14).map((p) => p.cardio_repos));
  const historique: JourElan[] = liste.map((p) => ({ jour: p.jour, point: p, elan: elanDe(p, ref) }));
  const jour = aujourdhui();
  const duJour = historique.find((h) => h.jour === jour) ?? null;

  return { user, profil, historique, duJour, jour, referenceCardio: ref };
}
