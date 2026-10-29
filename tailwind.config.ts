import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./traversee/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: "var(--noir)",
        surface: "var(--surface)",
        raised: "var(--raised)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        fuchsia: "var(--fuchsia)",
        orange: "var(--orange)",
        danger: "var(--danger)",
        violet: "var(--violet)",
        gold: "var(--gold)",
        cyan: "var(--cyan)",
        slate: "var(--slate)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        // Parti « calme radical » : quasi plat. Les cartes ne flottent plus sur
        // un halo — elles se détachent par un simple filet. On garde un soupçon
        // d'ombre (1px) pour éviter qu'elles ne disparaissent tout à fait.
        soft: "0 1px 1px rgba(0,0,0,0.04)",
        glow: "0 1px 1px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
