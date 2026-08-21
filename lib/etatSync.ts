// Synchro « e-mail = reprendre ». La progression locale (localStorage) est
// sauvegardée côté serveur sous l'e-mail collecté à l'entrée, via /api/etat.
// Au retour (même e-mail sur un nouvel appareil ou après vidage de cache), on
// restaure l'état s'il est au moins aussi avancé que le local — jamais de
// régression. Sans backend : no-op silencieux (l'app reste 100 % locale).

import { useParcoursStore } from "@/parcours-archetypes/store";
import { useStore } from "@/store/useStore";
import { useGap } from "@/parcours-gap/store";
import { serveurPlusAvance } from "./etatSync.logic";

const EMAIL_LS = "idx-email";
// Les clés localStorage qui composent l'état complet du parcours.
const KEYS = ["identitx", "parcours-archetypes", "parcours-gap", "parcours-boucle"];

type Blob = { state?: Record<string, unknown>; version?: number } | null;
type Stores = Record<string, unknown>;

export function getEmail(): string | null {
  try {
    return localStorage.getItem(EMAIL_LS);
  } catch {
    return null;
  }
}
export function setEmail(email: string): void {
  try {
    localStorage.setItem(EMAIL_LS, email.trim().toLowerCase());
  } catch {}
}

function snapshot(): Stores {
  const out: Stores = {};
  for (const k of KEYS) {
    try {
      const v = localStorage.getItem(k);
      if (v) out[k] = JSON.parse(v);
    } catch {}
  }
  return out;
}

// La logique d'avancement / de décision vit dans ./etatSync.logic (pure, testée).

async function rehydrate(): Promise<void> {
  try {
    await useParcoursStore.persist.rehydrate();
    await useStore.persist.rehydrate();
    await useGap.persist.rehydrate();
  } catch {}
}

// Restaure depuis le serveur si (et seulement si) l'état serveur est au moins
// aussi avancé que le local. Renvoie true si une reprise a eu lieu.
export async function pullEtat(email: string): Promise<boolean> {
  let stores: Stores | null = null;
  try {
    const r = await fetch(`/api/etat?email=${encodeURIComponent(email)}`, { cache: "no-store" });
    const d = await r.json().catch(() => ({ stores: null }));
    stores = (d?.stores as Stores) ?? null;
  } catch {
    stores = null;
  }
  if (!stores || typeof stores !== "object") return false;

  const serverBlob = (stores["parcours-archetypes"] as Blob) ?? null;
  let localBlob: Blob = null;
  try {
    const v = localStorage.getItem("parcours-archetypes");
    localBlob = v ? (JSON.parse(v) as Blob) : null;
  } catch {}

  // On ne restaure QUE si le serveur est STRICTEMENT plus avancé. À égalité (ou
  // en-dessous), on garde le local : c'est ce qui évitait, avant, qu'une
  // sauvegarde serveur « à égalité » mais incomplète écrase la progression et
  // force à tout refaire. Le push rattrapera le serveur.
  if (!serveurPlusAvance(serverBlob, localBlob)) {
    return false;
  }

  try {
    for (const k of KEYS) {
      if (stores[k]) localStorage.setItem(k, JSON.stringify(stores[k]));
    }
  } catch {}
  await rehydrate();
  return true;
}

// Pousse l'état local vers le serveur (débouncé).
let timer: ReturnType<typeof setTimeout> | undefined;
export function pushEtat(email: string, anonId?: string): void {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const stores = snapshot();
    if (Object.keys(stores).length === 0) return;
    fetch("/api/etat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, anon_id: anonId, stores }),
    }).catch(() => {});
  }, 1500);
}

// Pousse IMMÉDIATEMENT l'état local (sans débounce) et attend la confirmation.
// Utilisé après un « Refaire mon diagnostic » : sans ça, le serveur garde la
// signature précédente et la restaure au prochain chargement (l'utilisatrice
// n'atteint jamais les 12 questions). On annule d'abord tout push débouncé en
// attente pour qu'un ancien snapshot ne reparte pas après coup.
export async function pushEtatNow(email: string, anonId?: string): Promise<void> {
  clearTimeout(timer);
  const stores = snapshot();
  if (Object.keys(stores).length === 0) return;
  try {
    await fetch("/api/etat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, anon_id: anonId, stores }),
    });
  } catch {}
}
