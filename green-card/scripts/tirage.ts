/**
 * Grand tirage de la saison — à lancer par les organisateurs CDC Habitat, à la date de clôture,
 * idéalement devant témoin ou huissier (voir le règlement) :
 *
 *   npm run tirage -- saison-2026-2027
 *
 * Chaque foyer inscrit et toujours Gold a exactement la même chance. Le hasard vient de crypto.randomInt.
 * Le résultat est enregistré une seule fois (pas de nouveau tirage possible sur le même identifiant).
 */
import { randomInt } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { choisirGagnant } from "../lib/cadeaux";
import { DEFIS } from "../lib/defis";

const db = new PrismaClient();

async function main() {
  const id = process.argv[2];
  const force = process.argv.includes("--avant-cloture"); // pour les tests uniquement
  if (!id) throw new Error("Indiquez l'identifiant du tirage, par exemple : npm run tirage -- saison-2026-2027");

  const tirage = await db.tirage.findUnique({ where: { id }, include: { cadeau: true } });
  if (!tirage) throw new Error(`Tirage « ${id} » introuvable.`);
  if (tirage.effectueLe) throw new Error(`Ce tirage a déjà eu lieu le ${tirage.effectueLe.toLocaleString("fr-FR")}.`);
  if (!force && new Date() < tirage.clotureLe) throw new Error(`Les inscriptions ferment le ${tirage.clotureLe.toLocaleString("fr-FR")}.`);

  const inscrits = await db.participationTirage.findMany({
    where: { tirageId: id },
    include: { carte: { include: { progressions: true, logement: { include: { residence: true } } } } },
    orderBy: { createdAt: "asc" },
  });
  // On revérifie l'éligibilité au moment du tirage.
  const eligibles = inscrits.filter((p) => p.carte.progressions.filter((x) => x.niveau >= 1).length >= DEFIS.length);
  const gagnant = choisirGagnant(eligibles, () => randomInt(0, 2 ** 31) / 2 ** 31);
  if (!gagnant) throw new Error("Aucun foyer éligible inscrit.");

  await db.tirage.update({ where: { id }, data: { gagnantId: gagnant.carteId, effectueLe: new Date() } });
  console.log(`${tirage.libelle} — ${tirage.cadeau.nom}`);
  console.log(`${eligibles.length} foyer(s) éligible(s) sur ${inscrits.length} inscrit(s).`);
  console.log(`Gagnant : ${gagnant.carte.pseudo} — ${gagnant.carte.logement.residence.nom}, UG ${gagnant.carte.logement.ug}`);
  console.log("À contacter par l'agence pour organiser le séjour.");
}

main()
  .catch((e) => {
    console.error(`✗ ${e.message}`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
