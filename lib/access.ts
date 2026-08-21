// Décisions PURES de routage d'accès, extraites de Gate & ClientShell pour être
// verrouillées par test. Invariant critique : l'admin (protégé par sa PROPRE
// clé, ADMIN_KEY) ne doit JAMAIS être piégé derrière le portail email ni
// l'onboarding grand public — sinon on perd l'accès au tableau de bord.

const isAdmin = (p: string) => p.startsWith("/admin");
const isAuthCallback = (p: string) => p === "/auth/callback";

// Portail (Gate). "children" = laisser passer · "loading" = attendre
// l'hydratation · "portal" = afficher l'écran email.
export type GateInput = {
  pathname: string;
  checked: boolean;
  unlocked: boolean;
  hasEmail: boolean;
};
export function gateDecision(i: GateInput): "children" | "loading" | "portal" {
  if (isAuthCallback(i.pathname)) return "children";
  if (isAdmin(i.pathname)) return "children"; // protégé par ADMIN_KEY
  if (!i.checked) return "loading";
  if (i.unlocked && i.hasEmail) return "children";
  return "portal";
}

// Coquille applicative (ClientShell). "bare" = children seuls (retour lien
// magique) · "loading" · "onboarding" · "shell" = chrome complet.
export type ShellInput = { pathname: string; mounted: boolean; onboarded: boolean };
export function shellDecision(
  i: ShellInput
): "bare" | "loading" | "onboarding" | "shell" {
  if (isAuthCallback(i.pathname)) return "bare";
  if (!i.mounted) return "loading";
  if (!i.onboarded && !isAdmin(i.pathname)) return "onboarding";
  return "shell";
}
