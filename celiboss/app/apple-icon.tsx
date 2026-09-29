import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Monogramme « C » ivoire sur bordeaux : favicon + icône de l'app installée.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: site.og.bordeaux,
          color: site.og.fond,
          fontFamily: "serif",
          fontSize: 126,
          paddingBottom: 10,
        }}
      >
        C
        <div
          style={{
            position: "absolute",
            bottom: 34,
            width: 34,
            height: 2,
            backgroundColor: site.og.champagne,
          }}
        />
      </div>
    ),
    size,
  );
}
