import { test } from "node:test";
import assert from "node:assert/strict";
import { gateDecision, shellDecision } from "./access";

const gate = (o: Partial<Parameters<typeof gateDecision>[0]>) =>
  gateDecision({ pathname: "/aujourdhui", checked: true, unlocked: false, hasEmail: false, ...o });

test("gate : /auth/callback passe toujours (retour lien magique)", () => {
  assert.equal(gate({ pathname: "/auth/callback", unlocked: false, hasEmail: false }), "children");
});

// LE BUG ADMIN : /admin ne doit JAMAIS être piégé derrière le portail email,
// même sans déverrouillage ni email (il a sa propre clé ADMIN_KEY).
test("gate : /admin passe toujours, sans déverrouillage ni email", () => {
  assert.equal(gate({ pathname: "/admin", unlocked: false, hasEmail: false }), "children");
  assert.equal(gate({ pathname: "/admin/metrics", unlocked: false, hasEmail: false }), "children");
});

test("gate : avant hydratation → loading", () => {
  assert.equal(gate({ checked: false }), "loading");
});

test("gate : déverrouillé + email connu → children", () => {
  assert.equal(gate({ unlocked: true, hasEmail: true }), "children");
});

test("gate : déverrouillé mais SANS email → portail (filet de collecte)", () => {
  assert.equal(gate({ unlocked: true, hasEmail: false }), "portal");
});

test("gate : non déverrouillé → portail", () => {
  assert.equal(gate({ unlocked: false, hasEmail: true }), "portal");
});

const shell = (o: Partial<Parameters<typeof shellDecision>[0]>) =>
  shellDecision({ pathname: "/aujourdhui", mounted: true, onboarded: true, ...o });

test("shell : /auth/callback se rend nu", () => {
  assert.equal(shell({ pathname: "/auth/callback" }), "bare");
});

test("shell : avant montage → loading", () => {
  assert.equal(shell({ mounted: false }), "loading");
});

test("shell : pas onboardée (hors admin) → onboarding", () => {
  assert.equal(shell({ onboarded: false, pathname: "/aujourdhui" }), "onboarding");
});

// LE BUG ADMIN (2e verrou) : l'admin ne passe jamais par l'onboarding.
test("shell : /admin ne passe jamais par l'onboarding, même non onboardée", () => {
  assert.equal(shell({ onboarded: false, pathname: "/admin" }), "shell");
});

test("shell : onboardée → chrome complet", () => {
  assert.equal(shell({ onboarded: true }), "shell");
});
