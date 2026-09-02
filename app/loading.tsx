// B-01 — État de chargement minimal (fallback Suspense de l'App Router).
// Fond 0a090d, seulement le mot « IdentitX » en fondu. Composant serveur, pur
// CSS (aucune interactivité).

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "var(--noir)",
      }}
    >
      <style>{`
        @keyframes idx-loading-fade { 0%, 100% { opacity: 0.28 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) { .idx-loading { animation: none; opacity: 0.7 } }
      `}</style>
      <span
        className="idx-loading"
        style={{
          color: "#ecdcb6",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          animation: "idx-loading-fade 1.6s ease-in-out infinite",
        }}
      >
        IdentitX
      </span>
    </div>
  );
}
