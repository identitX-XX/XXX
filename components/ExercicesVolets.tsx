"use client";

// « Tes exercices du jour », adossés aux volets de la quête : la capsule (habiter
// ta signature), ce que tu explores (ta signature émergente) et ce que tu
// construis (ta direction). Trois exercices par volet, TICKABLES (interactifs),
// qui CHANGENT chaque jour. État coché mémorisé par jour, sur l'appareil.

import { useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Glyph, GlyphName } from "./Glyph";
import { exercicesVolet, VoletKey } from "@/parcours-archetypes/voletsExercices";

interface VoletDef { key: VoletKey; nom: string; sous: string; glyph: GlyphName; sujet: string; }

function Volet({ def, jour, defaultOpen }: { def: VoletDef; jour: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const items = exercicesVolet(def.key, def.sujet, jour);
  const [faits, setFaits] = useState<boolean[]>([false, false, false]);

  // Restaure l'état coché du jour (par volet + jour).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`idx-volet-${def.key}-${jour}`);
      if (raw) setFaits(JSON.parse(raw));
      else setFaits([false, false, false]);
    } catch { setFaits([false, false, false]); }
  }, [def.key, jour]);

  const toggle = (i: number) => {
    setFaits((prev) => {
      const next = prev.slice();
      next[i] = !next[i];
      try { localStorage.setItem(`idx-volet-${def.key}-${jour}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const nbFaits = faits.filter(Boolean).length;

  return (
    <div className={`overflow-hidden rounded-xl border bg-raised transition-colors ${open ? "border-fuchsia" : "border-line"}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className={`flex-none ${open ? "text-fuchsia" : "text-ink"}`}>
          <Glyph name={def.glyph} size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">{def.nom}</span>
          <span className="block text-[12.5px] leading-snug text-muted">{def.sous}</span>
        </span>
        <span className="flex-none text-[11px] font-semibold text-muted">{nbFaits}/3</span>
        <ChevronDown size={16} className={`flex-none text-muted transition-transform ${open ? "rotate-180 text-fuchsia" : ""}`} />
      </button>

      {open && (
        <div className="animate-fade-up border-t border-line px-3 py-3">
          <ul className="flex flex-col gap-2">
            {items.map((ex, i) => {
              const done = faits[i];
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex w-full items-start gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-left transition-colors hover:border-fuchsia/50"
                  >
                    <span
                      className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full border ${
                        done ? "border-fuchsia bg-fuchsia text-[color:var(--on-brand)]" : "border-muted/50 text-transparent"
                      }`}
                    >
                      <Check size={13} />
                    </span>
                    <span className={`text-sm leading-relaxed ${done ? "text-muted line-through" : "text-ink"}`}>
                      {ex}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-2.5 px-1 text-[11.5px] text-muted">Ces trois exercices se renouvellent chaque jour.</p>
        </div>
      )}
    </div>
  );
}

export function ExercicesVolets({
  signature,
  emergente,
  direction,
  jour,
}: {
  signature: string;
  emergente: string;
  direction: string;
  jour: number;
}) {
  const defs: VoletDef[] = [
    { key: "capsule", nom: "Ma capsule du jour", sous: `Habiter « ${signature} » aujourd'hui`, glyph: "signature", sujet: signature },
    { key: "explore", nom: "Ce que j'explore", sous: `${emergente} monte en toi`, glyph: "possibles", sujet: emergente },
    { key: "construis", nom: "Ce que je construis", sous: direction ? `Avancer vers « ${direction} »` : "Pose d'abord une direction", glyph: "defi", sujet: direction },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-line bg-surface p-6 animate-fade-up">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia">
        Tes exercices du jour
      </div>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Trois exercices par volet, à cocher au fil de la journée. Ils changent
        chaque jour — reviens demain pour de nouveaux.
      </p>
      <div className="mt-5 flex flex-col gap-3">
        {defs.map((d, i) => (
          <Volet key={d.key} def={d} jour={jour} defaultOpen={i === 0} />
        ))}
      </div>
    </section>
  );
}
