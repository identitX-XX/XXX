"use client";

// Le Vestiaire de La Traversée — ce qu'elle a laissé, réversible 24 h. Plein
// écran, branché sur le store de La Traversée. Retour au jour par le lien.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTraversee } from "../../../traversee/store/useTraversee";
import { Vestiaire } from "../../../traversee/components/Vestiaire";

export default function PageVestiaire() {
  const s = useTraversee();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={ST.page}>
      <Link href="/traversee" style={ST.retour}>
        ← Le jour
      </Link>
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
  retour: {
    position: "fixed", top: 20, left: 22, fontSize: 12, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#635d78", textDecoration: "none", fontWeight: 600,
    zIndex: 3,
  },
  inner: { maxWidth: 640, margin: "0 auto", padding: "64px 24px 120px" },
};
