"use client";

// Filet de dernier recours (erreur dans le layout racine). Doit rendre son
// propre <html>/<body>. Même logique : auto-reload sur chunk périmé, sinon
// bouton de reprise.
import { useEffect } from "react";
import { tenterReprise, oublierReprises } from "@/lib/chunkRecover";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    tenterReprise(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          minHeight: "100svh",
          margin: 0,
          display: "grid",
          placeItems: "center",
          background: "#11121b",
          color: "#efe8dc",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 340 }}>
          <h1 style={{ fontWeight: 600, fontSize: 22, margin: "0 0 8px" }}>Un petit accroc</h1>
          <p style={{ opacity: 0.8, fontSize: 14, lineHeight: 1.6, margin: "0 0 22px" }}>
            L'app vient sûrement d'être mise à jour. Recharge pour repartir.
          </p>
          <button
            onClick={() => {
              oublierReprises();
              reset();
              window.location.reload();
            }}
            style={{
              minHeight: 52,
              padding: "14px 28px",
              borderRadius: 999,
              border: "none",
              color: "#11121b",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              background: "#d4af6a",
            }}
          >
            Recharger
          </button>
        </div>
      </body>
    </html>
  );
}
