"use client";

// Le Vestiaire, branché sur le vrai store. Route neuve, non reliée — la racine
// `/` reste intacte. `reprendre` rallume l'étoile et retire le dépôt (dans la
// fenêtre de 24 h).

import { useEffect, useState } from "react";
import { useTraversee } from "../../../traversee/store/useTraversee";
import { Vestiaire } from "../../../traversee/components/Vestiaire";

export default function PageVestiaire() {
  const s = useTraversee();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={ST.page}>
      <div style={ST.inner}>
        {mounted && <Vestiaire depots={s.vestiaire} onReprendre={s.reprendre} />}
      </div>
    </div>
  );
}

const ST: Record<string, React.CSSProperties> = {
  page: {
    position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto",
    background:
      "radial-gradient(1000px 560px at 50% -6%, #17122a 0%, rgba(23,18,42,0) 60%), #08060f",
    color: "#ece8f4",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  inner: { maxWidth: 640, margin: "0 auto", padding: "56px 24px 120px" },
};
