import "server-only";
import type { Prisma } from "@prisma/client";
import { MEDAILLES } from "./carte";
import { defiParId, pointsPourNiveau } from "./defis";

export interface Gain {
  defiId: string;
  niveau: number;
  medaille: string;
  points: number;
}

/**
 * Enregistre la médaille atteinte sur un défi. Ne fait que monter (jamais de perte),
 * et crédite seulement la différence de points avec la médaille déjà obtenue :
 * rejouer ne rapporte rien de plus, ce qui évite le « farming » de points.
 */
export async function attribuerNiveau(
  tx: Prisma.TransactionClient,
  carteId: string,
  defiId: string,
  niveauAtteint: number,
): Promise<Gain | null> {
  const defi = defiParId(defiId);
  if (!defi || niveauAtteint < 1) return null;

  const actuel = await tx.progression.findUnique({ where: { carteId_defiId: { carteId, defiId } } });
  const niveauActuel = actuel?.niveau ?? 0;
  if (niveauAtteint <= niveauActuel) return null;

  await tx.progression.upsert({
    where: { carteId_defiId: { carteId, defiId } },
    create: { carteId, defiId, niveau: niveauAtteint },
    update: { niveau: niveauAtteint },
  });

  const points = pointsPourNiveau(defi, niveauAtteint) - pointsPourNiveau(defi, niveauActuel);
  const medaille = MEDAILLES[niveauAtteint];
  await tx.mouvementPoints.create({
    data: { carteId, defiId, points, motif: `${defi.titre} : médaille ${medaille}` },
  });

  return { defiId, niveau: niveauAtteint, medaille, points };
}
