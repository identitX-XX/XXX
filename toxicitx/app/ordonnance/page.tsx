"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Monster from "@/components/Monster";
import { QUESTIONS, PROFILES, remediesForProfile } from "@/content";
import { score } from "@/lib/scoring";
import { useToxStore } from "@/store/useToxStore";
import { useMounted } from "@/lib/useMounted";
import type { RemedyType } from "@/types";

export default function OrdonnancePage() {
  const router = useRouter();
  const mounted = useMounted();
  const answers = useToxStore((s) => s.answers);
  const reset = useToxStore((s) => s.reset);
  const [tab, setTab] = useState<RemedyType>("individuel");

  if (!mounted) return null;

  if (Object.keys(answers).length === 0) {
    return (
      <section className="step">
        <h2>Pas encore de diagnostic</h2>
        <div className="row mt2">
          <Link href="/onboarding" className="btn btn-primary btn-block">
            Faire le test →
          </Link>
        </div>
      </section>
    );
  }

  const top = score(answers, QUESTIONS, PROFILES).profiles[0];
  const rems = remediesForProfile(top.id).filter((r) => r.type === tab);
  const proto = top.name.replace(/^L[ae'] /, "").toLowerCase();

  function restart() {
    reset();
    router.push("/");
  }

  return (
    <section className="step">
      <div className="eyebrow">Votre ordonnance</div>
      <div className="card rx">
        <div className="rxhead">
          <span className="sym">℞</span>
          <div className="pic">
            <Monster id={top.id} />
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Protocole anti-{proto}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Monstre : {top.name}
            </div>
          </div>
        </div>
        <div className="tabs">
          <button
            className="tab"
            aria-selected={tab === "individuel"}
            onClick={() => setTab("individuel")}
          >
            🙋 Pour vous
          </button>
          <button
            className="tab"
            aria-selected={tab === "collectif"}
            onClick={() => setTab("collectif")}
          >
            🏢 Pour l'organisation
          </button>
        </div>
        <div className="rxlist">
          {rems.map((r) => (
            <div key={r.id} className="rem">
              <div className="pri">{r.priority}</div>
              <div>
                <div className="rt">{r.title}</div>
                <div className="rd">{r.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="note">
        Posologie : à adapter à votre situation réelle. En cas de souffrance au
        travail, parlez-en à la médecine du travail ou à un professionnel de
        santé.
      </p>
      <div className="row mt">
        <Link href="/resultats" className="btn">
          ← Résultats
        </Link>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={restart}>
          ↻ Refaire le test
        </button>
      </div>
    </section>
  );
}
