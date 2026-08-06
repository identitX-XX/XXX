import { ImageResponse } from "next/og";

// A-02 — Image OG générée dynamiquement (1200×630). CSS inline compatible
// ImageResponse (Satori) : pas de police custom, pas d'image externe. Fond noir,
// « La Traversée » au centre, sous-titre, « IdentitX » discret en bas.

export const alt = "IdentitX — La Traversée";
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a090d",
          backgroundImage:
            "radial-gradient(120% 90% at 78% 18%, rgba(212,175,106,0.18), rgba(10,9,13,0))",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -2,
            color: "#ecdcb6",
            textAlign: "center",
          }}
        >
          La Traversée
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 40,
            color: "#c9c1b4",
            textAlign: "center",
          }}
        >
          retirer ce qui n'est plus toi
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 70,
            fontSize: 26,
            letterSpacing: 10,
            color: "#d4af6a",
          }}
        >
          IDENTITX
        </div>
      </div>
    ),
    { ...size }
  );
}
