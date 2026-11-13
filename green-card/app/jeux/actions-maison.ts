"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { exigerCarte } from "@/lib/carte-courante";
import { attribuerNiveau, type Gain } from "@/lib/points";
import { jourParis, veille } from "@/lib/temps";
import {
  DUREE_MAX_GASPI_MS,
  NB_GASPI,
  PARTIES_GASPI_MAX_PAR_JOUR,
  melangerScene,
  niveauGaspi,
  objetScene,
  type Piece,
} from "@/lib/jeux/gaspi";
import { DUREE_MAX_S, litresEconomises, niveauDouche, verdictDouche, type VerdictDouche } from "@/lib/jeux/douche";
import { journeeTenue, niveau19, verifierEngagements } from "@/lib/jeux/chauffage";
import {
  ACTIONS_FRIGO_MAX_PAR_JOUR,
  QUIZ,
  RECETTES,
  estActionAntiGaspi,
  niveauFrigo,
  scorerQuiz,
} from "@/lib/jeux/frigo";
import type { EtatJeu } from "./actions";

const debutDuJour = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function rafraichir(defi: string) {
  revalidatePath(`/defis/${defi}`);
  revalidatePath("/carte");
}

// ===========================================================================
// Jeu 2 — Chasse au Gaspi
// ===========================================================================

export type DebutGaspi =
  | { erreur: string }
  | { partieId: string; objets: { id: string; piece: Piece; emoji: string; description: string }[]; dureeMaxMs: number; total: number };

export async function demarrerPartieGaspi(): Promise<DebutGaspi> {
  const carte = await exigerCarte();
  const n = await db.partieGaspi.count({ where: { carteId: carte.id, debut: { gte: debutDuJour() } } });
  if (n >= PARTIES_GASPI_MAX_PAR_JOUR) return { erreur: `${PARTIES_GASPI_MAX_PAR_JOUR} parties par jour maximum. Revenez demain !` };

  const ordre = melangerScene();
  const partie = await db.partieGaspi.create({ data: { carteId: carte.id, objets: JSON.stringify(ordre) } });
  return {
    partieId: partie.id,
    // La solution (gaspillage ou bon geste) n'est jamais envoyée avant le clic.
    objets: ordre.map((id) => {
      const o = objetScene(id)!;
      return { id, piece: o.piece, emoji: o.emoji, description: o.description };
    }),
    dureeMaxMs: DUREE_MAX_GASPI_MS,
    total: NB_GASPI,
  };
}

export type ClicGaspi = { erreur: string } | { gaspi: boolean; explication: string; trouves: number; erreurs: number };

export async function toucherObjet(partieId: string, objetId: string): Promise<ClicGaspi> {
  const carte = await exigerCarte();
  return db.$transaction(async (tx) => {
    const p = await tx.partieGaspi.findUnique({ where: { id: partieId } });
    if (!p || p.carteId !== carte.id || p.fin) return { erreur: "Cette partie est terminée." };
    if (Date.now() - p.debut.getTime() > DUREE_MAX_GASPI_MS) return { erreur: "Temps écoulé !" };
    const objets: string[] = JSON.parse(p.objets);
    const clics: string[] = JSON.parse(p.clics);
    const o = objetScene(objetId);
    if (!o || !objets.includes(objetId)) return { erreur: "Objet inconnu." };
    if (clics.includes(objetId)) return { gaspi: o.gaspi, explication: o.explication, trouves: p.trouves, erreurs: p.erreurs };

    const maj = await tx.partieGaspi.update({
      where: { id: partieId },
      data: {
        clics: JSON.stringify([...clics, objetId]),
        trouves: o.gaspi ? { increment: 1 } : undefined,
        erreurs: o.gaspi ? undefined : { increment: 1 },
      },
    });
    return { gaspi: o.gaspi, explication: o.explication, trouves: maj.trouves, erreurs: maj.erreurs };
  });
}

export type FinGaspi = { erreur: string } | { trouves: number; total: number; erreurs: number; dureeMs: number; niveau: number; gain: Gain | null; manques: { emoji: string; description: string; explication: string }[] };

export async function terminerPartieGaspi(partieId: string): Promise<FinGaspi> {
  const carte = await exigerCarte();
  const r = await db.$transaction(async (tx) => {
    const p = await tx.partieGaspi.findUnique({ where: { id: partieId } });
    if (!p || p.carteId !== carte.id || p.fin) return { erreur: "Cette partie est déjà terminée." } as const;
    const fin = new Date();
    const dureeMs = fin.getTime() - p.debut.getTime();
    await tx.partieGaspi.update({ where: { id: partieId }, data: { fin, dureeMs } });
    const niveau = niveauGaspi(p.trouves, p.erreurs, dureeMs);
    const gain = await attribuerNiveau(tx, carte.id, "chasse-au-gaspi", niveau);
    const clics: string[] = JSON.parse(p.clics);
    const manques = (JSON.parse(p.objets) as string[])
      .map((id) => objetScene(id)!)
      .filter((o) => o.gaspi && !clics.includes(o.id))
      .map((o) => ({ emoji: o.emoji, description: o.description, explication: o.explication }));
    return { trouves: p.trouves, total: NB_GASPI, erreurs: p.erreurs, dureeMs, niveau, gain, manques };
  });
  rafraichir("chasse-au-gaspi");
  return r;
}

// ===========================================================================
// Jeu 3 — Douche Chrono
// ===========================================================================

export async function demarrerDouche(): Promise<{ id: string; debut: string; maintenant: string }> {
  const carte = await exigerCarte();
  const ouverte = await db.douche.findFirst({ where: { carteId: carte.id, fin: null }, orderBy: { debut: "desc" } });
  if (ouverte && Date.now() - ouverte.debut.getTime() < DUREE_MAX_S * 1000) {
    return { id: ouverte.id, debut: ouverte.debut.toISOString(), maintenant: new Date().toISOString() };
  }
  if (ouverte) await db.douche.delete({ where: { id: ouverte.id } }); // minuteur oublié
  const d = await db.douche.create({ data: { carteId: carte.id, jour: jourParis() } });
  return { id: d.id, debut: d.debut.toISOString(), maintenant: new Date().toISOString() };
}

export type FinDouche = { erreur: string } | { dureeS: number; verdict: VerdictDouche; litres: number; gain: Gain | null };

export async function terminerDouche(id: string): Promise<FinDouche> {
  const carte = await exigerCarte();
  const r = await db.$transaction(async (tx) => {
    const d = await tx.douche.findUnique({ where: { id } });
    if (!d || d.carteId !== carte.id || d.fin) return { erreur: "Ce minuteur est déjà arrêté." } as const;
    const fin = new Date();
    const dureeS = Math.round((fin.getTime() - d.debut.getTime()) / 1000);
    const verdict = verdictDouche(dureeS);
    if (verdict === "trop-court" || verdict === "trop-long") {
      await tx.douche.delete({ where: { id } });
      return { dureeS, verdict, litres: 0, gain: null };
    }
    const reussie = verdict === "reussie";
    await tx.douche.update({ where: { id }, data: { fin, dureeS, reussie } });
    const jours = await tx.douche.findMany({ where: { carteId: carte.id, reussie: true }, select: { jour: true }, distinct: ["jour"] });
    const gain = await attribuerNiveau(tx, carte.id, "douche-chrono", niveauDouche(jours.map((j) => j.jour)));
    return { dureeS, verdict, litres: litresEconomises(dureeS), gain };
  });
  rafraichir("douche-chrono");
  return r;
}

export async function annulerDouche(id: string): Promise<void> {
  const carte = await exigerCarte();
  await db.douche.deleteMany({ where: { id, carteId: carte.id, fin: null } });
}

// ===========================================================================
// Jeu 4 — Opération 19 °C
// ===========================================================================

async function majNiveau19(tx: Prisma.TransactionClient, carteId: string) {
  const tenues = await tx.checkIn19.count({ where: { carteId, tenue: true } });
  return attribuerNiveau(tx, carteId, "operation-19", niveau19(tenues));
}

export async function enregistrerEngagements(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  const choisis = [...new Set(form.getAll("engagement").map(String))];
  const erreur = verifierEngagements(choisis);
  if (erreur) return { erreur };
  await db.engagement19.upsert({
    where: { carteId: carte.id },
    create: { carteId: carte.id, engagements: JSON.stringify(choisis) },
    update: { engagements: JSON.stringify(choisis) },
  });
  revalidatePath("/defis/operation-19");
  return { succes: "Vos engagements sont enregistrés. Rendez-vous chaque jour pour faire le point !", cle: Date.now() };
}

export async function pointerJournee(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  const eng = await db.engagement19.findUnique({ where: { carteId: carte.id } });
  if (!eng) return { erreur: "Choisissez d'abord vos engagements." };
  const choisis: string[] = JSON.parse(eng.engagements);
  const faits = [...new Set(form.getAll("fait").map(String))].filter((f) => choisis.includes(f));
  const aujourdhui = jourParis();
  const jour = form.get("quand") === "hier" ? veille(aujourdhui) : aujourdhui;
  const tenue = journeeTenue(faits, choisis);

  const gain = await db.$transaction(async (tx) => {
    await tx.checkIn19.upsert({
      where: { carteId_jour: { carteId: carte.id, jour } },
      create: { carteId: carte.id, jour, faits: JSON.stringify(faits), tenue },
      update: { faits: JSON.stringify(faits), tenue },
    });
    return majNiveau19(tx, carte.id);
  });

  rafraichir("operation-19");
  return {
    succes: tenue
      ? `Journée tenue : ${faits.length} engagement${faits.length > 1 ? "s" : ""} sur ${choisis.length}. Bravo !`
      : `Noté : ${faits.length} sur ${choisis.length}. Il en faut au moins la moitié pour que la journée compte.`,
    gain,
    cle: Date.now(),
  };
}

// ===========================================================================
// Jeu 7 — Zéro Gaspi Frigo
// ===========================================================================

async function majNiveauFrigo(tx: Prisma.TransactionClient, carteId: string) {
  const [jours, parfait] = await Promise.all([
    tx.actionAntiGaspi.findMany({ where: { carteId }, select: { jour: true }, distinct: ["jour"] }),
    tx.quizFrigo.findFirst({ where: { carteId, score: QUIZ.length } }),
  ]);
  return attribuerNiveau(tx, carteId, "zero-gaspi-frigo", niveauFrigo({ joursActions: jours.length, quizParfait: !!parfait }));
}

export async function declarerAntiGaspi(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  const type = form.get("type");
  if (!estActionAntiGaspi(type)) return { erreur: "Choisissez une action." };
  const recetteId = String(form.get("recette") ?? "") || null;
  if (recetteId && !RECETTES.some((r) => r.id === recetteId)) return { erreur: "Recette inconnue." };

  const jour = jourParis();
  const n = await db.actionAntiGaspi.count({ where: { carteId: carte.id, jour } });
  if (n >= ACTIONS_FRIGO_MAX_PAR_JOUR) return { erreur: `${ACTIONS_FRIGO_MAX_PAR_JOUR} actions par jour maximum. À demain !` };

  const gain = await db.$transaction(async (tx) => {
    await tx.actionAntiGaspi.create({ data: { carteId: carte.id, type, recetteId: type === "recette" ? recetteId : null, jour } });
    return majNiveauFrigo(tx, carte.id);
  });
  rafraichir("zero-gaspi-frigo");
  const recette = RECETTES.find((r) => r.id === recetteId);
  return { succes: recette && type === "recette" ? `${recette.emoji} ${recette.titre} : rien de jeté, bravo !` : "Action anti-gaspi enregistrée, bravo !", gain, cle: Date.now() };
}

export type ResultatQuiz = { score: number; total: number; corrections: { id: string; bonne: number; explication: string }[]; gain: Gain | null };

export async function envoyerQuizFrigo(reponses: Record<string, number>): Promise<ResultatQuiz> {
  const carte = await exigerCarte();
  const propres: Record<string, number> = {};
  for (const q of QUIZ) if (Number.isInteger(reponses[q.id])) propres[q.id] = reponses[q.id];
  const score = scorerQuiz(propres);
  const gain = await db.$transaction(async (tx) => {
    await tx.quizFrigo.create({ data: { carteId: carte.id, score, total: QUIZ.length } });
    return majNiveauFrigo(tx, carte.id);
  });
  rafraichir("zero-gaspi-frigo");
  return { score, total: QUIZ.length, corrections: QUIZ.map((q) => ({ id: q.id, bonne: q.bonne, explication: q.explication })), gain };
}
