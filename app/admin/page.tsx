"use client";

// Tableau de bord de pilotage (éditrice) — niveau « levée de fonds » : les
// métriques qui prouvent la traction. Hero KPI + entonnoir d'activation (AARRR)
// + rétention par cohorte + croissance. Non listé, protégé par ADMIN_KEY.
// Dataviz : un seul accent (or), texte en tokens d'encre, marques fines, labels
// directs, axes discrets — pas de graphe superflu, pas de palette catégorielle.

import { useEffect, useState } from "react";
import { PageHead } from "@/components/ui";

const KEY_LS = "idx-admin-key";

interface Funnel {
  inscrites: number; ouvertures: number; onboardees: number;
  archetype: number; cap_pose: number; scenarios: number;
}
interface Retention { cohorte: string; taille: number; j1: number; j7: number; j30: number }
interface Engagement { page: string; visites: number; visiteuses: number; temps_moyen_s: number }
interface Metrics {
  ok: boolean;
  configured?: boolean;
  kpis?: { users: number; opens: number; scenarios: number; feedback: number; consentsOui: number };
  funnel?: Funnel | null;
  growth?: { jour: string; nb: number }[];
  retention?: Retention[];
  engagement?: Engagement[];
}

// Nom lisible d'un module à partir de sa route.
const MODULE_LABEL: Record<string, string> = {
  "/aujourdhui": "Aujourd'hui", "/parcours-signatures": "Ma quête", "/scenarios": "Scénarios",
  "/coach": "Coach", "/explorer": "Explorer", "/synthese": "Ton portrait",
  "/quete": "La Quête", "/progression": "Progression", "/ressources": "Ressources",
  "/settings": "Réglages", "/confidentialite": "Confidentialité", "/cgu": "CGU",
};
const moduleName = (p: string) => MODULE_LABEL[p] ?? p;
const dureeCourt = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`);

const ACCENT = "var(--fuchsia)";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [data, setData] = useState<Metrics | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const k = localStorage.getItem(KEY_LS);
      if (k) { setSaved(k); setKey(k); }
    } catch {}
  }, []);

  useEffect(() => {
    if (!saved) return;
    setLoading(true); setErr("");
    fetch(`/api/metrics?key=${encodeURIComponent(saved)}`)
      .then((r) => r.json())
      .then((d: Metrics) => { if (!d.ok) setErr("Clé refusée."); else setData(d); })
      .catch(() => setErr("Réseau indisponible."))
      .finally(() => setLoading(false));
  }, [saved]);

  const connect = () => {
    const k = key.trim(); if (!k) return;
    try { localStorage.setItem(KEY_LS, k); } catch {}
    setSaved(k);
  };

  if (!saved || err) {
    return (
      <div>
        <PageHead eyebrow="Pilotage" title="Tableau de bord" sub="Accès réservé. Entre ta clé d'administration." />
        <div className="flex max-w-sm gap-2">
          <input
            type="password" value={key} onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connect()}
            placeholder="Clé d'admin"
            className="flex-1 rounded-xl border border-line bg-noir px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-fuchsia"
          />
          <button onClick={connect} className="rounded-xl brand-gradient px-5 text-sm font-medium text-white">Entrer</button>
        </div>
        {err && <p className="mt-3 text-sm text-orange">{err}</p>}
      </div>
    );
  }

  const k = data?.kpis;
  const f = data?.funnel ?? null;
  const ret = data?.retention ?? [];

  // Agrégats de rétention (toutes cohortes) — le chiffre que lisent les VCs.
  const taille = ret.reduce((s, r) => s + (r.taille || 0), 0);
  const rate = (sel: (r: Retention) => number) =>
    taille ? Math.round((ret.reduce((s, r) => s + (sel(r) || 0), 0) / taille) * 100) : 0;
  const j1 = rate((r) => r.j1), j7 = rate((r) => r.j7), j30 = rate((r) => r.j30);

  // Activation = a révélé son archétype parmi celles qui ont ouvert l'app.
  const activation = f && f.ouvertures ? Math.round((f.archetype / f.ouvertures) * 100) : 0;

  return (
    <div>
      <PageHead
        eyebrow="Pilotage"
        title="Traction — phase de test"
        sub="Métriques réelles, anonymes et agrégées. De l'acquisition au scénario généré."
      />
      {loading && <p className="text-sm text-muted">Chargement…</p>}
      {data?.configured === false && (
        <p className="text-sm text-muted">Backend non configuré — aucune donnée. (Pose SUPABASE_URL + clé, et relance schema.sql.)</p>
      )}

      {k && (
        <div className="flex flex-col gap-8">
          {/* Hero KPI */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Hero label="Testeuses" value={k.users} sub="emails reliés" />
            <Hero label="Activation" value={`${activation}%`} sub="signature révélée / ouverture" accent />
            <Hero label="Rétention J7" value={`${j7}%`} sub={`sur ${taille} en cohorte`} />
            <Hero label="Scénarios" value={k.scenarios} sub="générés (valeur produite)" />
          </div>

          {/* Entonnoir d'activation */}
          <section>
            <SectionTitle>Entonnoir d'activation</SectionTitle>
            {f ? (
              <Funnel f={f} />
            ) : (
              <Empty>L'entonnoir se remplira dès les premières sessions (relance schema.sql pour créer la vue).</Empty>
            )}
          </section>

          {/* Rétention */}
          <section>
            <SectionTitle>Rétention par cohorte</SectionTitle>
            {taille > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <RetBar label="J1" pct={j1} />
                <RetBar label="J7" pct={j7} />
                <RetBar label="J30" pct={j30} />
              </div>
            ) : (
              <Empty>La rétention apparaîtra après quelques jours d'usage.</Empty>
            )}
          </section>

          {/* Croissance */}
          <section>
            <SectionTitle>Croissance des inscriptions</SectionTitle>
            {data?.growth && data.growth.length > 1 ? (
              <Growth points={data.growth} />
            ) : (
              <Empty>La courbe démarre dès les premières inscriptions.</Empty>
            )}
          </section>

          {/* Engagement par module : où passent-elles du temps (l'intérêt réel). */}
          <section>
            <SectionTitle>Engagement par module</SectionTitle>
            {data?.engagement && data.engagement.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                      <th className="px-4 py-3 font-medium">Module</th>
                      <th className="px-4 py-3 font-medium">Visites</th>
                      <th className="px-4 py-3 font-medium">Uniques</th>
                      <th className="px-4 py-3 font-medium">Temps moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.engagement.map((e) => (
                      <tr key={e.page} className="border-b border-line/60 last:border-0">
                        <td className="px-4 py-3 text-ink">{moduleName(e.page)}</td>
                        <td className="px-4 py-3 text-muted">{e.visites}</td>
                        <td className="px-4 py-3 text-muted">{e.visiteuses}</td>
                        <td className="px-4 py-3 text-muted">{e.temps_moyen_s ? dureeCourt(e.temps_moyen_s) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty>Visites et temps par module apparaîtront dès les premières navigations.</Empty>
            )}
          </section>

          <p className="text-xs text-muted">
            Retours libres reçus : <b className="text-ink">{k.feedback}</b> · Consentements accordés :{" "}
            <b className="text-ink">{k.consentsOui}</b>
          </p>
        </div>
      )}
    </div>
  );
}

function Hero({ label, value, sub, accent }: { label: string; value: number | string; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="text-xs uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-1 font-display text-4xl font-light" style={{ color: accent ? ACCENT : "var(--ink)" }}>
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-muted">{sub}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-xs uppercase tracking-[0.16em] text-fuchsia">{children}</div>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}

// Entonnoir : barres horizontales, largeur = part de la 1re étape ; label direct
// avec effectif et conversion vs l'étape précédente.
function Funnel({ f }: { f: Funnel }) {
  const stages = [
    { label: "Ouvertures", n: f.ouvertures },
    { label: "Onboardées", n: f.onboardees },
    { label: "Signature révélée", n: f.archetype },
    { label: "Cap posé", n: f.cap_pose },
    { label: "Scénario généré", n: f.scenarios },
  ];
  const base = stages[0].n || 1;
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="flex flex-col gap-3">
        {stages.map((s, i) => {
          const w = Math.max(2, Math.round((s.n / base) * 100));
          const convPrev = i > 0 && stages[i - 1].n ? Math.round((s.n / stages[i - 1].n) * 100) : null;
          return (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-32 flex-none text-right text-xs text-muted">{s.label}</div>
              <div className="h-7 flex-1 overflow-hidden rounded-md bg-line/60">
                <div
                  className="flex h-full items-center rounded-md px-2 text-xs font-medium text-noir"
                  style={{ width: `${w}%`, background: `linear-gradient(90deg, var(--fuchsia), var(--orange))`, minWidth: 34 }}
                >
                  {s.n}
                </div>
              </div>
              <div className="w-14 flex-none text-xs text-muted">
                {convPrev != null ? `${convPrev}%` : "—"}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Largeur = part des ouvertures · colonne de droite = conversion depuis l'étape précédente.
      </p>
    </div>
  );
}

function RetBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">{label}</span>
        <span className="font-display text-2xl font-light text-ink">{pct}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--fuchsia), var(--orange))" }} />
      </div>
    </div>
  );
}

// Courbe de croissance cumulée — sparkline SVG, une seule série (l'accent).
function Growth({ points }: { points: { jour: string; nb: number }[] }) {
  let cum = 0;
  const series = points.map((p) => ({ jour: p.jour, cum: (cum += p.nb) }));
  const max = series[series.length - 1].cum || 1;
  const W = 600, H = 120, pad = 6;
  const x = (i: number) => pad + (i / Math.max(1, series.length - 1)) * (W - 2 * pad);
  const y = (v: number) => H - pad - (v / max) * (H - 2 * pad);
  const d = series.map((s, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(s.cum).toFixed(1)}`).join(" ");
  const area = `${d} L ${x(series.length - 1).toFixed(1)} ${H - pad} L ${x(0).toFixed(1)} ${H - pad} Z`;
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-muted">Inscriptions cumulées</span>
        <span className="font-display text-2xl font-light text-ink">{max}</span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-label="Inscriptions cumulées dans le temps">
          <defs>
            <linearGradient id="gGrow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--fuchsia)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--fuchsia)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#gGrow)" />
          <path d={d} fill="none" stroke="var(--fuchsia)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
