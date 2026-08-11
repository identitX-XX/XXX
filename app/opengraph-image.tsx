import { ImageResponse } from "next/og";

// A-02 — Image OG générée dynamiquement (1200×630). CSS inline compatible
// ImageResponse (Satori) : pas de police custom, pas d'image externe. Fond noir,
// « IdentitX » seul, au centre — l'aperçu du lien partagé.

export const alt = "IdentitX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a090d",
          backgroundImage:
            "radial-gradient(120% 90% at 78% 18%, rgba(212,175,106,0.18), rgba(10,9,13,0))",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: 6,
          }}
        >
          <span style={{ color: "#ecdcb6" }}>Identit</span>
          <span style={{ color: "#d4af6a" }}>X</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
