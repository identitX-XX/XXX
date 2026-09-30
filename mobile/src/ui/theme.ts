import { Platform } from "react-native";

// Même palette que le site, esprit minimaliste : ivoire, filets fins, encre.
export const couleurs = {
  ivoire: "#F3EDE3",
  sable: "#EAE2D5",
  filet: "#D8CEC0",
  taupe: "#A79A8D",
  gris: "#6E625A",
  encre: "#291D1B",
  nuit: "#1C1413",
  bordeaux: "#5A1726",
  champagne: "#B7A27A",
};

export const polices = {
  titre: Platform.select({ ios: "Didot", android: "serif", default: "serif" }),
  texte: Platform.select({ ios: "System", android: "sans-serif", default: "system-ui" }),
};

export const espace = { gouttiere: 24 };
