import "server-only";
import { db } from "./db";
import { gestesDuMois } from "./gestes";
import { classer, niveauImmeuble, objectifAtteint, type ScoreResidence } from "./jeux/immeuble";
import { moisParis, moisPrecedent } from "./temps";

/** Classement des résidences pour un mois. */
export async function classementDuMois(mois: string) {
  const [residences, cartes, gestes] = await Promise.all([
    db.residence.findMany({ select: { id: true, nom: true, _count: { select: { logements: true } } } }),
    db.carte.findMany({ select: { id: true, logement: { select: { residenceId: true } } } }),
    gestesDuMois(mois),
  ]);
  const gestesParResidence = new Map<string, number>();
  for (const c of cartes) {
    const n = gestes.get(c.id) ?? 0;
    gestesParResidence.set(c.logement.residenceId, (gestesParResidence.get(c.logement.residenceId) ?? 0) + n);
  }
  const scores: ScoreResidence[] = residences.map((r) => ({
    residenceId: r.id,
    nom: r.nom,
    logements: r._count.logements,
    gestes: gestesParResidence.get(r.id) ?? 0,
  }));
  return { classement: classer(scores), gestes };
}

/** Tout ce qu'il faut pour afficher le Défi Immeuble d'un foyer et calculer sa médaille. */
export async function etatDefiImmeuble(carteId: string, residenceId: string) {
  const mois = moisParis();
  const precedent = moisPrecedent(mois);
  const [courant, avant, inscription] = await Promise.all([
    classementDuMois(mois),
    classementDuMois(precedent),
    db.membreDefiImmeuble.findUnique({ where: { carteId_mois: { carteId, mois } } }),
  ]);

  const maResidence = courant.classement.find((r) => r.residenceId === residenceId)!;
  const maResidenceAvant = avant.classement.find((r) => r.residenceId === residenceId);
  // L'or n'est accordé que pour un mois réellement joué (au moins un geste dans la résidence).
  const premiereMoisPrecedent = !!maResidenceAvant && maResidenceAvant.rang === 1 && maResidenceAvant.gestes > 0;

  const mesGestes = courant.gestes.get(carteId) ?? 0;
  const niveau = niveauImmeuble({
    inscrit: !!inscription,
    mesGestes,
    objectifAtteint: objectifAtteint(maResidence),
    premiereMoisPrecedent,
    mesGestesMoisPrecedent: avant.gestes.get(carteId) ?? 0,
  });

  return { mois, inscrit: !!inscription, mesGestes, maResidence, classement: courant.classement, gestesParCarte: courant.gestes, niveau, maResidenceAvant };
}
