"use client";

import { Card } from "./ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { detecterChapitres, derniereBascule } from "@/parcours-archetypes/bascules";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";

// Mémoire identitaire : le parcours raconté en chapitres, avec ses bascules.
// « Un chapitre a changé » — la preuve tangible qu'on évolue quand on croit
// stagner. N'apparaît que lorsqu'il y a assez de matière pour un récit.
export function Chapitres() {
  const etat = useParcoursStore((s) => s.etat);
  const H = etat.historique;
  if (H.length < 3) return null;

  const chapitres = detecterChapitres(H);
  const bascule = derniereBascule(chapitres);

  return (
    <Card className="mt-4 p-6 animate-fade-up">
      <div className="flex items-baseline justify-between">
        <div className="text-xs uppercase tracking-[0.16em] text-fuchsia">
          Tes chapitres
        </div>
        <div className="text-xs text-muted">
          {chapitres.length} chapitre{chapitres.length > 1 ? "s" : ""}
        </div>
      </div>
      <p className="mt-1 text-sm text-muted">
        Ton parcours se raconte par bascules d'archétype — la preuve que tu
        avances, même quand ça ne se sent pas.
      </p>

      {/* Frise segmentée : largeur ∝ durée, teinte = archétype */}
      <div className="mt-4 flex gap-1 overflow-hidden rounded-full">
        {chapitres.map((c, i) => (
          <div
            key={i}
            title={`Jour ${c.debut}–${c.fin} · ${archetypeByKey[c.archetype].name}`}
            className="h-2.5 rounded-full"
            style={{
              flexGrow: c.jours,
              background: `hsl(${archetypeByKey[c.archetype].hue} 70% 55%)`,
            }}
          />
        ))}
      </div>

      {/* Liste des chapitres */}
      <div className="mt-5 flex flex-col gap-3">
        {chapitres.map((c, i) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 flex-none rounded-full"
              style={{ background: `hsl(${archetypeByKey[c.archetype].hue} 70% 55%)` }}
            />
            <span className="font-display text-base text-ink">
              {archetypeByKey[c.archetype].name}
            </span>
            <span className="text-xs text-muted">
              Jour {c.debut}
              {c.fin !== c.debut ? `–${c.fin}` : ""} · {c.jours} j · clarté{" "}
              {c.coherenceMoy}
            </span>
          </div>
        ))}
      </div>

      {bascule && (
        <div
          className="mt-5 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "color-mix(in srgb, var(--fuchsia) 40%, transparent)",
            background: "color-mix(in srgb, var(--fuchsia) 7%, transparent)",
          }}
        >
          <span className="text-lg">↳</span>
          <span className="text-ink">
            Dernière bascule au <b>jour {bascule.jour}</b> :{" "}
            {archetypeByKey[bascule.depuis].name} → {archetypeByKey[bascule.vers].name}.
          </span>
        </div>
      )}
    </Card>
  );
}
