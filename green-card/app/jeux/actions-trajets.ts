"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { exigerCarte } from "@/lib/carte-courante";
import { attribuerNiveau } from "@/lib/points";
import { jourParis, veille } from "@/lib/temps";
import { co2Evite, estMode, estMotif, infoMode, niveauTrajets, verifierTrajet } from "@/lib/jeux/trajets";
import type { EtatJeu } from "./actions";

async function majNiveauTrajets(tx: Prisma.TransactionClient, carteId: string) {
  const jours = await tx.trajet.groupBy({ by: ["jour"], where: { carteId } });
  return attribuerNiveau(tx, carteId, "trajets-verts", niveauTrajets(jours.length));
}

const nombre = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n).replace(/[  ]/g, " ");

export async function declarerTrajet(_: EtatJeu, form: FormData): Promise<EtatJeu> {
  const carte = await exigerCarte();
  const mode = form.get("mode");
  const motif = form.get("motif");
  if (!estMode(mode)) return { erreur: "Choisissez comment vous vous êtes déplacé." };
  if (!estMotif(motif)) return { erreur: "Choisissez le motif du trajet." };
  const saisie = String(form.get("km") ?? "").replace(/\s/g, "").replace(",", ".");
  const km = saisie === "" ? NaN : Number(saisie);

  // Le jour est fixé par le serveur : aujourd'hui ou hier seulement.
  const aujourdhui = jourParis();
  const jour = form.get("quand") === "hier" ? veille(aujourdhui) : aujourdhui;

  const dejaCeJour = await db.trajet.count({ where: { carteId: carte.id, jour } });
  const erreur = verifierTrajet(mode, km, dejaCeJour);
  if (erreur) return { erreur };

  const co2 = co2Evite(mode, km);
  const gain = await db.$transaction(async (tx) => {
    await tx.trajet.create({ data: { carteId: carte.id, mode, km, motif: String(motif), jour, co2Evite: co2 } });
    return majNiveauTrajets(tx, carte.id);
  });

  revalidatePath("/defis/trajets-verts");
  revalidatePath("/carte");
  const info = infoMode(mode)!;
  return {
    succes: `${info.emoji} ${nombre(km)} km ${info.nom.toLowerCase()} : ${nombre(co2)} kg de CO₂ évité par rapport à la voiture.`,
    gain,
    cle: Date.now(),
  };
}

/** Corriger une erreur de saisie : seulement les trajets d'aujourd'hui ou d'hier. */
export async function supprimerTrajet(id: string): Promise<{ erreur?: string }> {
  const carte = await exigerCarte();
  const aujourdhui = jourParis();
  const { count } = await db.trajet.deleteMany({
    where: { id, carteId: carte.id, jour: { in: [aujourdhui, veille(aujourdhui)] } },
  });
  if (!count) return { erreur: "Ce trajet ne peut plus être modifié." };
  revalidatePath("/defis/trajets-verts");
  return {};
}
