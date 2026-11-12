/**
 * Test de bout en bout du parcours d'entrée (Playwright, sans framework de test).
 * Prérequis : `npm run db:reset && npm run build`, puis : `node scripts/e2e.mjs`
 * Les captures d'écran sont écrites dans ./captures.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

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
  assert.ok(donnees.greenPoints.length >= 5);
  ok("export RGPD de mes données");

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
