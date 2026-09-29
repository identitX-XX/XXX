import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Monogramme « C » ivoire sur bordeaux : favicon + icône de l'app installée.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 360,
          paddingBottom: 30,
        }}
      >
        C
        <div
          style={{
            position: "absolute",
            bottom: 96,
            width: 96,
            height: 4,
            backgroundColor: site.og.champagne,
          }}
        />
      </div>
    ),
    size,
  );
}
