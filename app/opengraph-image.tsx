import { ImageResponse } from "next/og";
import { OG_FONT_BASE64 } from "./_ogFont";

// A-02 — Image OG générée dynamiquement (1200×630). « IdentitX » seul, au
// centre, dans la police de la marque (Poppins ExtraBold). La police est
// embarquée en base64 (Satori ne lit pas les woff2 de next/font ; l'inline évite
// tout aléa de lecture fichier / tracing serverless).

export const alt = "IdentitX";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontBold = Uint8Array.from(atob(OG_FONT_BASE64), (c) => c.charCodeAt(0));

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
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Poppins",
            fontWeight: 800,
            fontSize: 150,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: "#ecdcb6" }}>Identit</span>
          <span style={{ color: "#d4af6a" }}>X</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Poppins", data: fontBold, weight: 800, style: "normal" }],
    }
  );
}
