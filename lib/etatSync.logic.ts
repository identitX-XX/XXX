// Logique PURE de décision de la synchro « appareil ↔ serveur » — isolée ici,
// sans aucune dépendance aux stores ni au navigateur, pour être testable en
// Node (filet de non-régression). C'est le point où vivait le bug de perte de
// progression : une sauvegarde serveur « à égalité » mais sans diagnostic
// écrasait la progression locale. Les invariants ci-dessous verrouillent ça.

export type EtatBlob =
  | {
      state?: {
        diagnostic?: { dominant?: string } | null;
        etat?: { jourCourant?: number; historique?: unknown[] };
      };
      version?: number;
    }
  | null
  | undefined;

// Niveau d'avancement d'un état de parcours. Le DIAGNOSTIC pèse très lourd : un
// état qui a une signature ne doit JAMAIS être dépassé par un état qui n'en a
// pas (sinon on perd le diagnostic et on doit tout refaire). Puis départage par
// jour courant, puis par jours vécus.
export function advancement(blob: unknown): number {
  try {
    const st = (blob as EtatBlob)?.state;
    const hasDiag =
      st?.diagnostic && typeof st.diagnostic.dominant === "string" ? 1 : 0;
    const jour = typeof st?.etat?.jourCourant === "number" ? st.etat.jourCourant : 0;
    const vecus = Array.isArray(st?.etat?.historique) ? st.etat.historique.length : 0;
    return hasDiag * 1_000_000 + jour * 1000 + vecus;
  } catch {
    return 0;
  }
}

// Restaure-t-on depuis le serveur ? OUI seulement si le serveur est STRICTEMENT
// plus avancé que le local. À égalité (ou en-dessous), on garde le local — le
// push local rattrapera le serveur. C'est la garantie anti-perte-de-progression.
export function serveurPlusAvance(server: unknown, local: unknown): boolean {
  return advancement(server) > advancement(local);
}
