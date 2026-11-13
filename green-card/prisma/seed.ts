/**
 * Données de démonstration : 3 résidences fictives, 30 logements, 30 codes d'activation.
 * Les codes sont écrits dans prisma/codes-demo.csv (fichier ignoré par git).
 * Une carte de démo est déjà activée : voir README.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { DEFIS, pointsPourNiveau } from "../lib/defis";
import { MEDAILLES } from "../lib/carte";
import { co2Evite } from "../lib/jeux/trajets";
import { co2Action } from "../lib/jeux/circulaire";
import { jourParis, moisParis, moisPrecedent } from "../lib/temps";
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

const VOISINS = [
  { ug: "TIL-A-103", pseudo: "Mme Diallo", pin: "135790" },
  { ug: "TIL-A-104", pseudo: "Les Nguyen", pin: "135790" },
  { ug: "TIL-B-101", pseudo: "Famille Rossi", pin: "135790" },
  { ug: "TIL-B-102", pseudo: "Karim B.", pin: "135790" },
  { ug: "TIL-B-103", pseudo: "Les Lefèvre", pin: "135790" },
];

const ASTUCES_DEMO = [
  {
    ug: "TIL-A-102", univers: "cuisine", titre: "Le couvercle sur la casserole",
    texte: "Faire bouillir l'eau avec un couvercle, c'est jusqu'à 4 fois moins d'énergie. Et on coupe la plaque 2 minutes avant la fin : la chaleur suffit.",
    votes: ["TIL-A-103", "TIL-A-104", "TIL-B-101", "TIL-B-102"],
  },
  {
    ug: "TIL-A-103", univers: "energie", titre: "Dégivrer le congélateur",
    texte: "Au-delà de 3 mm de givre, le congélateur consomme jusqu'à 30 % de plus. Je le dégivre à chaque changement de saison.",
    votes: ["TIL-A-102", "TIL-B-101", "TIL-B-103"],
  },
  {
    ug: "TIL-A-104", univers: "dechets", titre: "Mes bocaux pour le vrac",
    texte: "Je garde les bocaux de confiture et de cornichons pour acheter en vrac au marché du samedi. Zéro emballage, et c'est moins cher.",
    votes: ["TIL-A-102", "TIL-B-102"],
  },
  {
    ug: "TIL-B-101", univers: "seconde-main", titre: "Vêtements de bébé en seconde main",
    texte: "Les bébés grandissent trop vite ! On trouve des lots presque neufs pour quelques euros dans les vide-greniers et les ressourceries.",
    votes: ["TIL-A-103"],
  },
  {
    ug: "TIL-B-102", univers: "mobilite", titre: "Le vélo pour aller au marché",
    texte: "Avec deux sacoches, je fais toutes mes courses de la semaine à vélo. 15 minutes, pas de bouchons, et du sport en prime.",
    votes: [],
  },
  {
    ug: "TIL-B-103", univers: "energie", titre: "Couper la box internet la nuit",
    texte: "Une multiprise à interrupteur pour la box et la télé : on éteint tout en allant se coucher. Environ 30 euros d'économie par an.",
    votes: ["TIL-A-104", "TIL-B-101"],
  },
];

async function main() {
  const alea = mulberry32(2026);

  await db.membreDefiImmeuble.deleteMany();
  await db.quizFrigo.deleteMany();
  await db.actionAntiGaspi.deleteMany();
  await db.checkIn19.deleteMany();
  await db.engagement19.deleteMany();
  await db.douche.deleteMany();
  await db.partieGaspi.deleteMany();
  await db.interetAnnonce.deleteMany();
  await db.annonce.deleteMany();
  await db.actionCirculaire.deleteMany();
  await db.trajet.deleteMany();
  await db.signalementAstuce.deleteMany();
  await db.voteAstuce.deleteMany();
  await db.astuce.deleteMany();
  await db.partieTri.deleteMany();
  await db.releve.deleteMany();
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

  const logements = new Map<string, { id: string; residenceId: string }>();
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

      logements.set(ug, { id: logement.id, residenceId: residence.id });
    }
  }

  // --- Cartes de démo de la résidence Les Tilleuls -------------------------------
  const cartes = new Map<string, string>();
  for (const v of [{ ug: CARTE_DEMO.ug, pseudo: CARTE_DEMO.pseudo, pin: CARTE_DEMO.pin }, ...VOISINS]) {
    const l = logements.get(v.ug)!;
    await db.codeActivation.update({ where: { logementId: l.id }, data: { utiliseLe: new Date() } });
    const carte = await db.carte.create({
      data: {
        logementId: l.id,
        pseudo: v.pseudo,
        pinHash: hacherPin(v.pin),
        consentCGU: new Date(),
        consentConsommation: new Date(),
        mouvements: { create: { points: 20, motif: "Bienvenue dans Green Card" } },
      },
    });
    cartes.set(v.ug, carte.id);
  }

  async function medaille(ug: string, defiId: string, niveau: number) {
    const carteId = cartes.get(ug)!;
    const d = DEFIS.find((x) => x.id === defiId)!;
    await db.progression.create({ data: { carteId, defiId, niveau } });
    await db.mouvementPoints.create({ data: { carteId, defiId, points: pointsPourNiveau(d, niveau), motif: `${d.titre} : médaille ${MEDAILLES[niveau]}` } });
  }

  // Foyer Martin : Compteur Malin en argent (2 relevés à 7 jours d'écart), Tri Master en bronze.
  const martin = cartes.get(CARTE_DEMO.ug)!;
  const ilYa = (jours: number) => new Date(Date.now() - jours * 86_400_000);
  await db.releve.createMany({
    data: [
      { carteId: martin, type: "elec", index: 12000, date: ilYa(14) },
      { carteId: martin, type: "elec", index: 12056, date: ilYa(7) },
      { carteId: martin, type: "eau", index: 312.4, date: ilYa(14) },
      { carteId: martin, type: "eau", index: 315.2, date: ilYa(7) },
    ],
  });
  await medaille(CARTE_DEMO.ug, "compteur-malin", 2);
  await medaille(CARTE_DEMO.ug, "tri-master", 1);

  // Astuces de la résidence et votes entre voisins.
  const tilleuls = logements.get(CARTE_DEMO.ug)!.residenceId;
  for (const [i, a] of ASTUCES_DEMO.entries()) {
    const astuce = await db.astuce.create({
      data: {
        carteId: cartes.get(a.ug)!,
        residenceId: tilleuls,
        univers: a.univers,
        titre: a.titre,
        texte: a.texte,
        createdAt: ilYa(10 - i),
      },
    });
    for (const votant of a.votes) await db.voteAstuce.create({ data: { astuceId: astuce.id, carteId: cartes.get(votant)! } });
    await medaille(a.ug, "boite-a-astuces", 1);
  }

  // Foyer Martin : trajets verts sur 4 jours (bronze), 2 achats d'occasion (bronze).
  const trajetsMartin: [number, "velo" | "transports" | "marche", number, string][] = [
    [5, "velo", 4.2, "travail"],
    [4, "transports", 12, "travail"],
    [3, "marche", 1.5, "courses"],
    [2, "velo", 4.2, "travail"],
  ];
  for (const [jours, mode, km, motif] of trajetsMartin) {
    await db.trajet.create({ data: { carteId: martin, mode, km, motif, jour: jourParis(ilYa(jours)), co2Evite: co2Evite(mode, km), createdAt: ilYa(jours) } });
  }
  await medaille(CARTE_DEMO.ug, "trajets-verts", 1);
  await db.actionCirculaire.createMany({
    data: [
      { carteId: martin, type: "occasion", categorie: "vetements", description: "Manteau d'hiver en friperie", prixPaye: 12, prixNeuf: 60, co2Evite: co2Action("occasion", "vetements"), createdAt: ilYa(9) },
      { carteId: martin, type: "reparation", categorie: "electromenager", description: "Lave-linge réparé au repair café", co2Evite: co2Action("reparation", "electromenager"), createdAt: ilYa(4) },
    ],
  });
  await medaille(CARTE_DEMO.ug, "seconde-vie", 1);

  // Le mur des voisins.
  const annonces: [string, "don" | "troc" | "pret", string, string, string][] = [
    ["TIL-A-103", "don", "culture", "Lot de livres pour enfants", "Une vingtaine d'albums, de 3 à 8 ans. Très bon état."],
    ["TIL-B-102", "pret", "maison", "Perceuse-visseuse", "Je la prête volontiers le week-end, avec les forets."],
    ["TIL-A-104", "troc", "enfants", "Chaise haute contre une trottinette", "Notre petit a grandi ! Chaise haute pliable, propre."],
  ];
  for (const [i, [ug, type, categorie, titre, description]] of annonces.entries()) {
    await db.annonce.create({ data: { carteId: cartes.get(ug)!, residenceId: tilleuls, type, categorie, titre, description, createdAt: ilYa(3 - i) } });
  }

  // Foyer Martin : douches réussies sur 2 jours, 5 journées 19 °C tenues, actions anti-gaspi sur 6 jours (3 bronzes).
  for (const j of [3, 2]) {
    const debutDouche = ilYa(j);
    await db.douche.create({ data: { carteId: martin, debut: debutDouche, fin: new Date(debutDouche.getTime() + 270_000), dureeS: 270, jour: jourParis(debutDouche), reussie: true } });
  }
  await medaille(CARTE_DEMO.ug, "douche-chrono", 1);
  const engagementsMartin = ["thermostat-19", "nuit-17", "volets", "pull"];
  await db.engagement19.create({ data: { carteId: martin, engagements: JSON.stringify(engagementsMartin) } });
  for (const j of [6, 5, 4, 3, 2]) {
    await db.checkIn19.create({ data: { carteId: martin, jour: jourParis(ilYa(j)), faits: JSON.stringify(engagementsMartin.slice(0, 3)), tenue: true } });
  }
  await medaille(CARTE_DEMO.ug, "operation-19", 1);
  const typesAntiGaspi = ["recette", "congele", "liste", "recette", "compost", "partage"];
  for (const [i, j] of [7, 6, 5, 4, 3, 2].entries()) {
    await db.actionAntiGaspi.create({ data: { carteId: martin, type: typesAntiGaspi[i], recetteId: typesAntiGaspi[i] === "recette" ? "soupe" : null, jour: jourParis(ilYa(j)), createdAt: ilYa(j) } });
  }
  await medaille(CARTE_DEMO.ug, "zero-gaspi-frigo", 1);

  // Défi Immeuble : le mois dernier, la résidence Les Tilleuls a été la plus active, Foyer Martin en tête
  // (5 relevés de gaz ; un compteur à part pour ne pas changer le niveau du Compteur Malin).
  const [annee, moisNum] = moisPrecedent(moisParis()).split("-").map(Number);
  for (const [i, jourDuMois] of [3, 10, 17, 24, 28].entries()) {
    await db.releve.create({ data: { carteId: martin, type: "gaz", index: 4210 + i * 14, date: new Date(Date.UTC(annee, moisNum - 1, jourDuMois, 11)) } });
  }
  for (const ug of ["TIL-A-103", "TIL-B-101"]) {
    await db.membreDefiImmeuble.create({ data: { carteId: cartes.get(ug)!, mois: moisParis() } });
  }
  await db.membreDefiImmeuble.create({ data: { carteId: martin, mois: moisPrecedent(moisParis()) } });

  const fichier = join(__dirname, "codes-demo.csv");
  writeFileSync(fichier, lignes.join("\n") + "\n");
  console.log(`✔ ${RESIDENCES.length} résidences, ${lignes.length - 1} logements, ${DEFIS.length} défis`);
  console.log(`✔ Codes d'activation : ${fichier}`);
  console.log(`✔ Carte de démo déjà activée : UG ${CARTE_DEMO.ug}, PIN ${CARTE_DEMO.pin}`);
  console.log(`✔ ${VOISINS.length} voisins, ${ASTUCES_DEMO.length} astuces et ${annonces.length} annonces à la résidence Les Tilleuls`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
