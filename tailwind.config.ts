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
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.18em" }],
        corps: ["1.0625rem", { lineHeight: "1.75" }],
        chapo: ["clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)", { lineHeight: "1.5" }],
        titre: ["clamp(2rem, 1.5rem + 2.2vw, 3.25rem)", { lineHeight: "1.1" }],
        manifeste: ["clamp(2.5rem, 1.6rem + 4vw, 5rem)", { lineHeight: "1.02" }],
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
