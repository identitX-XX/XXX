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
        display: ["var(--font-fraunces)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        // Ombres MATES et chaudes (esprit danois) : plus de halo coloré, mais
        // assez présentes pour détacher les cartes du fond (contours nets).
        soft: "0 10px 26px -18px rgba(60,45,35,0.42)",
        glow: "0 6px 16px -10px rgba(60,45,35,0.4)",
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
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
