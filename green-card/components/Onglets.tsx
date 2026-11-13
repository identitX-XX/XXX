"use client";

import { useId, useState } from "react";

/** Onglets accessibles (motif ARIA « tabs ») : flèches gauche/droite pour changer d'onglet. */
export function Onglets({ onglets, initial }: { onglets: { id: string; titre: string; contenu: React.ReactNode }[]; initial?: string }) {
  const [actif, setActif] = useState(initial ?? onglets[0].id);
  const base = useId();

  function clavier(e: React.KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const suivant = onglets[(i + (e.key === "ArrowRight" ? 1 : onglets.length - 1)) % onglets.length];
    setActif(suivant.id);
    document.getElementById(`${base}-tab-${suivant.id}`)?.focus();
  }

  return (
    <div className="space-y-4">
      <div role="tablist" className="grid grid-cols-2 gap-1 rounded-2xl bg-green-100 p-1">
        {onglets.map((o, i) => (
          <button
            key={o.id}
            id={`${base}-tab-${o.id}`}
            role="tab"
            type="button"
            aria-selected={actif === o.id}
            aria-controls={`${base}-panel-${o.id}`}
            tabIndex={actif === o.id ? 0 : -1}
            onClick={() => setActif(o.id)}
            onKeyDown={(e) => clavier(e, i)}
            className={`min-h-[48px] rounded-xl text-sm font-semibold transition-colors ${actif === o.id ? "bg-surface text-ink shadow-sm" : "text-muted"}`}
          >
            {o.titre}
          </button>
        ))}
      </div>
      {onglets.map((o) => (
        <div key={o.id} id={`${base}-panel-${o.id}`} role="tabpanel" aria-labelledby={`${base}-tab-${o.id}`} hidden={actif !== o.id} className="space-y-4">
          {o.contenu}
        </div>
      ))}
    </div>
  );
}
