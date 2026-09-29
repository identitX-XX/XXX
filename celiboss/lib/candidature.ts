// Collecte de données — principe de MINIMISATION (RGPD art. 5.1.c) : on ne
// demande que ce qui sert à rappeler la personne. Aucune donnée « sensible »
// (art. 9 : orientation, santé, religion, origine…) n'est collectée en ligne ;
// ces sujets se traitent en entretien, oralement.

export const TERRAINS = {
  sentimental: "Sentimental",
  relationnel: "Relationnel",
  pro: "Pro",
} as const;
export type Terrain = keyof typeof TERRAINS;

/** Version de la notice affichée : conservée avec chaque envoi (preuve du consentement). */
export const VERSION_NOTICE = "2026-09-29";
export const DUREE_CONSERVATION = "3 ans après notre dernier échange";

export type Candidature = {
  prenom: string;
  email: string;
  telephone?: string;
  ville?: string;
  terrain: Terrain;
  message?: string;
  consentement: true;
  newsletter: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TEL = /^[+\d][\d\s.()-]{6,19}$/;

function texte(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

export type Resultat = { ok: true; data: Candidature } | { ok: false; erreurs: Record<string, string> };

export function valider(brut: Record<string, unknown>): Resultat {
  const erreurs: Record<string, string> = {};
  const prenom = texte(brut.prenom, 60);
  const email = texte(brut.email, 120)?.toLowerCase();
  const telephone = texte(brut.telephone, 20);
  const ville = texte(brut.ville, 60);
  const message = texte(brut.message, 800);
  const terrain = brut.terrain;

  if (!prenom) erreurs.prenom = "Indiquez votre prénom.";
  if (!email || !EMAIL.test(email)) erreurs.email = "Indiquez une adresse e-mail valide.";
  if (telephone && !TEL.test(telephone)) erreurs.telephone = "Ce numéro ne semble pas valide.";
  if (typeof terrain !== "string" || !(terrain in TERRAINS)) erreurs.terrain = "Choisissez un terrain.";
  if (brut.consentement !== true && brut.consentement !== "on")
    erreurs.consentement = "Votre accord est nécessaire pour que nous puissions vous recontacter.";

  if (Object.keys(erreurs).length) return { ok: false, erreurs };
  return {
    ok: true,
    data: {
      prenom: prenom!,
      email: email!,
      telephone,
      ville,
      terrain: terrain as Terrain,
      message,
      consentement: true,
      newsletter: brut.newsletter === true || brut.newsletter === "on",
    },
  };
}
