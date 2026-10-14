"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Monster from "@/components/Monster";
import { QUESTIONS } from "@/content";
import { AXIS_MASCOT, AXIS_TITLE, AXIS_WIT } from "@/content/ui";
import { useToxStore } from "@/store/useToxStore";
import { useMounted } from "@/lib/useMounted";
import { AXES, SCALE, type ScaleValue } from "@/types";

export default function QuizPage() {
  const router = useRouter();
  const mounted = useMounted();
  const [idx, setIdx] = useState(0);
  const answers = useToxStore((s) => s.answers);
  const setAnswer = useToxStore((s) => s.setAnswer);

  const axis = AXES[idx];
  const qs = QUESTIONS.filter((q) => q.axis === axis);
  const answered = mounted ? Object.keys(answers).length : 0;
  const pct = Math.round((answered / QUESTIONS.length) * 100);

  function next() {
    if (idx < 2) {
      setIdx(idx + 1);
      window.scrollTo(0, 0);
    } else {
      router.push("/resultats");
    }
  }

  return (
    <section className="step">
      <div className="progmeta">
        <span>Section {idx + 1} / 3</span>
        <span>{answered}/30</span>
      </div>
      <div className="prog">
        <i style={{ width: `${pct}%` }} />
      </div>

      <div className="qhead">
        <div className="mon">
          <Monster id={AXIS_MASCOT[axis]} />
        </div>
        <div>
          <div className="eyebrow">Toxicité {axis}</div>
          <h2>{AXIS_TITLE[axis]}</h2>
        </div>
      </div>
      <div className="qwit">{AXIS_WIT[axis]}</div>

      {qs.map((q) => (
        <div key={q.id} className="card q">
          <div className="th">{q.theme}</div>
          <div className="qt">{q.text}</div>
          <div className="scale">
            {SCALE.map((s) => (
              <button
                key={s.value}
                aria-pressed={mounted && answers[q.id] === s.value}
                onClick={() => setAnswer(q.id, s.value as ScaleValue)}
              >
                <span className="dot" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="row mt2">
        {idx > 0 && (
          <button
            className="btn"
            onClick={() => {
              setIdx(idx - 1);
              window.scrollTo(0, 0);
            }}
          >
            ←
          </button>
        )}
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={next}>
          {idx < 2 ? "Section suivante →" : "Révéler mon monstre →"}
        </button>
      </div>
      <p className="note">
        {answered < QUESTIONS.length
          ? "Répondez au feeling : il n'y a pas de mauvaise réponse (seulement de mauvais managers)."
          : "Tout est rempli — place à la révélation."}
      </p>
    </section>
  );
}
