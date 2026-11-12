import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("AUTH_SECRET doit être défini en production");
  }
  return s ?? "dev-secret-a-changer-en-production";
}

// ---------- Codes d'activation ----------
// Alphabet sans caractères ambigus (pas de 0/O, 1/I/L) : lisible sur un courrier.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const TENTATIVES_CODE_MAX = 5;
export const VALIDITE_CODE_JOURS = 60;

export function genererCodeActivation(aleatoire: () => number = () => randomBytes(4).readUInt32BE() / 2 ** 32): string {
  let code = "";
  for (let i = 0; i < 8; i++) code += ALPHABET[Math.floor(aleatoire() * ALPHABET.length)];
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export function normaliserCode(saisie: string): string {
  const brut = saisie.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return brut.length === 8 ? `${brut.slice(0, 4)}-${brut.slice(4)}` : brut;
}

export function hacherCode(code: string): string {
  return createHmac("sha256", secret()).update(`code:${normaliserCode(code)}`).digest("hex");
}

export function codeCorrespond(saisie: string, hash: string): boolean {
  return egal(hacherCode(saisie), hash);
}

// ---------- PIN (6 chiffres) ----------
export const TENTATIVES_PIN_MAX = 5;
export const BLOCAGE_PIN_MINUTES = 15;

export function pinValide(pin: string): boolean {
  return /^\d{6}$/.test(pin) && !/^(\d)\1{5}$/.test(pin) && !["123456", "654321", "012345"].includes(pin);
}

export function hacherPin(pin: string): string {
  const sel = randomBytes(16).toString("hex");
  const cle = scryptSync(pin, sel, 32).toString("hex");
  return `scrypt$${sel}$${cle}`;
}

export function pinCorrespond(pin: string, stocke: string): boolean {
  const [algo, sel, cle] = stocke.split("$");
  if (algo !== "scrypt" || !sel || !cle) return false;
  return egal(scryptSync(pin, sel, 32).toString("hex"), cle);
}

// ---------- Sessions et jetons signés ----------
export function nouveauJeton(): string {
  return randomBytes(32).toString("base64url");
}

export function hacherJeton(jeton: string): string {
  return createHash("sha256").update(jeton).digest("hex");
}

/** Jeton court signé (HMAC) pour enchaîner les étapes de l'activation sans état serveur. */
export function signer(donnees: Record<string, unknown>, dureeSecondes: number): string {
  const charge = Buffer.from(
    JSON.stringify({ ...donnees, exp: Math.floor(Date.now() / 1000) + dureeSecondes }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(charge).digest("base64url");
  return `${charge}.${sig}`;
}

export function verifierSignature<T>(jeton: string | undefined): T | null {
  if (!jeton) return null;
  const [charge, sig] = jeton.split(".");
  if (!charge || !sig) return null;
  const attendu = createHmac("sha256", secret()).update(charge).digest("base64url");
  if (!egal(sig, attendu)) return null;
  try {
    const donnees = JSON.parse(Buffer.from(charge, "base64url").toString());
    if (typeof donnees.exp !== "number" || donnees.exp < Date.now() / 1000) return null;
    return donnees as T;
  } catch {
    return null;
  }
}

function egal(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
