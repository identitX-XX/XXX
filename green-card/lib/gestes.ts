import "server-only";
import { db } from "./db";
import { bornesMois, jourParis } from "./temps";

/**
 * Les « gestes » d'un mois (AAAA-MM, heure de Paris) : chaque action concrète enregistrée dans les jeux.
 * Les quiz (Tri Master, Chasse au Gaspi, quiz du frigo) n'en sont pas : ce sont des apprentissages, pas des gestes.
 *
 * Renvoie le nombre de gestes par carte. (À grande échelle, à remplacer par des requêtes SQL agrégées.)
 */
export async function gestesDuMois(mois: string, carteIds?: string[]): Promise<Map<string, number>> {
  const { debut, fin } = bornesMois(mois);
  const parCarte = carteIds ? { carteId: { in: carteIds } } : {};
  const jourDuMois = { startsWith: mois };

  const [trajets, antiGaspi, checkIns, douches, releves, circulaires, astuces] = await Promise.all([
    db.trajet.groupBy({ by: ["carteId"], where: { ...parCarte, jour: jourDuMois }, _count: true }),
    db.actionAntiGaspi.groupBy({ by: ["carteId"], where: { ...parCarte, jour: jourDuMois }, _count: true }),
    db.checkIn19.groupBy({ by: ["carteId"], where: { ...parCarte, jour: jourDuMois, tenue: true }, _count: true }),
    db.douche.groupBy({ by: ["carteId"], where: { ...parCarte, jour: jourDuMois, reussie: true }, _count: true }),
    db.releve.findMany({ where: { ...parCarte, date: { gte: debut, lt: fin } }, select: { carteId: true, date: true } }),
    db.actionCirculaire.findMany({ where: { ...parCarte, createdAt: { gte: debut, lt: fin } }, select: { carteId: true, createdAt: true } }),
    db.astuce.findMany({ where: { ...parCarte, createdAt: { gte: debut, lt: fin } }, select: { carteId: true, createdAt: true } }),
  ]);

  const total = new Map<string, number>();
  const ajouter = (carteId: string, n = 1) => total.set(carteId, (total.get(carteId) ?? 0) + n);
  for (const g of [...trajets, ...antiGaspi, ...checkIns, ...douches]) ajouter(g.carteId, g._count);
  for (const r of releves) if (jourParis(r.date).startsWith(mois)) ajouter(r.carteId);
  for (const a of circulaires) if (jourParis(a.createdAt).startsWith(mois)) ajouter(a.carteId);
  for (const a of astuces) if (jourParis(a.createdAt).startsWith(mois)) ajouter(a.carteId);
  return total;
}
