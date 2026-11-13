"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { exigerCarte } from "@/lib/carte-courante";
import { soldeGreenPoints } from "@/lib/cadeaux-serveur";
import { genererCodeRetrait, verifierCommande, verifierParticipation } from "@/lib/cadeaux";
import { DEFIS } from "@/lib/defis";
import { randomInt } from "node:crypto";

const aleaSur = () => randomInt(0, 1_000_000) / 1_000_000;

export type ResultatCommande = { erreur?: string; code?: string };

export async function commanderCadeau(cadeauId: string, taille: string | null): Promise<ResultatCommande> {
  const carte = await exigerCarte();
  try {
    const code = await db.$transaction(
      async (tx) => {
        const cadeau = await tx.cadeau.findUnique({ where: { id: cadeauId } });
        if (!cadeau) throw new ErreurMetier("Cadeau introuvable.");
        const [{ disponible }, deja] = await Promise.all([
          soldeGreenPoints(carte.id, tx),
          tx.commande.findFirst({ where: { carteId: carte.id, cadeauId, statut: { not: "annulee" } } }),
        ]);
        const tailles: string[] | null = cadeau.tailles ? JSON.parse(cadeau.tailles) : null;
        const erreur = verifierCommande({
          type: cadeau.type as "boutique" | "grand-prix",
          actif: cadeau.actif,
          prix: cadeau.prix,
          stock: cadeau.stock,
          solde: disponible,
          dejaCommande: !!deja,
          tailles,
          taille,
        });
        if (erreur) throw new ErreurMetier(erreur);

        // Décrément conditionnel : deux commandes simultanées ne peuvent pas passer sous zéro.
        if (cadeau.stock !== null) {
          const { count } = await tx.cadeau.updateMany({ where: { id: cadeauId, stock: { gt: 0 } }, data: { stock: { decrement: 1 } } });
          if (!count) throw new ErreurMetier("Victime de son succès : ce cadeau est épuisé pour le moment.");
        }
        const code = genererCodeRetrait(aleaSur);
        await tx.commande.create({ data: { carteId: carte.id, cadeauId, taille: tailles ? taille : null, points: cadeau.prix!, code } });
        return code;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    revalidatePath("/cadeaux");
    return { code };
  } catch (e) {
    if (e instanceof ErreurMetier) return { erreur: e.message };
    throw e;
  }
}

/** Annuler une commande pas encore préparée : les points et l'exemplaire reviennent. */
export async function annulerCommande(commandeId: string): Promise<{ erreur?: string }> {
  const carte = await exigerCarte();
  const ok = await db.$transaction(async (tx) => {
    const { count } = await tx.commande.updateMany({ where: { id: commandeId, carteId: carte.id, statut: "a-preparer" }, data: { statut: "annulee" } });
    if (!count) return false;
    const c = await tx.commande.findUnique({ where: { id: commandeId }, include: { cadeau: true } });
    if (c?.cadeau.stock !== null) await tx.cadeau.update({ where: { id: c!.cadeauId }, data: { stock: { increment: 1 } } });
    return true;
  });
  revalidatePath("/cadeaux");
  return ok ? {} : { erreur: "Cette commande est déjà en préparation : elle ne peut plus être annulée ici. Voyez avec votre gardien." };
}

export async function participerTirage(tirageId: string): Promise<{ erreur?: string }> {
  const carte = await exigerCarte();
  const tirage = await db.tirage.findUnique({ where: { id: tirageId } });
  if (!tirage) return { erreur: "Tirage introuvable." };
  const cases = await db.progression.count({ where: { carteId: carte.id, niveau: { gte: 1 } } });
  const erreur = verifierParticipation({
    gold: cases >= DEFIS.length,
    cloture: tirage.clotureLe,
    maintenant: new Date(),
    effectue: !!tirage.effectueLe,
  });
  if (erreur) return { erreur };
  await db.participationTirage.upsert({
    where: { tirageId_carteId: { tirageId, carteId: carte.id } },
    create: { tirageId, carteId: carte.id },
    update: {},
  });
  revalidatePath("/cadeaux");
  return {};
}

class ErreurMetier extends Error {}
