/**
 * Données de démonstration : 3 résidences fictives, 30 logements, 30 codes d'activation.
 * Les codes sont écrits dans prisma/codes-demo.csv (fichier ignoré par git).
 * Une carte de démo est déjà activée : voir README.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { DEFIS } from "../lib/defis";
import { genererCodeActivation, hacherCode, hacherPin, VALIDITE_CODE_JOURS } from "../lib/securite";

const db = new PrismaClient();

// Générateur pseudo-aléatoire déterministe : mêmes codes à chaque seed de démo.
function mulberry32(graine: number) {
  return () => {
    graine |= 0;
    graine = (graine + 0x6d2b79f5) | 0;
    let t = Math.imul(graine ^ (graine >>> 15), 1 | graine);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RESIDENCES = [
  { prefixe: "TIL", nom: "Résidence Les Tilleuls", adresse: "12 rue des Tilleuls", codePostal: "93200", ville: "Saint-Denis" },
  { prefixe: "VIG", nom: "Le Clos des Vignes", adresse: "4 allée des Vignes", codePostal: "69100", ville: "Villeurbanne" },
  { prefixe: "BEL", nom: "Résidence Bel Air", adresse: "27 avenue Bel Air", codePostal: "13014", ville: "Marseille" },
];

export const CARTE_DEMO = { ug: "TIL-A-102", pin: "246810", pseudo: "Foyer Martin" };

async function main() {
  const alea = mulberry32(2026);

  await db.mouvementPoints.deleteMany();
  await db.progression.deleteMany();
  await db.session.deleteMany();
  await db.carte.deleteMany();
  await db.codeActivation.deleteMany();
  await db.logement.deleteMany();
  await db.residence.deleteMany();
  await db.defi.deleteMany();

  for (const d of DEFIS) await db.defi.create({ data: d });

  const lignes = ["residence;ug;batiment;code_activation"];
  const expireLe = new Date(Date.now() + VALIDITE_CODE_JOURS * 86_400_000);

  for (const r of RESIDENCES) {
    const { prefixe, ...donnees } = r;
    const residence = await db.residence.create({ data: donnees });
    for (let i = 0; i < 10; i++) {
      const batiment = i < 5 ? "A" : "B";
      const ug = `${prefixe}-${batiment}-${101 + (i % 5)}`;
      const code = genererCodeActivation(alea);
      const logement = await db.logement.create({
        data: { ug, batiment, residenceId: residence.id, activation: { create: { codeHash: hacherCode(code), expireLe } } },
      });
      lignes.push(`${r.nom};${ug};${batiment};${code}`);

      if (ug === CARTE_DEMO.ug) {
        await db.codeActivation.update({ where: { logementId: logement.id }, data: { utiliseLe: new Date() } });
        const carte = await db.carte.create({
          data: {
            logementId: logement.id,
            pseudo: CARTE_DEMO.pseudo,
            pinHash: hacherPin(CARTE_DEMO.pin),
            consentCGU: new Date(),
            consentConsommation: new Date(),
          },
        });
        const faits: [string, number][] = [["compteur-malin", 2], ["chasse-au-gaspi", 3], ["douche-chrono", 1], ["tri-master", 1]];
        for (const [defiId, niveau] of faits) {
          await db.progression.create({ data: { carteId: carte.id, defiId, niveau } });
          const d = DEFIS.find((x) => x.id === defiId)!;
          const pts = [0, d.pointsBronze, d.pointsArgent, d.pointsOr][niveau];
          await db.mouvementPoints.create({ data: { carteId: carte.id, defiId, points: pts, motif: `${d.titre} : niveau ${niveau}` } });
        }
        await db.mouvementPoints.create({ data: { carteId: carte.id, points: 20, motif: "Bienvenue dans Green Card" } });
      }
    }
  }

  const fichier = join(__dirname, "codes-demo.csv");
  writeFileSync(fichier, lignes.join("\n") + "\n");
  console.log(`✔ ${RESIDENCES.length} résidences, ${lignes.length - 1} logements, ${DEFIS.length} défis`);
  console.log(`✔ Codes d'activation : ${fichier}`);
  console.log(`✔ Carte de démo déjà activée : UG ${CARTE_DEMO.ug}, PIN ${CARTE_DEMO.pin}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
