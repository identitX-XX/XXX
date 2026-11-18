"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabaseBrowser";
import {
  fetchOrgAggregate,
  fetchTeamAggregate,
  type Aggregate,
} from "@/lib/responses";
import { scoreToLevel, levelInfo } from "@/lib/scoring";
import { MIN_RESPONSES_ANY, MIN_RESPONSES_TEAM } from "@/lib/scoring.config";
import { AXIS_SHORT } from "@/types";

const toxVar = (level: number) => `var(--tox-${level})`;

type Scope = "org" | "team";

export default function DashboardPage() {
  const [org, setOrg] = useState("");
  const [team, setTeam] = useState("");
  const [scope, setScope] = useState<Scope>("org");
  const [data, setData] = useState<Aggregate | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "empty" | "ok" | "error" | "off"
  >("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("org")) setOrg(p.get("org")!);
    if (p.get("team")) {
      setTeam(p.get("team")!);
      setScope("team");
    }
  }, []);

  async function run() {
    if (!isSupabaseConfigured()) {
      setStatus("off");
      return;
    }
    if (!org.trim()) return;
    setStatus("loading");
    setData(null);
    const res =
      scope === "team"
        ? await fetchTeamAggregate(org.trim(), team.trim())
        : await fetchOrgAggregate(org.trim());
    if (!res.ok) {
      setErrMsg(res.reason ?? "Erreur");
      setStatus("error");
      return;
    }
    if (!res.data) {
      setStatus("empty");
      return;
    }
    setData(res.data);
    setStatus("ok");
  }

  const seuil = scope === "team" ? MIN_RESPONSES_TEAM : MIN_RESPONSES_ANY;

  return (
    <section className="step">
      <div className="eyebrow">Version entreprise</div>
      <h1 style={{ fontSize: 30 }}>Tableau de bord agrégé</h1>
      <p className="lead" style={{ marginTop: 8 }}>
        Résultats <b>agrégés uniquement</b>, jamais individuels. Rien ne s'affiche
        sous {MIN_RESPONSES_ANY} réponses (organisation) ou {MIN_RESPONSES_TEAM}{" "}
        réponses (équipe).
      </p>

      <div className="card" style={{ padding: 16, marginTop: 18 }}>
        <div className="tabs" style={{ padding: 0, marginBottom: 12 }}>
          <button
            className="tab"
            aria-selected={scope === "org"}
            onClick={() => setScope("org")}
          >
            Organisation
          </button>
          <button
            className="tab"
            aria-selected={scope === "team"}
            onClick={() => setScope("team")}
          >
            Équipe
          </button>
        </div>

        <label className="field" style={{ marginTop: 0 }}>
          <span style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
            Code organisation
          </span>
          <input
            className="inp"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="ex. ACME-2026"
          />
        </label>

        {scope === "team" && (
          <label className="field">
            <span style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
              Code équipe
            </span>
            <input
              className="inp"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="ex. SUPPORT-N1"
            />
          </label>
        )}

        <div className="row mt">
          <button
            className="btn btn-primary btn-block"
            onClick={run}
            disabled={!org.trim() || (scope === "team" && !team.trim())}
          >
            Voir l'agrégat
          </button>
        </div>
      </div>

      {status === "off" && (
        <p className="note">
          Supabase n'est pas configuré (variables d'environnement manquantes).
          L'app fonctionne en local-first ; le dashboard nécessite la base.
        </p>
      )}
      {status === "loading" && <p className="note">Chargement…</p>}
      {status === "error" && <p className="note">Erreur : {errMsg}</p>}
      {status === "empty" && (
        <div className="card safety" style={{ borderLeftColor: "var(--accent)", marginTop: 18 }}>
          <div className="st">Pas encore assez de réponses</div>
          <div className="sd">
            Il faut au moins {seuil} réponses pour afficher un agrégat. C'est la
            garantie d'anonymat : en dessous, on pourrait deviner qui a répondu
            quoi.
          </div>
        </div>
      )}

      {status === "ok" && data && (
        <Aggregated data={data} />
      )}
    </section>
  );
}

function Aggregated({ data }: { data: Aggregate }) {
  const lvl = scoreToLevel(data.avg_global);
  const li = levelInfo(lvl);
  const rows: { label: string; score: number }[] = [
    { label: AXIS_SHORT.ascendante, score: data.avg_ascendante },
    { label: AXIS_SHORT.descendante, score: data.avg_descendante },
    { label: AXIS_SHORT.laterale, score: data.avg_laterale },
  ];
  return (
    <div style={{ marginTop: 22 }}>
      <div className="card" style={{ padding: 16 }}>
        <div className="lv">
          {data.n} réponses · score moyen{" "}
          <span className="score" style={{ color: toxVar(lvl) }}>
            {data.avg_global}/100
          </span>
        </div>
        <div className="nm" style={{ color: toxVar(lvl) }}>
          {li.emoji} {li.name}
        </div>
      </div>
      <h2 style={{ marginTop: 24 }}>Par axe</h2>
      {rows.map((r) => {
        const l = scoreToLevel(r.score);
        return (
          <div key={r.label} className="axis">
            <div className="al">
              <b>{r.label}</b>
              <span className="an">
                niv. {l} · {r.score}/100
              </span>
            </div>
            <div className="bar">
              <i style={{ width: `${r.score}%`, background: toxVar(l) }} />
            </div>
          </div>
        );
      })}
      <p className="note">
        Priorité d'action : l'axe au score le plus élevé. Croisez avec
        l'ordonnance collective correspondante.
      </p>
    </div>
  );
}
