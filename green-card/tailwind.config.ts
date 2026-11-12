import type { Config } from "tailwindcss";

/** Design system Green Card : les couleurs viennent des tokens CSS de app/globals.css. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cdc: { red: "var(--cdc-red)", "red-hover": "var(--cdc-red-hover)" },
        ink: "var(--ink)",
        muted: "var(--muted)",
        bg: "var(--bg)",
        surface: "var(--surface)",
        line: "var(--line)",
        green: {
          50: "var(--green-50)",
          100: "var(--green-100)",
          400: "var(--green-400)",
          600: "var(--green-600)",
          700: "var(--green-700)",
          text: "var(--green-text)",
        },
        alert: { DEFAULT: "var(--alert)", bg: "var(--alert-bg)" },
      },
      fontFamily: { sans: ["var(--font-poppins)", "system-ui", "sans-serif"] },
      borderRadius: { carte: "1.25rem" },
      keyframes: {
        tampon: {
          "0%": { transform: "scale(2.2) rotate(-12deg)", opacity: "0" },
          "60%": { transform: "scale(0.92) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0)", opacity: "1" },
        },
        activation: {
          "0%": { transform: "rotateY(90deg) scale(0.8)", opacity: "0" },
          "100%": { transform: "rotateY(0) scale(1)", opacity: "1" },
        },
        monte: { "0%": { transform: "translateY(12px)", opacity: "0" }, "100%": { transform: "none", opacity: "1" } },
      },
      animation: {
        tampon: "tampon .5s cubic-bezier(.2,.8,.2,1.2) both",
        activation: "activation .9s cubic-bezier(.2,.8,.2,1) both",
        monte: "monte .5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
