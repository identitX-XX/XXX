import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.nom} — ${site.signature}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          backgroundColor: site.og.bordeaux,
          color: site.og.fond,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 150, letterSpacing: -4 }}>
          {site.nom}
          <span style={{ color: site.og.bordeaux }}>.</span>
        </div>
        <div style={{ width: 120, height: 4, backgroundColor: site.og.bordeaux, margin: "32px 0" }} />
        <div style={{ fontSize: 40, color: site.og.bordeaux, fontStyle: "italic" }}>{site.signature}</div>
      </div>
    ),
    size,
  );
}
