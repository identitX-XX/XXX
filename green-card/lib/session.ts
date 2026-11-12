import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";
import { hacherJeton, nouveauJeton } from "./securite";

export const COOKIE_SESSION = "gc_session";
export const COOKIE_ACTIVATION = "gc_activation";
const DUREE_SESSION_JOURS = 30;

const optionsCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function ouvrirSession(carteId: string) {
  const jeton = nouveauJeton();
  const expireLe = new Date(Date.now() + DUREE_SESSION_JOURS * 86_400_000);
  await db.session.create({ data: { tokenHash: hacherJeton(jeton), carteId, expireLe } });
  cookies().set(COOKIE_SESSION, jeton, { ...optionsCookie, expires: expireLe });
}

export async function fermerSession() {
  const jeton = cookies().get(COOKIE_SESSION)?.value;
  if (jeton) await db.session.deleteMany({ where: { tokenHash: hacherJeton(jeton) } });
  cookies().delete(COOKIE_SESSION);
}

/** La carte connectée, avec son logement et sa résidence, ou null. */
export async function carteConnectee() {
  const jeton = cookies().get(COOKIE_SESSION)?.value;
  if (!jeton) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hacherJeton(jeton) },
    include: { carte: { include: { logement: { include: { residence: true } } } } },
  });
  if (!session || session.expireLe < new Date()) return null;
  return session.carte;
}

export function poserCookieActivation(valeur: string) {
  cookies().set(COOKIE_ACTIVATION, valeur, { ...optionsCookie, maxAge: 15 * 60 });
}

export function lireCookieActivation() {
  return cookies().get(COOKIE_ACTIVATION)?.value;
}

export function effacerCookieActivation() {
  cookies().delete(COOKIE_ACTIVATION);
}
