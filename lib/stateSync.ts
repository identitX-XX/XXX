// Synchro « connexion = reprendre ». Quand une session (lien magique) existe, on
// relie la progression locale (localStorage) à une ligne serveur `app_state`
// propre à l'utilisateur. Le client Supabase authentifié écrit DIRECTEMENT sa
// ligne : la RLS garantit qu'on ne touche que la sienne.
//
// Règle d'or (exigence produit) : se connecter ne fait JAMAIS repartir à zéro.
// À la connexion, on garde l'état LE PLUS AVANCÉ entre le local et le serveur —
// et on remonte l'autre côté au même niveau. Sans backend configuré (variables
// NEXT_PUBLIC absentes), tout est un no-op silencieux : l'app reste 100 % locale.

import { getSupabase } from "./supabaseBrowser";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { useStore } from "@/store/useStore";

const PARCOURS_KEY = "parcours-archetypes";
const IDENTITX_KEY = "identitx";

type Blob = { state?: Record<string, unknown>; version?: number } | null;

function readLS(k: string): Blob {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as Blob) : null;
  } catch {
    return null;
  }
}

// Niveau d'avancement d'un état de parcours : le jour courant, puis le nombre de
// jours réellement vécus (historique) comme départage. Sert à décider quel côté
// (local ou serveur) est « le plus avancé » — jamais on ne régresse.
function advancement(parcours: Blob): number {
  try {
    const etat = parcours?.state?.etat as
      | { jourCourant?: number; historique?: unknown[] }
      | undefined;
    const jour = typeof etat?.jourCourant === "number" ? etat.jourCourant : 0;
    const vecus = Array.isArray(etat?.historique) ? etat!.historique!.length : 0;
    return jour * 1000 + vecus;
  } catch {
    return 0;
  }
}

async function currentUserId(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// Pousse l'état local courant vers le serveur (upsert idempotent sur user_id).
export async function pushState(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const uid = await currentUserId();
  if (!uid) return;

  const parcours = readLS(PARCOURS_KEY);
  const identitx = readLS(IDENTITX_KEY);
  if (!parcours && !identitx) return;

  try {
    await sb
      .from("app_state")
      .upsert(
        { user_id: uid, parcours, identitx, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
  } catch {
    /* la synchro ne doit jamais casser l'app */
  }
}

// À la connexion : réconcilie local ↔ serveur en gardant le plus avancé.
// Renvoie true si l'état local a été remplacé par celui du serveur (reprise).
export async function pullAndMerge(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const uid = await currentUserId();
  if (!uid) return false;

  let serveur: { parcours: Blob; identitx: Blob } | null = null;
  try {
    const { data } = await sb
      .from("app_state")
      .select("parcours, identitx")
      .eq("user_id", uid)
      .maybeSingle();
    serveur = (data as { parcours: Blob; identitx: Blob } | null) ?? null;
  } catch {
    serveur = null;
  }

  // Rien côté serveur → première connexion : on y sème l'état local.
  if (!serveur || (!serveur.parcours && !serveur.identitx)) {
    await pushState();
    return false;
  }

  const local = readLS(PARCOURS_KEY);
  const avServeur = advancement(serveur.parcours);
  const avLocal = advancement(local);

  // Le serveur est au moins aussi avancé → on REPREND ce qui est sauvegardé.
  if (avServeur >= avLocal) {
    try {
      if (serveur.parcours)
        localStorage.setItem(PARCOURS_KEY, JSON.stringify(serveur.parcours));
      if (serveur.identitx)
        localStorage.setItem(IDENTITX_KEY, JSON.stringify(serveur.identitx));
    } catch {}
    // Rehydrate les stores en mémoire pour que l'écran reflète la reprise.
    try {
      await useParcoursStore.persist.rehydrate();
      await useStore.persist.rehydrate();
    } catch {}
    return true;
  }

  // Le local est plus avancé (progression faite hors ligne / avant connexion) →
  // le serveur rattrape, on ne perd rien.
  await pushState();
  return false;
}
