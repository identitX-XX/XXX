"use client";

// Rapport analytique — LE lieu qui cartographie tout ce que la progression a
// produit (signature, son évolution, sphères, cohérence, émotions, directions,
// climat) ET qui s'exporte : impression / PDF + téléchargement d'un document
// autonome. Tout est calculé localement, à partir de tes observations.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Printer, ArrowRight } from "lucide-react";
import { PageHead } from "@/components/ui";
import { useStore } from "@/store/useStore";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import {
  progression,
  momentum,
  topArchetypes,
  archetypeDominant,
  equilibreSpheres,
  courbeEvolution,
  coherenceCourante,
  heatmapEmotions,
} from "@/parcours-archetypes/indicateurs";
import { detecterChapitres, derniereBascule } from "@/parcours-archetypes/bascules";
import { climatIndex, climatLabel } from "@/parcours-archetypes/climat";

function useRapport() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const etat = useParcoursStore((s) => s.etat);
  const climat = useParcoursStore((s) => s.climat);
  const profile = useStore((s) => s.profile);

  try {
    const prog = progression(etat);
    const mo = momentum(etat);
    const dom = archetypeDominant(etat);
    const top = topArchetypes(etat, 6).filter((t) => t.valeur > 0);
    const spheres = equilibreSpheres(etat);
    const evo = courbeEvolution(etat);
    const coh = coherenceCourante(etat);
    const emos = heatmapEmotions(etat)
      .filter((e) => e.compte > 0)
      .sort((a, b) => b.compte - a.compte)
      .slice(0, 6);
    const bascule = derniereBascule(detecterChapitres(etat.historique));
    const cohStats = evo.length
      ? {
          min: Math.min(...evo.map((e) => e.coherence)),
          max: Math.max(...evo.map((e) => e.coherence)),
          moy: Math.round(evo.reduce((s, e) => s + e.coherence, 0) / evo.length),
        }
      : null;
    const climJours = Object.values(climat ?? {});
    const climMoy = climJours.length
      ? Math.round(
          climJours.reduce((s, c) => s + climatIndex(c), 0) / climJours.length
        )
      : null;

    return {
      ok: true as const,
      prenom: profile?.name?.trim() || "Exploratrice",
      diagnostic,
      objectifs,
      prog,
      mo,
      dom,
      top,
      spheres,
      evo,
      coh,
      emos,
      bascule,
      cohStats,
      climMoy,
    };
  } catch {
    return { ok: false as const };
  }
}

type Rapport = Extract<ReturnType<typeof useRapport>, { ok: true }>;

export default function RapportAnalytiquePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const r = useRapport();

  if (!mounted) return null;

  if (!r.ok || !r.diagnostic) {
    return (
      <div>
        <PageHead
          eyebrow="Rapport analytique"
          title="Ton rapport se construit avec ta quête"
          sub="Dès que tu as révélé ta signature et vécu quelques jours, ce rapport se remplit — et devient exportable."
        />
        <Link
          href="/parcours-signatures"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          Commencer ma quête <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const telecharger = () => {
    try {
      const html = construireHTML(r);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `identitx-rapport-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {}
  };

  const domNom = r.dom ? r.dom.name : archetypeByKey[r.diagnostic.dominant].name;

  return (
    <div className="rapport-print">
      <style>{`@media print {
        header, nav, .no-print { display: none !important; }
        body { background: #fff !important; }
        .rapport-print, .rapport-print * { color: #16141a !important; }
        .rapport-card { border-color: #e5e2df !important; background: #fff !important; box-shadow: none !important; }
        .rapport-bar-bg { background: #eee !important; }
      }`}</style>

      <PageHead
        eyebrow="Rapport analytique"
        title="Ce que ta progression révèle"
        sub={`${r.prenom} · ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} · ${r.prog.faits} jour${r.prog.faits > 1 ? "s" : ""} vécu${r.prog.faits > 1 ? "s" : ""} sur 30`}
      />

      {/* Actions d'export */}
      <div className="no-print mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Printer size={16} /> Imprimer / PDF
        </button>
        <button
          onClick={telecharger}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-fuchsia hover:text-fuchsia"
        >
          <Download size={16} /> Télécharger (.html)
        </button>
      </div>

      <div className="grid gap-6">
        {/* 1 — Signature */}
        <Bloc titre="Ta signature">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Dominante" valeur={archetypeByKey[r.diagnostic.dominant].name} />
            <Stat label="Secondaire" valeur={archetypeByKey[r.diagnostic.secondaire].name} />
            <Stat label="Signature du moment" valeur={domNom} accent />
          </div>
          {r.bascule && (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              <b className="text-ink">Évolution détectée :</b> de{" "}
              {archetypeByKey[r.bascule.depuis].name} vers{" "}
              <span className="text-fuchsia">{archetypeByKey[r.bascule.vers].name}</span>.
              Ta signature n'est pas figée — elle s'est déplacée au fil de tes observations.
            </p>
          )}
        </Bloc>

        {/* 2 — Cartographie des signatures actives */}
        {r.top.length > 0 && (
          <Bloc titre="Cartographie des signatures actives">
            <p className="mb-4 text-sm text-muted">
              Les dynamiques les plus présentes dans tes observations, du plus au moins actif.
            </p>
            <div className="grid gap-2.5">
              {r.top.map((t) => (
                <Barre key={t.key} label={t.name} valeur={t.valeur} max={r.top[0].valeur} />
              ))}
            </div>
          </Bloc>
        )}

        {/* 3 — Équilibre des sphères */}
        <Bloc titre="Équilibre des sphères de vie">
          <div className="grid gap-2.5">
            {r.spheres.map((s) => (
              <Barre key={s.key} label={s.label} valeur={s.part} suffixe="%" max={100} />
            ))}
          </div>
        </Bloc>

        {/* 4 — Cohérence */}
        <Bloc titre="Cohérence identitaire">
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Actuelle" valeur={`${r.coh}`} accent />
            {r.cohStats && <Stat label="Moyenne" valeur={`${r.cohStats.moy}`} />}
            {r.cohStats && <Stat label="Minimum" valeur={`${r.cohStats.min}`} />}
            {r.cohStats && <Stat label="Maximum" valeur={`${r.cohStats.max}`} />}
          </div>
          {r.evo.length > 1 && <Sparkline points={r.evo.map((e) => e.coherence)} />}
        </Bloc>

        {/* 5 — Émotions */}
        {r.emos.length > 0 && (
          <Bloc titre="Émotions marquantes">
            <div className="flex flex-wrap gap-2">
              {r.emos.map((e) => (
                <span
                  key={e.key}
                  className="rounded-full border border-line px-3 py-1.5 text-sm text-ink"
                >
                  {e.label} <span className="text-muted">· {e.compte}×</span>
                </span>
              ))}
            </div>
          </Bloc>
        )}

        {/* 6 — Directions */}
        {r.objectifs && (
          <Bloc titre="Tes directions par périmètre">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Perso" valeur={r.objectifs.perso || "—"} />
              <Stat label="Pro" valeur={r.objectifs.pro || "—"} />
              <Stat label="Relationnel" valeur={r.objectifs.relationnel || "—"} />
            </div>
          </Bloc>
        )}

        {/* 7 — Climat */}
        {r.climMoy != null && (
          <Bloc titre="Climat & corps">
            <p className="text-sm text-muted">
              Ton terrain moyen sur la période : <b className="text-ink">{climatLabel(r.climMoy)}</b>.
              Utile pour remettre tes journées en contexte — jamais un diagnostic médical.
            </p>
          </Bloc>
        )}
      </div>

      <p className="no-print mt-8 text-xs italic leading-relaxed text-muted">
        Rapport généré localement à partir de tes observations. Tes données restent sur ton appareil.
      </p>
    </div>
  );
}

// ── Blocs d'affichage ────────────────────────────────────────────────────────
function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rapport-card rounded-2xl border border-line bg-surface p-6 shadow-soft">
      <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia">{titre}</h2>
      {children}
    </section>
  );
}

function Stat({ label, valeur, accent }: { label: string; valeur: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line p-3.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className={`mt-1 text-base font-semibold leading-snug ${accent ? "text-fuchsia" : "text-ink"}`}>
        {valeur}
      </div>
    </div>
  );
}

function Barre({
  label,
  valeur,
  max,
  suffixe = "",
}: {
  label: string;
  valeur: number;
  max: number;
  suffixe?: string;
}) {
  const pct = max > 0 ? Math.round((valeur / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-ink">{label}</span>
        <span className="tnum text-muted">
          {valeur}
          {suffixe}
        </span>
      </div>
      <div className="rapport-bar-bg h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full brand-gradient" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 320;
  const h = 60;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="mt-4" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="var(--fuchsia)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Export : document HTML autonome (léger, imprimable) ──────────────────────
function construireHTML(r: Rapport): string {
  const esc = (s: string) =>
    (s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
  const nom = (k: string) => esc(archetypeByKey[k]?.name ?? k);
  const domNom = r.dom ? esc(r.dom.name) : nom(r.diagnostic!.dominant);
  const date = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const barre = (label: string, valeur: number, max: number, suf = "") => {
    const pct = max > 0 ? Math.round((valeur / max) * 100) : 0;
    return `<div class="row"><div class="rowhead"><span>${esc(label)}</span><span>${valeur}${suf}</span></div><div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`;
  };

  const sig = `<section><h2>Ta signature</h2><table><tr><td>Dominante</td><td><b>${nom(r.diagnostic!.dominant)}</b></td></tr><tr><td>Secondaire</td><td>${nom(r.diagnostic!.secondaire)}</td></tr><tr><td>Signature du moment</td><td><b>${domNom}</b></td></tr></table>${
    r.bascule
      ? `<p><b>Évolution détectée :</b> de ${nom(r.bascule.depuis)} vers ${nom(r.bascule.vers)}.</p>`
      : ""
  }</section>`;

  const carto = r.top.length
    ? `<section><h2>Cartographie des signatures actives</h2>${r.top
        .map((t) => barre(t.name, t.valeur, r.top[0].valeur))
        .join("")}</section>`
    : "";

  const sph = `<section><h2>Équilibre des sphères de vie</h2>${r.spheres
    .map((s) => barre(s.label, s.part, 100, "%"))
    .join("")}</section>`;

  const coh = `<section><h2>Cohérence identitaire</h2><table><tr><td>Actuelle</td><td><b>${r.coh}</b></td></tr>${
    r.cohStats
      ? `<tr><td>Moyenne</td><td>${r.cohStats.moy}</td></tr><tr><td>Min / Max</td><td>${r.cohStats.min} / ${r.cohStats.max}</td></tr>`
      : ""
  }</table></section>`;

  const emo = r.emos.length
    ? `<section><h2>Émotions marquantes</h2><p>${r.emos
        .map((e) => `${esc(e.label)} (${e.compte}×)`)
        .join(" · ")}</p></section>`
    : "";

  const dir = r.objectifs
    ? `<section><h2>Tes directions par périmètre</h2><table><tr><td>Perso</td><td>${esc(r.objectifs.perso || "—")}</td></tr><tr><td>Pro</td><td>${esc(r.objectifs.pro || "—")}</td></tr><tr><td>Relationnel</td><td>${esc(r.objectifs.relationnel || "—")}</td></tr></table></section>`
    : "";

  const clim = r.climMoy != null ? `<section><h2>Climat & corps</h2><p>Terrain moyen : <b>${esc(climatLabel(r.climMoy))}</b>.</p></section>` : "";

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IdentitX — Rapport analytique</title><style>
    :root{--or:#a8834a}
    *{box-sizing:border-box}
    body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#16141a;background:#fff;margin:0;padding:32px 20px;line-height:1.55;max-width:720px;margin:0 auto}
    header{border-bottom:2px solid var(--or);padding-bottom:16px;margin-bottom:24px}
    .eyebrow{text-transform:uppercase;letter-spacing:.2em;font-size:11px;font-weight:700;color:var(--or)}
    h1{font-size:26px;margin:6px 0 4px}
    .meta{color:#6b6455;font-size:14px}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:var(--or);margin:0 0 12px}
    section{border:1px solid #e5e2df;border-radius:14px;padding:18px;margin-bottom:16px}
    table{width:100%;border-collapse:collapse;font-size:15px}
    td{padding:6px 0;border-bottom:1px solid #f0eeeb}
    td:first-child{color:#6b6455;width:45%}
    .row{margin:8px 0}
    .rowhead{display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px}
    .track{height:8px;background:#eee;border-radius:99px;overflow:hidden}
    .fill{height:100%;background:var(--or);border-radius:99px}
    p{font-size:14px}
    footer{color:#9a948a;font-size:12px;font-style:italic;margin-top:20px}
  </style></head><body>
  <header><div class="eyebrow">Rapport analytique · IdentitX</div><h1>Ce que ta progression révèle</h1><div class="meta">${esc(r.prenom)} · ${date} · ${r.prog.faits} jour(s) sur 30</div></header>
  ${sig}${carto}${sph}${coh}${emo}${dir}${clim}
  <footer>Rapport généré localement à partir de tes observations. Tes données restent sur ton appareil.</footer>
  </body></html>`;
}
