"use client";

// « Approfondir ta signature » — les 4 univers reviennent ici, non plus comme
// peaux de jeu (supprimées de la Quête) mais comme ENTRÉES de lecture : chaque
// univers relit ta signature sous un angle (saisons, mouvement, projection,
// mémoire). Design sobre (lin & prune), un accordéon : on ouvre un univers à la
// fois. Aucun neon, aucun graphisme râpé.

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Glyph, GlyphName } from "./Glyph";
import { UNIVERS, UniversKey, lectureUnivers } from "@/parcours-archetypes/univers";

const GLYPHE: Record<UniversKey, GlyphName> = {
  nature: "u_nature",
  urbain: "u_urbain",
  futuriste: "u_futuriste",
  retro: "u_retro",
};

export function ApprofondirUnivers({ archName }: { archName: string }) {
  const [ouvert, setOuvert] = useState<UniversKey | null>(null);

  return (
    <section className="mb-8 rounded-2xl border border-line bg-surface p-6 animate-fade-up">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia">
        Approfondir ta signature
      </div>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Quatre univers, quatre façons de relire <b className="text-ink">{archName}</b> —
        et d'aller un cran plus loin. Ouvre celui qui t'appelle aujourd'hui.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {UNIVERS.map((u) => {
          const on = ouvert === u.key;
          const lec = lectureUnivers(archName, u.key);
          return (
            <div
              key={u.key}
              className={`overflow-hidden rounded-xl border transition-colors ${
                on ? "border-fuchsia bg-raised" : "border-line bg-raised"
              }`}
            >
              <button
                type="button"
                onClick={() => setOuvert(on ? null : u.key)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                aria-expanded={on}
              >
                <span className={`flex-none ${on ? "text-fuchsia" : "text-ink"}`}>
                  <Glyph name={GLYPHE[u.key]} size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{u.nom}</span>
                  <span className="block text-[12.5px] leading-snug text-muted">
                    {archName} {u.lentille}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`flex-none text-muted transition-transform ${on ? "rotate-180 text-fuchsia" : ""}`}
                />
              </button>

              {on && (
                <div className="animate-fade-up border-t border-line px-4 py-4">
                  <h3 className="font-display text-lg font-semibold text-ink">{lec.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{lec.texte}</p>
                  <div className="mt-4 rounded-lg border border-fuchsia/30 bg-fuchsia/[0.06] px-3.5 py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia">
                      L'entrée
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-ink">{lec.question}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
