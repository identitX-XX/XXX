"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { carteConnectee } from "@/lib/session";
import { attribuerNiveau, type Gain } from "@/lib/points";
import { COMPTEURS, TYPES_COMPTEUR, niveauCompteur, verifierReleve, type ReleveSimple, type TypeCompteur } from "@/lib/jeux/compteur";
import {
  DUREE_MAX_MS,
  PARTIES_MAX_PAR_JOUR,
  dechet,
  estBac,
  niveauTri,
  scorer,
  tirerDechets,
  type Bac,
} from "@/lib/jeux/tri";
import {
  ASTUCES_MAX_PAR_JOUR,
  SIGNALEMENTS_MASQUAGE,
  estUniversAstuce,
  niveauAstuces,
  verifierAstuce,
} from "@/lib/jeux/astuces";

export type EtatJeu = { erreur?: string; succes?: string; gain?: Gain | null; cle?: number } | undefined;

async function exigerCarte() {
  const carte = await carteConnectee();
  if (!carte) redirect("/connexion");
  return carte;
}

const debutDuJour = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// ===========================================================================
// Jeu 1 — Le Compteur Malin
// ===========================================================================

export async function activerSuiviConso() {
  const carte = await exigerCarte();
  await db.carte.update({ where: { id: carte.id }, data: { consentConsommation: new Date() } });
  revalidatePath("/defis/compteur-malin");
}

export async function releverCompteur(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  if (!carte.consentConsommation) return { erreur: "Activez d'abord le suivi de vos consommations." };

  const type = String(form.get("type") ?? "") as TypeCompteur;
  if (!TYPES_COMPTEUR.includes(type)) return { erreur: "Choisissez un compteur." };
  const saisie = String(form.get("index") ?? "").replace(/\s/g, "").replace(",", ".");
  const index = saisie === "" ? NaN : Number(saisie);

  const maintenant = new Date();
  const precedent = await db.releve.findFirst({ where: { carteId: carte.id, type }, orderBy: { date: "desc" } });
  const erreur = verifierReleve(type, index, precedent, maintenant);
  if (erreur) return { erreur };

  const gain = await db.$transaction(async (tx) => {
    await tx.releve.create({ data: { carteId: carte.id, type, index, date: maintenant } });
    const tous = await tx.releve.findMany({ where: { carteId: carte.id }, orderBy: { date: "asc" } });
    const parType: Partial<Record<TypeCompteur, ReleveSimple[]>> = {};
    for (const r of tous) (parType[r.type as TypeCompteur] ??= []).push(r);
    return attribuerNiveau(tx, carte.id, "compteur-malin", niveauCompteur(parType));
  });

  revalidatePath("/defis/compteur-malin");
  revalidatePath("/carte");
  return { succes: `Relevé ${COMPTEURS[type].nom.toLowerCase()} enregistré.`, gain, cle: Date.now() };
}

// ===========================================================================
// Jeu 6 — Tri Master
// ===========================================================================

export type DebutPartie =
  | { erreur: string }
  | { partieId: string; dechets: { id: string; nom: string; emoji: string }[]; dureeMaxMs: number };

export async function demarrerPartieTri(): Promise<DebutPartie> {
  const carte = await exigerCarte();
  const aujourdhui = await db.partieTri.count({ where: { carteId: carte.id, debut: { gte: debutDuJour() } } });
  if (aujourdhui >= PARTIES_MAX_PAR_JOUR)
    return { erreur: `Vous avez joué ${PARTIES_MAX_PAR_JOUR} parties aujourd'hui. Revenez demain pour battre votre record !` };

  const ids = tirerDechets();
  const partie = await db.partieTri.create({ data: { carteId: carte.id, dechets: JSON.stringify(ids) } });
  return {
    partieId: partie.id,
    dechets: ids.map((id) => {
      const d = dechet(id)!;
      return { id, nom: d.nom, emoji: d.emoji }; // la bonne réponse n'est jamais envoyée au navigateur
    }),
    dureeMaxMs: DUREE_MAX_MS,
  };
}

export type ReponseTri = { erreur: string } | { correct: boolean; bonBac: Bac; explication: string };

export async function repondreTri(partieId: string, dechetId: string, bac: string): Promise<ReponseTri> {
  const carte = await exigerCarte();
  if (!estBac(bac)) return { erreur: "Bac inconnu." };

  return db.$transaction(async (tx) => {
    const partie = await tx.partieTri.findUnique({ where: { id: partieId } });
    if (!partie || partie.carteId !== carte.id || partie.fin) return { erreur: "Cette partie est terminée." };
    if (Date.now() - partie.debut.getTime() > DUREE_MAX_MS) return { erreur: "Temps écoulé !" };

    const ids: string[] = JSON.parse(partie.dechets);
    const reponses: Record<string, Bac> = JSON.parse(partie.reponses);
    if (!ids.includes(dechetId)) return { erreur: "Ce déchet ne fait pas partie de la partie." };
    if (reponses[dechetId]) return { erreur: "Déjà trié !" };

    reponses[dechetId] = bac;
    await tx.partieTri.update({ where: { id: partieId }, data: { reponses: JSON.stringify(reponses) } });
    const d = dechet(dechetId)!;
    return { correct: d.bac === bac, bonBac: d.bac, explication: d.explication };
  });
}

export type FinPartie = { erreur: string } | { score: number; total: number; dureeMs: number; niveau: number; gain: Gain | null };

export async function terminerPartieTri(partieId: string): Promise<FinPartie> {
  const carte = await exigerCarte();
  const resultat = await db.$transaction(async (tx) => {
    const partie = await tx.partieTri.findUnique({ where: { id: partieId } });
    if (!partie || partie.carteId !== carte.id || partie.fin) return { erreur: "Cette partie est déjà terminée." } as const;

    const ids: string[] = JSON.parse(partie.dechets);
    const reponses: Record<string, Bac> = JSON.parse(partie.reponses);
    const fin = new Date();
    const dureeMs = fin.getTime() - partie.debut.getTime();
    const score = scorer(ids, reponses);
    const niveau = niveauTri(score, ids.length, dureeMs);
    await tx.partieTri.update({ where: { id: partieId }, data: { fin, score, dureeMs } });
    const gain = await attribuerNiveau(tx, carte.id, "tri-master", niveau);
    return { score, total: ids.length, dureeMs, niveau, gain };
  });
  revalidatePath("/carte");
  revalidatePath("/defis/tri-master");
  return resultat;
}

// ===========================================================================
// Jeu 9 — La Boîte à Astuces
// ===========================================================================

async function majNiveauAstuces(tx: Prisma.TransactionClient, carteId: string) {
  const [publiees, votesDonnes, miennes] = await Promise.all([
    tx.astuce.count({ where: { carteId, statut: "publiee" } }),
    tx.voteAstuce.count({ where: { carteId } }),
    tx.astuce.findMany({ where: { carteId, statut: "publiee" }, select: { _count: { select: { votes: true } } } }),
  ]);
  const meilleurScore = Math.max(0, ...miennes.map((a) => a._count.votes));
  return attribuerNiveau(tx, carteId, "boite-a-astuces", niveauAstuces({ publiees, votesDonnes, meilleurScore }));
}

export async function publierAstuce(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  const univers = String(form.get("univers") ?? "");
  if (!estUniversAstuce(univers)) return { erreur: "Choisissez un thème." };
  const { titre, texte, erreur } = verifierAstuce(String(form.get("titre") ?? ""), String(form.get("texte") ?? ""));
  if (erreur) return { erreur };

  const aujourdhui = await db.astuce.count({ where: { carteId: carte.id, createdAt: { gte: debutDuJour() } } });
  if (aujourdhui >= ASTUCES_MAX_PAR_JOUR) return { erreur: `${ASTUCES_MAX_PAR_JOUR} astuces par jour maximum. Gardez les autres pour demain !` };

  const gain = await db.$transaction(async (tx) => {
    await tx.astuce.create({ data: { carteId: carte.id, residenceId: carte.logement.residenceId, univers, titre, texte } });
    return majNiveauAstuces(tx, carte.id);
  });

  revalidatePath("/defis/boite-a-astuces");
  revalidatePath("/carte");
  return { succes: "Merci ! Votre astuce est publiée pour vos voisins.", gain, cle: Date.now() };
}

export async function voterAstuce(astuceId: string): Promise<{ erreur?: string; gain?: Gain | null }> {
  const carte = await exigerCarte();
  const astuce = await db.astuce.findUnique({ where: { id: astuceId } });
  if (!astuce || astuce.statut !== "publiee" || astuce.residenceId !== carte.logement.residenceId) return { erreur: "Astuce introuvable." };
  if (astuce.carteId === carte.id) return { erreur: "Vous ne pouvez pas voter pour votre propre astuce." };

  const gain = await db.$transaction(async (tx) => {
    const cle = { astuceId_carteId: { astuceId, carteId: carte.id } };
    const existant = await tx.voteAstuce.findUnique({ where: cle });
    if (existant) await tx.voteAstuce.delete({ where: cle });
    else await tx.voteAstuce.create({ data: { astuceId, carteId: carte.id } });
    const monGain = await majNiveauAstuces(tx, carte.id);
    await majNiveauAstuces(tx, astuce.carteId); // l'auteur peut décrocher l'or grâce à ce vote
    return monGain;
  });

  revalidatePath("/defis/boite-a-astuces");
  revalidatePath("/carte");
  return { gain };
}

export async function signalerAstuce(astuceId: string): Promise<{ erreur?: string; succes?: string }> {
  const carte = await exigerCarte();
  const astuce = await db.astuce.findUnique({ where: { id: astuceId } });
  if (!astuce || astuce.residenceId !== carte.logement.residenceId) return { erreur: "Astuce introuvable." };
  if (astuce.carteId === carte.id) return { erreur: "C'est votre astuce." };

  await db.$transaction(async (tx) => {
    await tx.signalementAstuce.upsert({
      where: { astuceId_carteId: { astuceId, carteId: carte.id } },
      create: { astuceId, carteId: carte.id },
      update: {},
    });
    const n = await tx.signalementAstuce.count({ where: { astuceId } });
    if (n >= SIGNALEMENTS_MASQUAGE) await tx.astuce.update({ where: { id: astuceId }, data: { statut: "masquee" } });
  });

  revalidatePath("/defis/boite-a-astuces");
  return { succes: "Merci, l'astuce a été signalée à la modération." };
}
