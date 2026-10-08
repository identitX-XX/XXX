"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Monster from "@/components/Monster";
import { QUESTIONS, PROFILES } from "@/content";
import { AXIS_TAG, RESSOURCES } from "@/content/ui";
import { score, levelInfo, graveTriggered } from "@/lib/scoring";
import { LEVELS } from "@/lib/scoring.config";
import { isSupabaseConfigured } from "@/lib/supabaseBrowser";
import { submitResponse, fetchSectorAggregate } from "@/lib/responses";
import { useToxStore } from "@/store/useToxStore";
import { useMounted } from "@/lib/useMounted";
import { AXIS_SHORT } from "@/types";

const toxVar = (level: number) => `var(--tox-${level})`;

export default function ResultatsPage() {
  const router = useRouter();
  const mounted = useMounted();
  const answers = useToxStore((s) => s.answers);
  const reset = useToxStore((s) => s.reset);
  const sessionId = useToxStore((s) => s.sessionId);
  const context = useToxStore((s) => s.context);
  const orgCode = useToxStore((s) => s.orgCode);
  const teamCode = useToxStore((s) => s.teamCode);
  const lastSubmittedId = useToxStore((s) => s.lastSubmittedId);
  const markSubmitted = useToxStore((s) => s.markSubmitted);
  const [saved, setSaved] = useState(false);
  const [bench, setBench] = useState<{ n: number; avg_global: number } | null>(
    null
  );

  // Envoi anonyme unique par session (si Supabase est configuré).
  useEffect(() => {
    if (!mounted) return;
    if (Object.keys(answers).length === 0) return;
    if (!isSupabaseConfigured()) return;
    if (lastSubmittedId === sessionId) {
      setSaved(true);
      return;
    }
    let active = true;
    submitResponse({ sessionId, answers, context, orgCode, teamCode }).then(
      (r) => {
        if (!active) return;
        if (r.ok) {
          markSubmitted(sessionId);
          setSaved(true);
        }
      }
    );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, sessionId]);

  // Benchmark secteur (une fois la réponse comptée).
  useEffect(() => {
    if (!saved || !context.secteur || !isSupabaseConfigured()) return;
    let active = true;
    fetchSectorAggregate(context.secteur).then((r) => {
      if (active && r.data) setBench(r.data);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  if (!mounted) return null;

  if (Object.keys(answers).length === 0) {
    return (
      <section className="step">
        <h2>Pas encore de réponses</h2>
        <p className="lead" style={{ marginTop: 8 }}>
          Faites le test pour découvrir votre diagnostic.
        </p>
        <div className="row mt2">
          <Link href="/onboarding" className="btn btn-primary btn-block">
            Faire le test →
          </Link>
        </div>
      </section>
    );
  }

  const result = score(answers, QUESTIONS, PROFILES);
  const { global: g, level: lvl, axes, profiles: profs } = result;
  const li = levelInfo(lvl);
  const top = profs[0];
  const redAxes = axes.filter((a) => a.level >= 4);
  const showSafety = lvl >= 5 || graveTriggered(answers, QUESTIONS);

  function restart() {
    reset();
    router.push("/");
  }

  return (
    <section className="step">
      <div className="eyebrow">Votre diagnostic</div>
      <div className="gauge">
        {LEVELS.map((l) => {
          const on = l.level <= lvl;
          return (
            <i
              key={l.level}
              className={`${on ? "on" : ""} ${l.level === lvl ? "cur" : ""}`}
              style={on ? { background: toxVar(l.level) } : undefined}
            >
              {l.level}
            </i>
          );
        })}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div className="lv">
          Niveau {lvl}/6 · score{" "}
          <span className="score" style={{ color: toxVar(lvl) }}>
            {g}/100
          </span>
        </div>
        <div className="nm" style={{ color: toxVar(lvl) }}>
          {li.emoji} {li.name}
        </div>
        <p className="lead" style={{ fontSize: 14.5, margin: "6px 0 0" }}>
          {li.summary}
        </p>
      </div>

      {showSafety && (
        <div
          className="card safety"
          style={{ borderLeftColor: toxVar(Math.max(lvl, 5)) }}
        >
          <div className="st">Avant tout, votre sécurité</div>
          <div className="sd">{RESSOURCES}</div>
        </div>
      )}

      <h2 style={{ marginTop: 28 }}>Votre monstre dominant</h2>
      <div className="hero-monster">
        <div className="pic">
          <Monster id={top.id} />
        </div>
        <div>
          <div className="nm" style={{ fontSize: 26 }}>
            {top.name}
          </div>
          <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: 13 }}>
            {top.tagline}
          </div>
          <div>
            {redAxes.length ? (
              redAxes.map((a) => (
                <span
                  key={a.axis}
                  className="tybadge"
                  style={{ borderColor: toxVar(a.level), color: toxVar(a.level) }}
                >
                  {AXIS_TAG[a.axis]}
                </span>
              ))
            ) : (
              <span className="tybadge">Aucun axe critique 🎉</span>
            )}
          </div>
        </div>
      </div>
      <p className="lead" style={{ fontSize: 14.5, marginTop: 12 }}>
        {top.description}
      </p>

      <h2 style={{ marginTop: 28 }}>D'où vient la toxicité</h2>
      {axes.map((a) => (
        <div key={a.axis} className="axis">
          <div className="al">
            <b>{AXIS_SHORT[a.axis]}</b>
            <span className="an">
              niv. {a.level} · {a.score}/100
            </span>
          </div>
          <div className="bar">
            <i style={{ width: `${a.score}%`, background: toxVar(a.level) }} />
          </div>
        </div>
      ))}

      {bench && (
        <>
          <h2 style={{ marginTop: 28 }}>Face à votre secteur</h2>
          <div className="card" style={{ padding: 16, marginTop: 14 }}>
            <p style={{ margin: 0, fontSize: 14.5 }}>
              Votre organisation :{" "}
              <b style={{ color: toxVar(lvl) }}>{g}/100</b>. Moyenne du secteur{" "}
              « {context.secteur} » :{" "}
              <b>{bench.avg_global}/100</b>{" "}
              <span style={{ color: "var(--muted)" }}>
                ({bench.n} réponses).
              </span>
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted)" }}>
              {g > bench.avg_global
                ? `Soit ${Math.round((g - bench.avg_global) * 10) / 10} points de plus que la moyenne du secteur.`
                : g < bench.avg_global
                  ? `Soit ${Math.round((bench.avg_global - g) * 10) / 10} points de moins que la moyenne du secteur.`
                  : "Pile dans la moyenne de votre secteur."}
            </p>
          </div>
        </>
      )}

      {profs.length > 1 && (
        <>
          <h2 style={{ marginTop: 28 }}>Aussi repérés dans les parages</h2>
          {profs.slice(1).map((p) => (
            <div key={p.id} className="card pcard">
              <div className="pic">
                <Monster id={p.id} />
              </div>
              <div>
                <span className="tag">Aussi présent</span>
                <div className="pn" style={{ marginTop: 5 }}>
                  {p.name}
                </div>
                <div className="pt">{p.tagline}</div>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="row mt2">
        <Link href="/ordonnance" className="btn btn-primary btn-block">
          Mon ordonnance 💊 →
        </Link>
      </div>
      <div className="row mt">
        <Link href="/rapport" className="btn btn-block">
          📄 Mon rapport imprimable (PDF)
        </Link>
      </div>
      <div className="row mt center" style={{ justifyContent: "center" }}>
        <button className="btn" onClick={restart}>
          ↻ Refaire le test
        </button>
      </div>
      {saved && (
        <p className="note">
          ✓ Réponse enregistrée anonymement pour l'agrégation — aucune donnée
          identifiante.
        </p>
      )}
    </section>
  );
}
