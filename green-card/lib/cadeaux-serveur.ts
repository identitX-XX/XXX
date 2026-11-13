import "server-only";
import type { Prisma, PrismaClient } from "@prisma/client";
import { db } from "./db";

type Client = PrismaClient | Prisma.TransactionClient;

/** Points gagnés (tous les mouvements) et dépensés (commandes non annulées). */
export async function soldeGreenPoints(carteId: string, client: Client = db) {
  const [gagnes, depenses] = await Promise.all([
    client.mouvementPoints.aggregate({ where: { carteId }, _sum: { points: true } }),
    client.commande.aggregate({ where: { carteId, statut: { not: "annulee" } }, _sum: { points: true } }),
  ]);
  const g = gagnes._sum.points ?? 0;
  const d = depenses._sum.points ?? 0;
  return { gagnes: g, depenses: d, disponible: g - d };
}
