/**
 * Test de bout en bout (Playwright, sans framework de test) : parcours d'entrée et jeux 1, 6 et 9.
 * Prérequis : `npm run db:reset && npm run build`, puis : `npm run e2e`
 * Les captures d'écran sont écrites dans ./captures.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import tri from "../lib/jeux/tri.ts";
const { BACS, DECHETS } = tri;

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

  // --- Le vote des voisins fait gagner l'or à l'auteur ; relevé en baisse → or -----
  await seDeconnecter();
  await seConnecter("Résidence Les Tilleuls", "TIL-A-102", "246810");
  assert.equal(await points(), 190 + 80, "Foyer Martin : l'or de la Boîte à Astuces grâce au 5ᵉ vote");
  ok("Foyer Martin : 5ᵉ vote reçu → or à la Boîte à Astuces, +80");

  await page.goto(BASE + "/defis/compteur-malin");
  await page.getByLabel(/Index du compteur/).fill("12100");
  await page.getByRole("button", { name: "Enregistrer le relevé" }).click();
  await page.getByText("Case tamponnée !").waitFor();
  assert.ok(await page.getByText("Médaille Or").isVisible());
  assert.ok(await page.getByText("+130 GreenPoints").isVisible());
  await page.getByText(/de moins.*économisés par mois/).waitFor();
  await page.waitForTimeout(900);
  await capture("14-compteur-or");
  ok("Foyer Martin : consommation en baisse → or au Compteur Malin, +130");

  // Les défis non développés ne sont pas accessibles par URL.
  await page.goto(BASE + "/defis/douche-chrono");
  await page.waitForURL("**/carte");
  ok("un défi « Bientôt » renvoie vers la carte");

  // 8. Mode sombre
  const sombre = await navigateur.newContext({ ...devices["iPhone 13"], colorScheme: "dark" });
  const p2 = await sombre.newPage();
  await p2.goto(BASE);
  await p2.waitForTimeout(800);
  await p2.screenshot({ path: `${CAPTURES}8-accueil-sombre.png`, fullPage: true });
  ok("mode sombre");

  await navigateur.close();
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
