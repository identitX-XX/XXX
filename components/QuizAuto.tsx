"use client";

// Quiz d'auto-évaluation : choisis un pilier, note 4 énoncés, obtiens un bilan
// + une piste d'action. Aucun suivi, aucune notion de jour — tu le fais quand tu
// veux, autant de fois que tu veux. Sobre (lin & prune).

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Glyph, GlyphName } from "./Glyph";
import { QUIZ, bilanQuiz } from "@/parcours-archetypes/quizAuto";
import { Perimetre, labelPerimetre } from "@/parcours-gap/perimetres";

const GLYPHE: Record<Perimetre, GlyphName> = {
  relationnel: "relationnel",
  love: "love",
  pro: "pro",
  perso: "perso",
};

const ECHELLE = ["Rarement", "Parfois", "Souvent", "Presque toujours"];

export function QuizAuto() {
  const [pilier, setPilier] = useState<Perimetre | null>(null);
  const [reps, setReps] = useState<Record<number, number>>({});

  const quiz = pilier ? QUIZ.find((q) => q.key === pilier)! : null;
  const complet = quiz ? quiz.enonces.every((_, i) => reps[i] !== undefined) : false;
  const score = quiz ? quiz.enonces.reduce((s, _, i) => s + (reps[i] ?? 0), 0) : 0;
  const total = quiz ? quiz.enonces.length * 3 : 0;
  const bilan = complet ? bilanQuiz(score, total) : null;

  const choisir = (k: Perimetre) => { setPilier(k); setReps({}); };
  const recommencer = () => { setPilier(null); setReps({}); };

  return (
    <section className="mb-8 rounded-2xl border border-line bg-surface p-6 animate-fade-up">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia">
        Quiz d'auto-évaluation
      </div>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Où en es-tu, là, sur un pilier ? Choisis-en un, note quatre énoncés,
        reçois un petit bilan. Fais-le quand tu veux, autant de fois que tu veux.
      </p>

      {/* Choix du pilier */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {QUIZ.map((q) => {
          const on = pilier === q.key;
          return (
            <button
              key={q.key}
              type="button"
              onClick={() => choisir(q.key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-colors ${
                on ? "border-fuchsia bg-fuchsia/[0.06]" : "border-line bg-raised hover:border-fuchsia/50"
              }`}
            >
              <span className={on ? "text-fuchsia" : "text-ink"}>
                <Glyph name={GLYPHE[q.key]} size={22} />
              </span>
              <span className="text-[12.5px] font-semibold leading-tight text-ink">
                {labelPerimetre(q.key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Énoncés */}
      {quiz && (
        <div className="mt-5 animate-fade-up">
          <p className="mb-3 text-[13px] text-muted">{quiz.intro}</p>
          <div className="flex flex-col gap-3">
            {quiz.enonces.map((e, i) => (
              <div key={i} className="rounded-xl border border-line bg-raised p-3.5">
                <p className="mb-2.5 text-sm leading-snug text-ink">{e}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {ECHELLE.map((lab, v) => {
                    const on = reps[i] === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setReps((p) => ({ ...p, [i]: v }))}
                        className={`rounded-lg border px-1 py-2 text-[11px] font-medium leading-tight transition-colors ${
                          on ? "border-fuchsia bg-fuchsia text-[color:var(--on-brand)]" : "border-line text-muted hover:border-fuchsia/50"
                        }`}
                      >
                        {lab}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bilan */}
          {bilan && (
            <div className="mt-4 animate-fade-up rounded-xl border border-fuchsia/30 bg-fuchsia/[0.06] p-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia">
                Ton bilan · {labelPerimetre(quiz.key)}
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink">{bilan.titre}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{bilan.texte}</p>
              <div className="mt-3 border-t border-line pt-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-fuchsia">La piste</span>
                <p className="mt-1 text-sm leading-relaxed text-ink">{bilan.action}</p>
              </div>
            </div>
          )}

          {!complet && (
            <p className="mt-3 text-[12.5px] text-muted">Note les quatre énoncés pour voir ton bilan.</p>
          )}

          <button
            type="button"
            onClick={recommencer}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-fuchsia hover:text-fuchsia"
          >
            <RotateCcw size={13} /> Un autre pilier
          </button>
        </div>
      )}
    </section>
  );
}
