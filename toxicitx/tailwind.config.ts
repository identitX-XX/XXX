import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette ToxicitX : fond sombre "clinique", accents toxiques
        ink: "#0d0f14",
        surface: "#151922",
        line: "#232a37",
        muted: "#8a93a6",
        // Échelle de toxicité 1 -> 6 (du sain au danger)
        tox: {
          1: "#22c55e", // Saine
          2: "#84cc16", // Sous tension
          3: "#eab308", // Fragile
          4: "#f59e0b", // Tendue
          5: "#f97316", // Toxique
          6: "#ef4444", // Extrême
        },
        acid: "#a3e635",
        venom: "#c026d3",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
