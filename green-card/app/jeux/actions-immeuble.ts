"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigerCarte } from "@/lib/carte-courante";
import { etatDefiImmeuble } from "@/lib/immeuble-serveur";
import { attribuerNiveau, type Gain } from "@/lib/points";
import { moisParis } from "@/lib/temps";

/** Recalcule la médaille du Défi Immeuble (appelé à l'ouverture de la page et après l'inscription). */
export async function actualiserDefiImmeuble(): Promise<{ gain: Gain | null }> {
  const carte = await exigerCarte();
  const etat = await etatDefiImmeuble(carte.id, carte.logement.residenceId);
  const gain = await db.$transaction((tx) => attribuerNiveau(tx, carte.id, "defi-immeuble", etat.niveau));
  if (gain) revalidatePath("/carte");
  return { gain };
}

export async function rejoindreDefiImmeuble(): Promise<{ gain: Gain | null }> {
  const carte = await exigerCarte();
  const mois = moisParis();
  await db.membreDefiImmeuble.upsert({
    where: { carteId_mois: { carteId: carte.id, mois } },
    create: { carteId: carte.id, mois },
    update: {},
  });
  const r = await actualiserDefiImmeuble();
  revalidatePath("/defis/defi-immeuble");
  return r;
}
