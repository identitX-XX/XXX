import type { Config } from "tailwindcss";

// Palette et rythme : tout passe par les variables CSS de globals.css,
// Tailwind ne fait que les nommer. Changer la marque = changer :root.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivoire: "var(--ivoire)",
        sable: "var(--sable)",
        encre: "var(--encre)",
        gris: "var(--gris)",
        taupe: "var(--taupe)",
        filet: "var(--filet)",
        bordeaux: "var(--bordeaux)",
        champagne: "var(--champagne)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // Échelle typographique éditoriale (fluide, clamp).
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.22em" }],
        corps: ["1.0625rem", { lineHeight: "1.75" }],
        chapo: ["clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)", { lineHeight: "1.5" }],
        // Corps serif du manifeste : lecture longue, grand confort.
        lecture: ["clamp(1.3rem, 1.15rem + 0.5vw, 1.6rem)", { lineHeight: "1.6" }],
        titre: ["clamp(2.1rem, 1.5rem + 2.4vw, 3.5rem)", { lineHeight: "1.08" }],
        manifeste: ["clamp(2.75rem, 1.5rem + 5vw, 6rem)", { lineHeight: "0.98" }],
      },
      // Rythme vertical : une idée par écran.
      spacing: {
        rythme: "clamp(5rem, 3rem + 8vw, 10rem)",
      },
      maxWidth: {
        lecture: "38rem",
        page: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
