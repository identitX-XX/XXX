"use client";

// Filet de sécurité (App Router) : au lieu de l'écran « Application error » brut,
// on affiche une reprise douce. Cas fréquent après un déploiement : l'onglet
// garde d'anciens « chunks » JS qui n'existent plus → erreur de chargement de
// module. On l'auto-répare en rechargeant une fois (garde-fou anti-boucle).
import { useEffect } from "react";

const RELOAD_KEY = "idx-chunk-reload";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const msg = `${error?.name || ""} ${error?.message || ""}`;
    const chunk =
      /chunk|dynamically imported|importing a module|Failed to fetch|Load failed/i.test(
        msg
      );
    if (chunk) {
      try {
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, "1");
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    }
  }, [error]);

  const recharger = () => {
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch {}
    reset();
    window.location.reload();
  };


  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: "var(--noir)",
        color: "var(--ink)",
        padding: 24,
        fontFamily: "var(--font-inter), sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 340 }}>
        <div
          className="brand-gradient"
          style={{ width: 44, height: 44, borderRadius: 12, margin: "0 auto 18px" }}
        />
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 600,
            fontSize: 24,
            margin: "0 0 8px",
          }}
        >
          Un petit accroc
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 22px" }}>
          L'app vient sûrement d'être mise à jour. Recharge pour repartir — ta
          progression est conservée.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <button
            onClick={recharger}
            style={{
              minHeight: 52,
              width: "100%",
              maxWidth: 280,
              padding: "14px 28px",
              borderRadius: 999,
              border: "none",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              background: "linear-gradient(90deg, var(--fuchsia), var(--orange))",
            }}
          >
            Recharger
          </button>
          <a
            href="/aujourdhui"
            style={{
              fontSize: 14,
              color: "var(--muted)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Aller à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
