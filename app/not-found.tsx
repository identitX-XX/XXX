import Link from "next/link";

// 404 — sobre, dans le registre de La Traversée. Ramène au jour.
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        background:
          "radial-gradient(1000px 560px at 50% -6%, #17122a 0%, rgba(23,18,42,0) 60%), #08060f",
        color: "#ece8f4",
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <p
        style={{
          fontFamily: '"Iowan Old Style", Palatino, Georgia, serif',
          fontSize: 22,
          color: "#f2eef8",
          margin: "0 0 10px",
        }}
      >
        Ce chemin n'existe pas.
      </p>
      <p style={{ color: "#948da8", fontSize: 15, margin: "0 0 26px", maxWidth: "32ch" }}>
        La carte n'a pas de route ici. Reviens à ton jour.
      </p>
      <Link
        href="/"
        style={{
          fontSize: 15,
          fontWeight: 600,
          padding: "12px 28px",
          borderRadius: 999,
          border: "1px solid #2f2643",
          background: "#191524",
          color: "#ece8f4",
          textDecoration: "none",
        }}
      >
        Le jour
      </Link>
    </div>
  );
}
