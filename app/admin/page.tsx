"use client";

// Tableau de bord de l'éditrice (non listé dans la navigation). Lecture des
// métriques réelles : inscriptions, activation, usage, rétention par cohorte.
// Protégé par une clé (ADMIN_KEY), mémorisée localement. Design Nuit & Or,
// tuiles de KPI (nombres-héros) + table de rétention — pas de graphe superflu.

import { useEffect, useState } from "react";
import { PageHead } from "@/components/ui";

const KEY_LS = "idx-admin-key";

interface Metrics {
  ok: boolean;
  configured?: boolean;
  kpis?: { users: number; opens: number; scenarios: number; feedback: number; consentsOui: number };
  retention?: { cohorte: string; taille: number; j1: number; j7: number; j30: number }[];
}

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
    setLoading(true);
    setErr("");
    fetch(`/api/metrics?key=${encodeURIComponent(saved)}`)
      .then((r) => r.json())
      .then((d: Metrics) => {
        if (!d.ok) setErr("Clé refusée.");
        else setData(d);
      })
      .catch(() => setErr("Réseau indisponible."))
      .finally(() => setLoading(false));
  }, [saved]);

  const connect = () => {
    const k = key.trim();
    if (!k) return;
    try { localStorage.setItem(KEY_LS, k); } catch {}
    setSaved(k);
  };

  if (!saved || err) {
    return (
      <div>
        <PageHead eyebrow="Éditrice" title="Tableau de bord" sub="Accès réservé. Entre ta clé d'administration." />
        <div className="flex max-w-sm gap-2">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connect()}
            placeholder="Clé d'admin"
            className="flex-1 rounded-xl border border-line bg-noir px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-fuchsia"
          />
          <button onClick={connect} className="rounded-xl brand-gradient px-5 text-sm font-medium text-white">
            Entrer
          </button>
        </div>
        {err && <p className="mt-3 text-sm text-orange">{err}</p>}
      </div>
    );
  }

  const k = data?.kpis;

  return (
    <div>
      <PageHead
        eyebrow="Éditrice"
        title="Tableau de bord"
        sub="Métriques réelles de la phase de test — anonymes et agrégées."
      />

      {loading && <p className="text-sm text-muted">Chargement…</p>}

      {data && data.configured === false && (
        <p className="text-sm text-muted">
          Backend non configuré (SUPABASE_URL / clé absente) — aucune donnée à afficher.
        </p>
      )}

      {k && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Tile label="Testeuses" value={k.users} sub="emails reliés" />
            <Tile label="Ouvertures" value={k.opens} sub="app ouverte" />
            <Tile label="Scénarios" value={k.scenarios} sub="générés" />
            <Tile label="Retours" value={k.feedback} sub="feedback libre" />
            <Tile label="Consentements" value={k.consentsOui} sub="accordés" />
          </div>

          <div className="mt-8">
            <div className="mb-3 text-xs uppercase tracking-[0.16em] text-fuchsia">
              Rétention par cohorte
            </div>
            {data?.retention && data.retention.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                      <th className="px-4 py-3 font-medium">Cohorte</th>
                      <th className="px-4 py-3 font-medium">Taille</th>
                      <th className="px-4 py-3 font-medium">J1</th>
                      <th className="px-4 py-3 font-medium">J7</th>
                      <th className="px-4 py-3 font-medium">J30</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.retention.map((r) => (
                      <tr key={r.cohorte} className="border-b border-line/60 last:border-0">
                        <td className="px-4 py-3 text-ink">{r.cohorte}</td>
                        <td className="px-4 py-3 text-muted">{r.taille}</td>
                        <td className="px-4 py-3 text-muted">{pct(r.j1, r.taille)}</td>
                        <td className="px-4 py-3 text-muted">{pct(r.j7, r.taille)}</td>
                        <td className="px-4 py-3 text-muted">{pct(r.j30, r.taille)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted">
                Pas encore de cohorte — la rétention apparaîtra dès quelques jours d'usage.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="text-xs uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-1 font-display text-3xl font-light text-ink">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted">{sub}</div>
    </div>
  );
}

function pct(n: number, total: number): string {
  if (!total) return "—";
  return `${n} · ${Math.round((n / total) * 100)}%`;
}
