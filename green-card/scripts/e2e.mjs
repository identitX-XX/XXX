/**
 * Test de bout en bout (Playwright, sans framework de test) : parcours d'entrée et jeux 1, 6 et 9.
 * Prérequis : `npm run db:reset && npm run build`, puis : `npm run e2e`
 * Les captures d'écran sont écrites dans ./captures.
 */
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import tri from "../lib/jeux/tri.ts";
const { BACS, DECHETS } = tri;
import gaspiMod from "../lib/jeux/gaspi.ts";
import frigoMod from "../lib/jeux/frigo.ts";
import prismaPkg from "@prisma/client";
const { OBJETS } = gaspiMod;
const { QUIZ } = frigoMod;
const prisma = new prismaPkg.PrismaClient();

/** Recule le début de la douche en cours (pour ne pas attendre 4 minutes pendant le test). */
async function reculerDouche(ug, secondes) {
  const l = await prisma.logement.findUnique({ where: { ug }, include: { carte: true } });
  const { count } = await prisma.douche.updateMany({ where: { carteId: l.carte.id, fin: null }, data: { debut: new Date(Date.now() - secondes * 1000) } });
  assert.equal(count, 1, "une douche en cours");
}

const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");

const PORT = 3123;
const BASE = `http://localhost:${PORT}`;
const CAPTURES = new URL("../captures/", import.meta.url).pathname;
mkdirSync(CAPTURES, { recursive: true });

const codes = Object.fromEntries(
  readFileSync(new URL("../prisma/codes-demo.csv", import.meta.url), "utf8")
    .trim()
    .split("\n")
    .slice(1)
    .map((l) => l.split(";"))
    .map(([, ug, , code]) => [ug, code]),
);

const serveur = spawn("node_modules/.bin/next", ["start", "-p", String(PORT)], { stdio: "pipe", detached: true });
const pret = new Promise((ok, ko) => {
  serveur.stdout.on("data", (d) => String(d).includes("Ready") && ok());
  serveur.on("exit", (c) => ko(new Error(`le serveur s'est arrêté (code ${c})`)));
});

let etape = 0;
const ok = (msg) => console.log(`  ✓ ${++etape}. ${msg}`);

try {
  await pret;
  const navigateur = await chromium.launch();
  const ctx = await navigateur.newContext({ ...devices["iPhone 13"], locale: "fr-FR" });
  const page = await ctx.newPage();
  globalThis.__page = page;
  const capture = (nom) => page.screenshot({ path: `${CAPTURES}${nom}.png` });

  // 1. Accueil
  await page.goto(BASE);
  await page.getByRole("link", { name: "Activer ma Green Card" }).waitFor();
  await page.waitForTimeout(800);
  await capture("1-accueil");
  ok("écran d'accueil");

  // 2. Activation : mauvais code → message + compteur d'essais
  await page.getByRole("link", { name: "Activer ma Green Card" }).click();
  await page.getByPlaceholder("Nom, ville ou code postal").fill("saint denis");
  await page.getByText("Résidence Les Tilleuls").click();
  await page.getByLabel("Votre n° d'UG (logement)").fill("til a 101");
  await page.getByLabel("Code d'activation").fill("AAAA-AAAA");
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByRole("alert").getByText("4 essais restants").waitFor();
  await capture("2-activation-erreur");
  ok("mauvais code refusé, essais restants affichés");

  // 3. Bon code → étape 2
  await page.getByLabel("Code d'activation").fill(codes["TIL-A-101"].toLowerCase());
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.waitForURL("**/activer/carte");
  await page.getByText("Logement vérifié").waitFor();
  ok("bon code accepté (saisie en minuscules)");

  // 4. PIN trop simple refusé, puis création de la carte
  await page.getByLabel("Le nom de votre carte").fill("Les Dupont");
  await page.getByLabel("Code PIN", { exact: true }).fill("111111");
  await page.getByLabel("Confirmez").fill("111111");
  await page.locator('input[name=cgu]').check();
  await page.getByRole("button", { name: "Activer ma Green Card" }).click();
  await page.getByRole("alert").getByText("suite trop simple").waitFor();
  ok("PIN trop simple refusé");

  await page.getByLabel("Code PIN", { exact: true }).fill("482913");
  await page.getByLabel("Confirmez").fill("482913");
  await capture("3-creation-carte");
  await page.getByRole("button", { name: "Activer ma Green Card" }).click();
  await page.waitForURL("**/carte?bienvenue=1");
  await page.getByText("Votre Green Card est activée").waitFor();
  assert.ok(await page.getByText("20 GreenPoints").first().isVisible());
  await page.waitForTimeout(1800);
  await capture("4-carte-bienvenue");
  ok("carte activée avec 20 GreenPoints de bienvenue");

  // 5. Déconnexion, puis réactivation impossible
  await page.getByRole("link", { name: "Mon profil" }).click();
  await page.getByRole("button", { name: "Me déconnecter" }).click();
  await page.waitForURL(BASE + "/");
  await page.goto(BASE + "/carte");
  await page.waitForURL("**/connexion");
  ok("déconnexion, /carte protégée");

  await page.goto(BASE + "/activer");
  await page.getByText("Résidence Les Tilleuls").click();
  await page.getByLabel("Votre n° d'UG (logement)").fill("TIL-A-101");
  await page.getByLabel("Code d'activation").fill(codes["TIL-A-101"]);
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByRole("alert").getByText("déjà activée").waitFor();
  ok("un code ne sert qu'une fois");

  // 6. Connexion : mauvaise résidence refusée, puis carte de démo
  await page.goto(BASE + "/connexion");
  await page.getByText("Le Clos des Vignes").click();
  await page.getByLabel("Votre n° d'UG").fill("TIL-A-102");
  await page.getByLabel("Code PIN").fill("246810");
  await page.getByRole("button", { name: "Me connecter" }).click();
  await page.getByRole("alert").getByText("incorrect").waitFor();
  ok("UG d'une autre résidence refusé");

  await page.getByText("Résidence Les Tilleuls").click();
  await capture("5-connexion");
  await page.getByRole("button", { name: "Me connecter" }).click();
  await page.waitForURL("**/carte");
  await page.getByText("Foyer Martin").waitFor();
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.scrollY), 0, "la carte doit s'afficher en haut de page");
  await capture("6-carte-demo");
  ok("connexion de la carte de démo");

  // 7. Profil + export RGPD
  await page.getByRole("link", { name: "Mon profil" }).click();
  await capture("7-profil");
  const reponse = await page.request.get(BASE + "/api/mes-donnees");
  const donnees = await reponse.json();
  assert.equal(donnees.logement.ug, "TIL-A-102");
  assert.ok(donnees.greenPoints.length >= 3);
  ok("export RGPD de mes données");

  // =========================================================================
  // Étape 2 : les jeux (carte « Les Dupont », activée plus haut)
  // =========================================================================
  const points = async () => Number((await page.locator("section[aria-label^='Green Card'] p.text-\\[2rem\\]").textContent()).replace(/\D/g, ""));
  const choisir = (texte) => page.locator("label:visible", { hasText: texte }).first().click();
  const seConnecter = async (residence, ug, pin) => {
    await page.goto(BASE + "/connexion");
    await page.getByText(residence).click();
    await page.getByLabel("Votre n° d'UG").fill(ug);
    await page.getByLabel("Code PIN").fill(pin);
    await page.getByRole("button", { name: "Me connecter" }).click();
    await page.waitForURL("**/carte");
  };
  const seDeconnecter = async () => {
    await page.goto(BASE + "/profil");
    await page.getByRole("button", { name: "Me déconnecter" }).click();
    await page.waitForURL(BASE + "/");
  };

  await seDeconnecter();
  await seConnecter("Résidence Les Tilleuls", "TIL-A-101", "482913");
  assert.equal(await points(), 20);
  await page.goto(BASE + "/defis/chasse-au-gaspi");
  await page.waitForURL("**/carte");
  ok("un défi encore verrouillé renvoie vers la carte");
  await page.getByRole("link", { name: "Jouer" }).click();
  await page.waitForURL("**/defis/compteur-malin");
  ok("carte → bouton Jouer → Compteur Malin");

  // --- Jeu 1 : Compteur Malin -------------------------------------------------
  await page.getByRole("button", { name: "J'accepte et je commence" }).click();
  await page.getByLabel(/Index du compteur/).fill("4 521,5");
  await page.getByRole("button", { name: "Enregistrer le relevé" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+50 GreenPoints").isVisible());
  await page.waitForTimeout(900);
  await capture("9-compteur-bronze");
  ok("Compteur Malin : premier relevé → bronze, +50");

  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByLabel(/Index du compteur/).fill("4530");
  await page.getByRole("button", { name: "Enregistrer le relevé" }).click();
  await page.getByRole("alert").getByText("déjà relevé ce compteur aujourd'hui").waitFor();
  ok("Compteur Malin : un seul relevé par jour et par compteur");

  // --- Jeu 6 : Tri Master -----------------------------------------------------
  const bonBac = Object.fromEntries(DECHETS.map((d) => [d.nom, BACS.find((b) => b.id === d.bac).nom]));
  const mauvaisBac = (nom) => BACS.find((b) => b.nom !== bonBac[nom]).nom;
  const zoneJeu = page.locator("section[aria-label='Partie de Tri Master']");

  async function jouerPartie({ erreurs }) {
    await page.getByRole("button", { name: /Lancer la partie|Rejouer/ }).click();
    for (let n = 0; n < 12; n++) {
      const nom = (await zoneJeu.locator("p.text-xl").textContent()).trim();
      const faute = n < erreurs;
      await zoneJeu.getByRole("button", { name: faute ? mauvaisBac(nom) : bonBac[nom], exact: false }).click();
      if (faute) {
        await zoneJeu.getByText("C'était :").waitFor();
        if (n === 0) await capture("10-tri-erreur");
        await zoneJeu.getByRole("button", { name: /Déchet suivant|Voir mon score/ }).click();
      } else {
        await zoneJeu.getByText("Bien trié").waitFor();
      }
      if (n < 11) await page.waitForFunction((ancien) => document.querySelector("section[aria-label='Partie de Tri Master'] p.text-xl")?.textContent?.trim() !== ancien, nom);
    }
    await page.getByText("Partie terminée").waitFor();
  }

  await page.goto(BASE + "/defis/tri-master");
  await jouerPartie({ erreurs: 1 });
  assert.ok(await page.getByText("11/12").isVisible() || (await page.locator("text=11").count()) > 0);
  assert.ok(await page.getByText("+60 GreenPoints").isVisible(), "11/12 → argent, +60");
  ok("Tri Master : 11/12 → argent, +60, avec l'explication de l'erreur");

  await jouerPartie({ erreurs: 0 });
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("Médaille Or").isVisible());
  assert.ok(await page.getByText("+40 GreenPoints").isVisible(), "or après argent : seulement la différence (100 − 60)");
  await page.waitForTimeout(900);
  await capture("11-tri-or");
  ok("Tri Master : sans-faute → or, +40 (seulement la différence)");

  // --- Jeu 9 : Boîte à Astuces ------------------------------------------------
  await page.goto(BASE + "/defis/boite-a-astuces");
  await page.getByRole("button", { name: "Partager une astuce" }).click();
  await page.getByLabel("Titre").fill("Le linge à 30 degrés");
  await page.getByLabel("L'astuce").fill("Visitez www.pub.com pour en savoir plus");
  await page.getByRole("button", { name: "Publier pour mes voisins" }).click();
  await page.getByRole("alert").getByText("liens ne sont pas autorisés").waitFor();
  ok("Boîte à Astuces : les liens sont refusés");

  await page.getByLabel("L'astuce").fill("Laver à 30 degrés au lieu de 60, c'est deux fois moins d'électricité, et le linge est tout aussi propre.");
  await page.getByRole("button", { name: "Publier pour mes voisins" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+20 GreenPoints").isVisible());
  await page.getByRole("button", { name: "Continuer" }).first().click();
  ok("Boîte à Astuces : astuce publiée → bronze, +20");

  for (let v = 1; v <= 5; v++) {
    const avant = await page.getByRole("button", { name: /^Voter pour/ }).count();
    await page.getByRole("button", { name: /^Voter pour/ }).first().click();
    await page.waitForFunction((n) => document.querySelectorAll("button[aria-label^='Voter pour']").length === n - 1, avant);
  }
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+30 GreenPoints").isVisible());
  await page.waitForTimeout(900);
  await capture("12-astuces-argent");
  ok("Boîte à Astuces : 5 votes donnés → argent, +30");

  await page.goto(BASE + "/carte");
  assert.equal(await points(), 20 + 50 + 100 + 50);
  await capture("13-carte-3-cases");
  ok("la carte affiche 3 cases tamponnées et 220 GreenPoints");

  // --- Jeu 5 : Mes Trajets Verts (Les Dupont) ------------------------------------
  await page.goto(BASE + "/defis/trajets-verts");
  await choisir("À pied");
  await page.getByLabel("Distance (km)").fill("80");
  await page.getByRole("button", { name: "Enregistrer le trajet" }).click();
  await page.getByRole("alert").getByText("30 km maximum").waitFor();
  ok("Trajets Verts : distance invraisemblable refusée");

  await choisir("Vélo");
  await page.getByRole("button", { name: "5 km" }).click();
  await choisir("Courses");
  await page.getByRole("button", { name: "Enregistrer le trajet" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+40 GreenPoints").isVisible());
  await page.getByText("1,1 kg de CO₂ évité par rapport à la voiture").waitFor();
  await page.getByRole("button", { name: "Continuer" }).click();
  ok("Trajets Verts : 5 km à vélo → 1,1 kg de CO₂ évité, bronze, +40");

  await choisir("Bus, tram, métro");
  await page.getByLabel("Distance (km)").fill("12");
  await choisir("Hier");
  await page.getByRole("button", { name: "Enregistrer le trajet" }).click();
  await page.getByText("2 jours actifs").waitFor();
  await page.getByText("2 jours d'affilée").waitFor();
  await page.waitForTimeout(400);
  await capture("15-trajets");
  ok("Trajets Verts : trajet d'hier en bus → 2 jours actifs, série de 2 jours");

  // --- Jeu 8 : Seconde Vie (Les Dupont) ---------------------------------------
  await page.goto(BASE + "/defis/seconde-vie");
  await page.getByLabel("Quoi exactement ?").fill("Jean pour mon fils");
  await page.getByLabel("Prix payé (€)").fill("8");
  await page.getByLabel("Prix neuf (€)").fill("35");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+40 GreenPoints").isVisible());
  await page.getByText("27 €").first().waitFor();
  await page.getByRole("button", { name: "Continuer" }).click();
  ok("Seconde Vie : achat d'occasion (8 € au lieu de 35 €) → bronze, +40, 27 € économisés");

  await page.getByRole("tab", { name: /Mur des voisins/ }).click();
  const livres = page.locator("article", { hasText: "Lot de livres pour enfants" });
  await livres.getByRole("button", { name: "Ça m'intéresse" }).click();
  await livres.getByRole("button", { name: "✓ Intéressé·e" }).waitFor();
  ok("Seconde Vie : « Ça m'intéresse » sur l'annonce d'une voisine");

  await page.getByRole("button", { name: "Proposer un objet" }).click();
  await choisir("Jouets et puériculture");
  await page.getByLabel("Titre").fill("Poussette en bon état");
  await page.getByLabel(/Description/).fill("Pliable, avec habillage pluie.");
  await page.getByRole("button", { name: "Publier sur le mur" }).click();
  await page.getByText("Votre annonce est visible").waitFor();
  await page.getByText("Personne pour l'instant").waitFor();
  await capture("16-mur-voisins");
  ok("Seconde Vie : annonce « Poussette » publiée sur le mur");

  // --- Le vote des voisins fait gagner l'or à l'auteur ; relevé en baisse → or -----
  await seDeconnecter();
  await seConnecter("Résidence Les Tilleuls", "TIL-A-102", "246810");
  assert.equal(await points(), 380 + 80, "Foyer Martin : l'or de la Boîte à Astuces grâce au 5ᵉ vote");
  ok("Foyer Martin : 5ᵉ vote reçu → or à la Boîte à Astuces, +80");

  await page.goto(BASE + "/defis/compteur-malin");
  await page.getByLabel(/Index du compteur/).fill("12100");
  await page.getByRole("button", { name: "Enregistrer le relevé" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("Médaille Or").isVisible());
  assert.ok(await page.getByText("+130 GreenPoints").isVisible());
  await page.getByText(/21 % de moins.*économisés par mois/).waitFor();
  await page.getByText("Consommation stable").waitFor(); // gaz : même consommation qu'au départ
  await page.waitForTimeout(900);
  await capture("14-compteur-or");
  ok("Foyer Martin : consommation en baisse → or au Compteur Malin, +130");

  await page.goto(BASE + "/defis/trajets-verts");
  await page.getByText("4 jours actifs").waitFor();
  await page.getByRole("button", { name: "2 km" }).click();
  await page.getByRole("button", { name: "Enregistrer le trajet" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("Médaille Argent").isVisible());
  assert.ok(await page.getByText("+60 GreenPoints").isVisible());
  ok("Foyer Martin : 5ᵉ jour actif → argent aux Trajets Verts, +60");

  await page.goto(BASE + "/defis/seconde-vie");
  await page.getByRole("tab", { name: /Mur des voisins/ }).click();
  const poussette = page.locator("article", { hasText: "Poussette en bon état" });
  await poussette.getByRole("button", { name: "Ça m'intéresse" }).click();
  await poussette.getByRole("button", { name: "✓ Intéressé·e" }).waitFor();
  ok("Foyer Martin : intéressé par la poussette des Dupont");

  // Les Dupont confirment le don : les deux voisins décrochent l'or.
  await seDeconnecter();
  await seConnecter("Résidence Les Tilleuls", "TIL-A-101", "482913");
  await page.goto(BASE + "/defis/seconde-vie");
  await page.getByRole("tab", { name: /Mur des voisins/ }).click();
  await page.getByText("1 voisin intéressé").waitFor();
  await page.getByRole("button", { name: "Donné à Foyer Martin" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("Médaille Or").isVisible());
  assert.ok(await page.getByText("+140 GreenPoints").isVisible());
  await page.getByText("Objets qui ont trouvé preneur").waitFor();
  await page.waitForTimeout(900);
  await capture("17-echange-or");
  ok("Les Dupont : poussette donnée à Foyer Martin → or à Seconde Vie, +140");

  await page.goto(BASE + "/carte");
  assert.equal(await points(), 220 + 40 + 180);
  await page.waitForTimeout(300);
  await capture("18-carte-5-cases");
  ok("Les Dupont : 5 cases tamponnées, 440 GreenPoints");

  // =========================================================================
  // Les 5 derniers défis (Les Dupont, qui ont débloqué toutes les cases)
  // =========================================================================
  const delta = async (action) => {
    await page.goto(BASE + "/carte");
    const avant = await points();
    await action();
    await page.goto(BASE + "/carte");
    return (await points()) - avant;
  };

  // --- Jeu 2 : Chasse au Gaspi ---------------------------------------------
  const gaspis = OBJETS.filter((o) => o.gaspi);
  const pieges = OBJETS.filter((o) => !o.gaspi);
  async function visite(erreurs) {
    await page.getByRole("button", { name: /Entrer dans l'appartement|Rejouer/ }).click();
    for (const o of pieges.slice(0, erreurs)) {
      await page.getByRole("button", { name: o.description, exact: true }).click();
      await page.getByText("Raté, c'est un bon geste").waitFor();
    }
    for (const o of gaspis) {
      await page.getByRole("button", { name: o.description, exact: true }).click();
      await page.getByRole("button", { name: `${o.description} : gaspillage trouvé` }).or(page.getByText("Visite terminée")).first().waitFor();
    }
    await page.getByText("Visite terminée").waitFor();
  }
  await page.goto(BASE + "/defis/chasse-au-gaspi");
  await visite(3);
  assert.ok(await page.getByText("+60 GreenPoints").isVisible(), "10/10 avec 3 erreurs → argent");
  ok("Chasse au Gaspi : 10/10 avec 3 erreurs → argent, +60");
  await visite(0);
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("Médaille Or").isVisible());
  assert.ok(await page.getByText("+40 GreenPoints").isVisible());
  await page.waitForTimeout(900);
  await capture("19-gaspi-or");
  ok("Chasse au Gaspi : sans-faute rapide → or, +40");

  // --- Jeu 3 : Douche Chrono -------------------------------------------------
  await page.goto(BASE + "/defis/douche-chrono");
  await page.getByRole("button", { name: "Je commence ma douche" }).click();
  await page.getByRole("button", { name: "J'ai fini" }).waitFor();
  await page.waitForTimeout(1200);
  await capture("20-douche-en-cours");
  await reculerDouche("TIL-A-101", 240);
  await page.getByRole("button", { name: "J'ai fini" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+40 GreenPoints").isVisible());
  await page.getByText("Environ 72 litres").waitFor();
  ok("Douche Chrono : 4 minutes mesurées par le serveur → bronze, +40, 72 litres économisés");

  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByRole("button", { name: "Je commence ma douche" }).click();
  await page.getByRole("button", { name: "J'ai fini" }).click();
  await page.getByText("Moins d'une minute").waitFor();
  ok("Douche Chrono : un minuteur arrêté trop vite n'est pas compté");

  // --- Jeu 4 : Opération 19 °C -----------------------------------------------
  await page.goto(BASE + "/defis/operation-19");
  await choisir("19 °C dans les pièces de vie");
  await choisir("Volets et rideaux fermés le soir");
  await page.getByRole("button", { name: "Je m'engage" }).click();
  await page.getByRole("alert").getByText("au moins 3").waitFor();
  await choisir("Un pull plutôt qu'un degré de plus");
  await page.getByRole("button", { name: "Je m'engage" }).click();
  await page.getByRole("button", { name: "Valider ma journée" }).waitFor();
  ok("Opération 19 °C : au moins 3 engagements demandés, puis enregistrés");

  await choisir("19 °C dans les pièces de vie");
  await choisir("Un pull plutôt qu'un degré de plus");
  await page.getByRole("button", { name: "Valider ma journée" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+40 GreenPoints").isVisible());
  await page.getByText("1 journée tenue").waitFor();
  ok("Opération 19 °C : 2 engagements sur 3 tenus → journée tenue, bronze, +40");

  // --- Jeu 7 : Zéro Gaspi Frigo ----------------------------------------------
  await page.goto(BASE + "/defis/zero-gaspi-frigo");
  for (const i of ["Pain rassis", "Œufs", "Lait"]) await page.getByRole("button", { name: i, exact: true }).click();
  await page.getByRole("button", { name: /Pain perdu/ }).click();
  await page.getByText("Trempez les tranches de pain rassis").waitFor();
  await capture("21-frigo-recette");
  await page.getByRole("button", { name: "Je l'ai cuisiné !" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+30 GreenPoints").isVisible());
  ok("Zéro Gaspi Frigo : pain rassis + œufs + lait → pain perdu cuisiné, bronze, +30");

  async function quiz(fautes) {
    await page.getByRole("tab", { name: /Mes actions/ }).click();
    for (const [n, q] of QUIZ.entries()) {
      const choix = n < fautes ? q.choix[1 - q.bonne] : q.choix[q.bonne];
      await page.locator("label:visible", { hasText: choix }).click();
    }
    await page.getByRole("button", { name: "Voir mes résultats" }).click();
    await page.getByText(`${QUIZ.length - fautes}/${QUIZ.length}`).waitFor();
  }
  await quiz(1);
  assert.equal(await page.locator("p:visible", { hasText: "Case tamponnée !" }).count(), 0);
  ok("Zéro Gaspi Frigo : quiz à 5/6 → corrections affichées, pas de médaille");

  // --- Jeu 10 : Le Défi Immeuble ---------------------------------------------
  await page.goto(BASE + "/defis/defi-immeuble");
  await page.getByText("Classement des résidences").waitFor();
  await page.getByRole("button", { name: /Je rejoins l'équipe/ }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("+60 GreenPoints").isVisible());
  await page.getByText("Vous faites partie de l'équipe").waitFor();
  ok("Défi Immeuble : rejoindre l'équipe → bronze, +60");

  await page.goto(BASE + "/carte");
  assert.equal(await points(), 440 + 100 + 40 + 40 + 30 + 60);
  await page.getByText("Niveau Pousse · Gold").waitFor();
  await page.waitForTimeout(300);
  await capture("22-carte-gold");
  ok("Les Dupont : les 10 cases tamponnées → Green Card Gold, 710 GreenPoints");

  // =========================================================================
  // Les cadeaux (Les Dupont : 710 GreenPoints, carte Gold)
  // =========================================================================
  const disponibles = async () => Number((await page.locator("section[aria-label='Mes GreenPoints'] p.text-\\[2rem\\]").textContent()).replace(/\D/g, ""));
  const fiche = (nom) => page.locator("article", { hasText: nom });

  await page.getByRole("link", { name: "Les cadeaux" }).first().click();
  await page.waitForURL("**/cadeaux");
  assert.equal(await disponibles(), 710);
  await fiche("Mug Green Card").getByRole("button", { name: "Échanger mes points" }).click();
  await fiche("Mug Green Card").getByRole("button", { name: "Oui, je confirme" }).click();
  await fiche("Mug Green Card").getByText("C'est commandé !").waitFor();
  const codeMug = (await fiche("Mug Green Card").locator("strong.font-mono").textContent()).trim();
  assert.match(codeMug, /^GC-[A-Z0-9]{6}$/);
  await page.reload();
  assert.equal(await disponibles(), 410);
  await fiche("Tee-shirt Green Card").getByText("Encore 290 GreenPoints à gagner").waitFor();
  await fiche("Mug Green Card").getByText("Déjà commandé").waitFor();
  ok(`Cadeaux : mug échangé contre 300 points, code de retrait ${codeMug} ; tee-shirt hors de portée (manque 290)`);

  await page.getByRole("button", { name: "Annuler et récupérer mes points" }).click();
  await page.getByText("Annulée").waitFor();
  assert.equal(await disponibles(), 710);
  ok("Cadeaux : commande annulée, les 300 points reviennent");

  await fiche("Tee-shirt Green Card").getByRole("button", { name: "Échanger mes points" }).click();
  await fiche("Tee-shirt Green Card").getByText("Choisissez une taille").waitFor();
  await fiche("Tee-shirt Green Card").locator("label", { hasText: /^M$/ }).click();
  await fiche("Tee-shirt Green Card").getByRole("button", { name: "Échanger mes points" }).click();
  await fiche("Tee-shirt Green Card").getByText("(taille M)").waitFor();
  await fiche("Tee-shirt Green Card").getByRole("button", { name: "Oui, je confirme" }).click();
  await fiche("Tee-shirt Green Card").getByText("C'est commandé !").waitFor();
  ok("Cadeaux : tee-shirt taille M échangé contre 700 points");

  await page.getByRole("button", { name: "Je participe au tirage" }).click();
  await page.getByText("Vous participez au tirage").waitFor();
  await page.reload();
  assert.equal(await disponibles(), 10);
  await page.waitForTimeout(400);
  await capture("24-cadeaux");
  await page.goto(BASE + "/carte");
  assert.equal(await points(), 710, "échanger des points ne fait pas baisser la carte");
  ok("Cadeaux : inscrit au grand tirage (carte Gold) ; la carte garde ses 710 points gagnés");

  await seDeconnecter();
  await seConnecter("Résidence Les Tilleuls", "TIL-A-102", "246810");
  assert.equal(await points(), 460 + 130 + 60 + 140, "Foyer Martin : l'or de Seconde Vie aussi, confirmé par le donneur");
  ok("Foyer Martin : l'échange confirmé lui donne aussi l'or, +140");

  // --- Foyer Martin et les 5 derniers défis ------------------------------------
  assert.equal(
    await delta(async () => {
      await page.goto(BASE + "/defis/douche-chrono");
      await page.getByRole("button", { name: "Je commence ma douche" }).click();
      await page.getByRole("button", { name: "J'ai fini" }).waitFor();
      await reculerDouche("TIL-A-102", 270);
      await page.getByRole("button", { name: "J'ai fini" }).click();
      await page.getByText("Médaille Argent").waitFor();
    }),
    50,
  );
  ok("Foyer Martin : 3ᵉ jour de douche ≤ 5 min → argent, +50");

  assert.equal(
    await delta(async () => {
      await page.goto(BASE + "/defis/operation-19");
      await page.getByText("5 journées tenues").waitFor();
      for (const e of ["19 °C dans les pièces de vie", "16 à 17 °C la nuit", "Volets et rideaux"]) await choisir(e);
      await page.getByRole("button", { name: "Valider ma journée" }).click();
      await page.getByText("6 journées tenues").waitFor();
      await choisir("Hier");
      await page.getByRole("button", { name: "Valider ma journée" }).click();
      await page.getByText("Médaille Argent").waitFor();
    }),
    50,
  );
  ok("Foyer Martin : aujourd'hui + hier → 7 journées à 19 °C, argent, +50");

  assert.equal(
    await delta(async () => {
      await page.goto(BASE + "/defis/zero-gaspi-frigo");
      await quiz(0);
      await page.getByText("Médaille Argent").waitFor();
    }),
    40,
  );
  ok("Foyer Martin : quiz « DLC ou DDM ? » sans faute → argent, +40");

  assert.equal(
    await delta(async () => {
      await page.goto(BASE + "/defis/zero-gaspi-frigo");
      await page.getByRole("tab", { name: /Mes actions/ }).click();
      await choisir("congelé avant la date");
      await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
      await page.getByText("Médaille Or").waitFor();
    }),
    60,
  );
  ok("Foyer Martin : 7ᵉ jour d'action anti-gaspi → or, +60");

  assert.equal(
    await delta(async () => {
      await page.goto(BASE + "/defis/defi-immeuble");
      await page.getByText("Case tamponnée !").waitFor();
      await page.getByText("Médaille Or").waitFor();
      await page.getByText("1ʳᵉ place 🥇").waitFor();
      await page.waitForTimeout(900);
      await capture("23-immeuble-or");
    }),
    300,
  );
  ok("Foyer Martin : résidence 1ʳᵉ le mois dernier avec 5 gestes de sa part → or au Défi Immeuble, +300");

  // --- Le grand tirage -------------------------------------------------------
  await page.goto(BASE + "/cadeaux");
  assert.ok(await page.getByRole("button", { name: "Réservé aux cartes Gold" }).isDisabled());
  ok("Cadeaux : le grand tirage est fermé aux cartes qui ne sont pas Gold");

  const sortie = execFileSync("node_modules/.bin/tsx", ["--env-file=.env", "scripts/tirage.ts", "saison-2026-2027", "--avant-cloture"], { encoding: "utf8" });
  assert.match(sortie, /Gagnant : Les Dupont/);
  await page.reload();
  await page.getByText("Bravo à Les Dupont (Résidence Les Tilleuls)").waitFor();
  await page.waitForTimeout(300);
  await capture("25-tirage");
  ok("Grand tirage : Les Dupont gagnent la semaine dans un appartement CDC Habitat");

  let refus = "";
  try {
    execFileSync("node_modules/.bin/tsx", ["--env-file=.env", "scripts/tirage.ts", "saison-2026-2027", "--avant-cloture"], { encoding: "utf8", stdio: "pipe" });
  } catch (e) {
    refus = String(e.stderr);
  }
  assert.match(refus, /déjà eu lieu/);
  ok("Grand tirage : impossible de le relancer une seconde fois");

  // 8. Mode sombre
  const sombre = await navigateur.newContext({ ...devices["iPhone 13"], colorScheme: "dark" });
  const p2 = await sombre.newPage();
  await p2.goto(BASE);
  await p2.waitForTimeout(800);
  await p2.screenshot({ path: `${CAPTURES}8-accueil-sombre.png`, fullPage: true });
  ok("mode sombre");

  await navigateur.close();
  await prisma.$disconnect();
  console.log(`\nParcours OK — captures dans ${CAPTURES}`);
} catch (e) {
  console.error("\n✗ Échec :", e.message);
  await globalThis.__page?.screenshot({ path: `${CAPTURES}echec.png`, fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  try {
    process.kill(-serveur.pid);
  } catch {}
  setTimeout(() => process.exit(), 500);
}
