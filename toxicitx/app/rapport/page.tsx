"use client";

import Link from "next/link";
import Monster from "@/components/Monster";
import { QUESTIONS, PROFILES, remediesForProfile } from "@/content";
import { AXIS_TAG, RESSOURCES } from "@/content/ui";
import { score, levelInfo, graveTriggered } from "@/lib/scoring";
import { useToxStore } from "@/store/useToxStore";
import { useMounted } from "@/lib/useMounted";
import { AXIS_SHORT } from "@/types";

const toxVar = (level: number) => `var(--tox-${level})`;

export default function RapportPage() {
  const mounted = useMounted();
  const answers = useToxStore((s) => s.answers);
  const context = useToxStore((s) => s.context);

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

  const { global: g, level: lvl, axes, profiles: profs } = score(
    answers,
    QUESTIONS,
    PROFILES
  );
  const li = levelInfo(lvl);
  const top = profs[0];
  const showSafety = lvl >= 5 || graveTriggered(answers, QUESTIONS);
  const individuels = remediesForProfile(top.id).filter((r) => r.type === "individuel");
  const collectifs = remediesForProfile(top.id).filter((r) => r.type === "collectif");
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ctxItems = [
    context.secteur && `Secteur : ${context.secteur}`,
    context.tailleEntreprise && `Taille : ${context.tailleEntreprise}`,
    context.niveauPoste && `Poste : ${context.niveauPoste}`,
    context.anciennete && `Ancienneté : ${context.anciennete}`,
    context.encadrement != null &&
      `Encadrement : ${context.encadrement ? "oui" : "non"}`,
  ].filter(Boolean) as string[];

  return (
    <section className="step">
      <div className="row no-print" style={{ justifyContent: "space-between" }}>
        <Link href="/resultats" className="btn">
          ← Résultats
        </Link>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Imprimer / enregistrer en PDF
        </button>
      </div>

      <div className="eyebrow" style={{ marginTop: 18 }}>
        Rapport ToxicitX · {date}
      </div>
      <h1 style={{ fontSize: 30 }}>Diagnostic de toxicité</h1>
      {ctxItems.length > 0 && (
        <p className="lead" style={{ fontSize: 14, marginTop: 4 }}>
          {ctxItems.join(" · ")}
        </p>
      )}

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div className="lv">
          Niveau {lvl}/6 · score{" "}
          <span className="score" style={{ color: toxVar(lvl) }}>
            {g}/100
          </span>
        </div>
        <div className="nm" style={{ color: toxVar(lvl) }}>
          {li.emoji} {li.name}
        </div>
        <p className="lead" style={{ fontSize: 14, margin: "6px 0 0" }}>
          {li.summary}
        </p>
      </div>

      {showSafety && (
        <div className="card safety" style={{ borderLeftColor: toxVar(Math.max(lvl, 5)) }}>
          <div className="st">Ressources</div>
          <div className="sd">{RESSOURCES}</div>
        </div>
      )}

      <h2 style={{ marginTop: 24 }}>Profil dominant</h2>
      <div className="pcard card">
        <div className="pic">
          <Monster id={top.id} />
        </div>
        <div>
          <div className="pn">{top.name}</div>
          <div className="pt">{top.tagline}</div>
          <div className="pd" style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
            {top.description}
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Scores par axe</h2>
      {axes.map((a) => (
        <div key={a.axis} className="axis">
          <div className="al">
            <b>
              {AXIS_SHORT[a.axis]}{" "}
              {a.level >= 4 && (
                <span className="tag" style={{ borderColor: toxVar(a.level), color: toxVar(a.level) }}>
                  {AXIS_TAG[a.axis]}
                </span>
              )}
            </b>
            <span className="an">
              niv. {a.level} · {a.score}/100
            </span>
          </div>
          <div className="bar">
            <i style={{ width: `${a.score}%`, background: toxVar(a.level) }} />
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Ordonnance — pour vous</h2>
      {individuels.map((r) => (
        <div key={r.id} className="rem">
          <div className="pri">{r.priority}</div>
          <div>
            <div className="rt">{r.title}</div>
            <div className="rd">{r.text}</div>
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Ordonnance — pour l'organisation</h2>
      {collectifs.map((r) => (
        <div key={r.id} className="rem">
          <div className="pri">{r.priority}</div>
          <div>
            <div className="rt">{r.title}</div>
            <div className="rd">{r.text}</div>
          </div>
        </div>
      ))}

      <p className="note">
        Rapport anonyme généré par ToxicitX. Ni diagnostic médical ni avis
        juridique.
      </p>
    </section>
  );
}
