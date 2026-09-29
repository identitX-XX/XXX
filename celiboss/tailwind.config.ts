import type { Config } from "tailwindcss";

// Palette et rythme : tout passe par les variables CSS de globals.css (en
// canaux RGB, pour que les modificateurs de transparence fonctionnent),
// Tailwind ne fait que les nommer. Changer la marque = changer :root.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nuit: "rgb(var(--nuit) / <alpha-value>)",
        ivoire: "rgb(var(--ivoire) / <alpha-value>)",
        sable: "rgb(var(--sable) / <alpha-value>)",
        encre: "rgb(var(--encre) / <alpha-value>)",
        gris: "rgb(var(--gris) / <alpha-value>)",
        taupe: "rgb(var(--taupe) / <alpha-value>)",
        filet: "rgb(var(--filet) / <alpha-value>)",
        bordeaux: "rgb(var(--bordeaux) / <alpha-value>)",
        champagne: "rgb(var(--champagne) / <alpha-value>)",
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
        titre: ["clamp(2.25rem, 1.4rem + 3.4vw, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        manifeste: ["clamp(3rem, 1.2rem + 7.2vw, 8.75rem)", { lineHeight: "0.88", letterSpacing: "-0.04em" }],
      },
      // Rythme vertical : une idée par écran.
      spacing: {
        rythme: "clamp(5rem, 3rem + 8vw, 10rem)",
      },
      maxWidth: {
        lecture: "42rem",
        page: "78rem",
      },
    },
  },
  plugins: [],
};

export default config;
