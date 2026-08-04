"use client";

// Template Next.js : re-monté à CHAQUE navigation (contrairement au layout).
// On y pose une entrée en fondu douce pour que le changement de page « glisse »
// au lieu de sauter. Neutralisé sous prefers-reduced-motion (voir globals.css).
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}
