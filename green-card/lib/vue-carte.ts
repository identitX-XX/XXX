import "server-only";
import { db } from "./db";
import { DEFIS, type DefiDef } from "./defis";
import { defiDebloque, estGold, niveauCarte, progressionNiveau } from "./carte";

export interface CaseCarte extends DefiDef {
  niveau: number; // 0 non commencé, 1 bronze, 2 argent, 3 or
  debloque: boolean;
}

export interface VueCarte {
  pseudo: string;
  ug: string;
  batiment: string | null;
  residence: string;
  points: number;
  niveau: ReturnType<typeof niveauCarte>;
  progression: ReturnType<typeof progressionNiveau>;
  cases: CaseCarte[];
  casesValidees: number;
  gold: boolean;
}

export async function chargerVueCarte(carteId: string): Promise<VueCarte | null> {
  const carte = await db.carte.findUnique({
    where: { id: carteId },
    include: { logement: { include: { residence: true } }, progressions: true },
  });
  if (!carte) return null;

  const somme = await db.mouvementPoints.aggregate({ where: { carteId }, _sum: { points: true } });
  const points = somme._sum.points ?? 0;

  const niveaux = new Map(carte.progressions.map((p) => [p.defiId, p.niveau]));
  const casesValidees = DEFIS.filter((d) => (niveaux.get(d.id) ?? 0) >= 1).length;
  const cases = DEFIS.map((d) => ({
    ...d,
    niveau: niveaux.get(d.id) ?? 0,
    debloque: defiDebloque(d.ordre, casesValidees),
  }));

  return {
    pseudo: carte.pseudo,
    ug: carte.logement.ug,
    batiment: carte.logement.batiment,
    residence: carte.logement.residence.nom,
    points,
    niveau: niveauCarte(points),
    progression: progressionNiveau(points),
    cases,
    casesValidees,
    gold: estGold(cases.map((c) => c.niveau)),
  };
}
