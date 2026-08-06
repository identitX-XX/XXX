"use client";

// « Premier succès en 90 s » — la boucle quotidienne d'IdentitX en 5 temps :
// invitation → interaction légère (cartes) → micro-révélation → la carte qui
// s'éclaire → ouverture vers demain. Chaque passage produit une découverte, une
// connexion, ou une possibilité d'action. Léger, jamais un questionnaire.

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useBoucle } from "@/parcours-boucle/store";
import {
  facetteDuJour,
  reveler,
  DIMENSIONS,
  DimKey,
  Revelation,
} from "@/parcours-boucle/dimensions";
import { CarteBoucle } from "@/parcours-boucle/CarteBoucle";

type Etape = "invite" | "jeu" | "reveal" | "carte" | "ouverture";

export default function DecouvertePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const jours = useBoucle((s) => s.jours);
  const dimensions = useBoucle((s) => s.dimensions);
  const connexions = useBoucle((s) => s.connexions);
  const explorer = useBoucle((s) => s.explorer);

  const [etape, setEtape] = useState<Etape>("invite");
  const [sel, setSel] = useState<DimKey[]>([]);
  const [rev, setRev] = useState<Revelation | null>(null);

  if (!mounted) return null;

  const facette = facetteDuJour(jours);

  const toggle = (d: DimKey) =>
    setSel((s) =>
      s.includes(d) ? s.filter((x) => x !== d) : s.length >= 2 ? s : [...s, d]
    );

  const valider = () => {
    if (sel.length < 2) return;
    setRev(reveler(sel));
    explorer(facette.id, sel);
    setEtape("reveal");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center py-6">
      {/* Progression discrète du parcours (pas une barre de questionnaire) */}
      <div className="mb-8 flex items-center justify-center gap-1.5">
        {(["invite", "jeu", "reveal", "carte", "ouverture"] as Etape[]).map((e, i) => {
          const ordre = ["invite", "jeu", "reveal", "carte", "ouverture"];
          const actif = ordre.indexOf(etape) >= i;
          return (
            <span
              key={e}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: actif ? 26 : 14,
                background: actif ? "var(--fuchsia)" : "var(--line)",
              }}
            />
          );
        })}
      </div>

      {/* 1 — L'invitation */}
      {etape === "invite" && (
        <div className="animate-fade-up text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">
            {facette.eyebrow}
          </div>
          <h1 className="mx-auto mt-3 max-w-md font-display text-3xl font-bold leading-tight text-ink">
            {facette.invitation}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            Pas de questionnaire. Trois minutes, quelques cartes — et une première
            chose qui s'éclaire sur toi.
          </p>
          <button
            onClick={() => setEtape("jeu")}
            className="mt-8 inline-flex min-h-[3.25rem] items-center gap-2 rounded-full brand-gradient px-8 text-base font-semibold text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.02]"
          >
            Commencer — 3 min
            <ArrowRight size={17} />
          </button>
        </div>
      )}

      {/* 2 — L'interaction légère */}
      {etape === "jeu" && (
        <div className="animate-fade-up">
          <h2 className="font-display text-2xl font-bold leading-tight text-ink">
            {facette.question}
          </h2>
          <p className="mt-2 text-sm text-muted">Choisis-en deux — celles qui te ressemblent le plus.</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {facette.cartes.map((c) => {
              const on = sel.includes(c.dim);
              return (
                <button
                  key={c.dim}
                  onClick={() => toggle(c.dim)}
                  className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-[15px] font-semibold transition-all"
                  style={{
                    color: on ? "var(--noir)" : "var(--ink)",
                    background: on ? "var(--fuchsia)" : "var(--raised)",
                    borderColor: on ? "var(--fuchsia)" : "var(--line)",
                  }}
                >
                  {on && <Check size={15} />}
                  {c.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={valider}
            disabled={sel.length < 2}
            className="mt-8 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-[color:var(--on-brand)] transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
            style={{ background: "linear-gradient(90deg,var(--fuchsia),var(--orange))" }}
          >
            {sel.length < 2 ? `Encore ${2 - sel.length}` : "Continuer"}
            {sel.length >= 2 && <ArrowRight size={17} />}
          </button>
        </div>
      )}

      {/* 3 — La micro-révélation */}
      {etape === "reveal" && rev && (
        <div className="animate-fade-up">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">
            <Sparkles size={14} /> Ce qui se dessine
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-ink">
            {rev.titre}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{rev.resonance}</p>
          <div
            className="mt-5 rounded-2xl border p-5"
            style={{
              borderColor: "color-mix(in srgb, var(--fuchsia) 34%, transparent)",
              background:
                "radial-gradient(130% 130% at 0% 0%, color-mix(in srgb, var(--fuchsia) 9%, transparent), transparent 60%)",
            }}
          >
            <p className="text-[15px] font-medium leading-relaxed text-ink">“{rev.reframe}”</p>
          </div>
          <button
            onClick={() => setEtape("carte")}
            className="mt-8 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full brand-gradient px-8 text-base font-semibold text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.01]"
          >
            Voir ma carte s'éclairer
            <ArrowRight size={17} />
          </button>
        </div>
      )}

      {/* 4 — La carte qui s'éclaire */}
      {etape === "carte" && rev && (
        <div className="animate-fade-up text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">
            Connexion révélée
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">
            {DIMENSIONS[rev.connexion[0]].nom}
            <span className="mx-2 text-fuchsia">×</span>
            {DIMENSIONS[rev.connexion[1]].nom}
          </h2>
          <div className="mt-4 rounded-2xl border border-line bg-surface p-4 shadow-soft">
            <CarteBoucle dimensions={dimensions} connexions={connexions} highlight={rev.connexion} />
          </div>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
            À chaque exploration, une zone s'éclaire ou se relie. Ta carte devient
            plus « toi » — {connexions.length > 1 ? `déjà ${connexions.length} connexions tissées.` : "c'est ta première connexion."}
          </p>
          <button
            onClick={() => setEtape("ouverture")}
            className="mt-7 inline-flex min-h-[3.25rem] items-center gap-2 rounded-full brand-gradient px-8 text-base font-semibold text-[color:var(--on-brand)] shadow-glow transition-transform hover:scale-[1.02]"
          >
            Continuer
            <ArrowRight size={17} />
          </button>
        </div>
      )}

      {/* 5 — L'ouverture */}
      {etape === "ouverture" && (
        <div className="animate-fade-up text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">
            À demain
          </div>
          <h2 className="mx-auto mt-3 max-w-md font-display text-2xl font-bold leading-snug text-ink">
            {facette.demain}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            Rien à rattraper, rien à finir. Ton identité se tisse un fil à la fois.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/scenarios"
              className="inline-flex min-h-[3.25rem] w-full max-w-xs items-center justify-center gap-2 rounded-full border border-fuchsia px-8 text-base font-semibold text-fuchsia transition-colors hover:bg-fuchsia hover:text-[color:var(--on-brand)]"
            >
              Créer une intention
            </Link>
            <Link
              href="/aujourdhui"
              className="inline-flex min-h-[3.25rem] w-full max-w-xs items-center justify-center gap-2 rounded-full brand-gradient px-8 text-base font-semibold text-[color:var(--on-brand)] shadow-glow"
            >
              Entrer dans IdentitX
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
