"use client";

// « X-sens » — agent séparé qui POSE des questions pour accompagner une transition
// de vie : état des lieux → boussole → scénarios → plan (à son rythme) → résumé
// exportable. Guidé, une question à la fois. IA (Mistral) avec repli maquette.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Copy, Check, Compass, RefreshCw, Home,
} from "lucide-react";
import { PageHead, Button, TextArea, Card } from "@/components/ui";
import { QUESTIONS, type Reponses, type Bilan } from "@/lib/xsens/xsens";

const LS = "idx-xsens";

export default function XSensPage() {
  const [reponses, setReponses] = useState<Reponses>({});
  const [phase, setPhase] = useState<"intro" | "questions" | "resultat">("intro");
  const [idx, setIdx] = useState(0);
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) {
        const d = JSON.parse(raw);
        if (d?.reponses) setReponses(d.reponses);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify({ reponses }));
    } catch {}
  }, [reponses]);

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const dejaCommence = Object.values(reponses).some((v) => (v ?? "").trim());

  const generer = async () => {
    setLoading(true);
    setErreur("");
    try {
      const res = await fetch("/api/x-sens", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reponses }),
      });
      const d = await res.json();
      if (d?.bilan) {
        setBilan(d.bilan);
        setResume(d.resume || "");
        setPhase("resultat");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else {
        setErreur("La génération a échoué. Réessaie.");
      }
    } catch {
      setErreur("Service momentanément indisponible. Réessaie dans un instant.");
    }
    setLoading(false);
  };

  const suivant = async () => {
    if (idx < total - 1) {
      setIdx(idx + 1);
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      await generer();
    }
  };

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(resume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ---- INTRO ----
  if (phase === "intro") {
    return (
      <div>
        <PageHead
          eyebrow="X-sens · transition"
          title="Faisons le point sur ta transition"
          sub="Je te pose quelques questions — situation, valeurs, envies — puis je te propose plusieurs scénarios réalistes et un plan que tu suis à ton rythme, quand tu t'y mets. Rien n'est figé, tout est réutilisable."
        />
        <Card className="p-6 sm:p-7">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
            Comment ça marche
          </div>
          <ol className="mt-3 grid gap-2.5 text-sm text-ink">
            {[
              "État des lieux — où tu en es vraiment",
              "Boussole — tes valeurs, tes envies, tes freins",
              "Scénarios — plusieurs chemins possibles",
              "Un plan — les premiers pas, à ton rythme",
              "Résumé exportable — à garder ou à partager",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-fuchsia text-[11px] font-semibold text-[color:var(--on-brand)]">
                  {i + 1}
                </span>
                <span className="leading-snug">{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            ≈ 10 minutes. Tes réponses restent sur ton appareil. X-sens n'est pas un
            conseil médical, juridique ou financier — pour ça, vois un·e pro.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button onClick={() => setPhase("questions")}>
              {dejaCommence ? "Reprendre" : "Commencer"} <ArrowRight size={15} />
            </Button>
            {dejaCommence && (
              <Button
                variant="outline"
                onClick={() => {
                  setReponses({});
                  setIdx(0);
                }}
              >
                Repartir de zéro
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ---- QUESTIONS ----
  if (phase === "questions") {
    return (
      <div>
        <div className="mb-6">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-fuchsia">
            {q.etapeLabel} · {idx + 1}/{total}
          </div>
          <div className="mt-2 flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <span
                key={i}
                className="h-[3px] flex-1 rounded-full"
                style={{ background: i <= idx ? "var(--ink)" : "var(--line)" }}
              />
            ))}
          </div>
        </div>

        <div key={q.id} className="animate-fade-up">
          <h1 className="font-display text-[1.9rem] leading-tight text-ink">{q.question}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{q.aide}</p>
          <div className="mt-4">
            <TextArea
              value={reponses[q.id] ?? ""}
              onChange={(val) => setReponses((p) => ({ ...p, [q.id]: val }))}
              placeholder={q.placeholder}
              rows={q.lignes}
            />
          </div>

          {erreur && <p className="mt-3 text-sm text-danger">{erreur}</p>}

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={() => (idx === 0 ? setPhase("intro") : setIdx(idx - 1))}
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} /> {idx === 0 ? "Retour" : "Précédent"}
            </button>
            <Button onClick={suivant} disabled={loading}>
              {loading
                ? "Je réfléchis…"
                : idx === total - 1
                ? "Voir mes scénarios"
                : "Suivant"}
              {!loading && <ArrowRight size={15} />}
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Tu peux passer une question — réponds à ce qui te parle.
          </p>
        </div>
      </div>
    );
  }

  // ---- RÉSULTAT ----
  return (
    <div>
      <PageHead eyebrow="X-sens · ton bilan" title="Tes chemins possibles" />

      {bilan && (
        <>
          <Card className="p-5 sm:p-6">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
              Ta boussole
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-ink">{bilan.boussole}</p>
          </Card>

          <div className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
            Scénarios
          </div>
          <div className="mt-2 grid gap-3">
            {bilan.scenarios.map((s, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-xl leading-tight text-ink">{s.titre}</h2>
                  <span className="flex-none font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                    {s.horizon}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
                <Bloc titre="Avantages" items={s.avantages} />
                <Bloc titre="Points de vigilance" items={s.vigilance} />
                <Bloc titre="Ressources" items={s.ressources} />
              </Card>
            ))}
          </div>

          <div className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
            Ton plan · à ton rythme
          </div>
          <Card className="mt-2 p-5">
            <PlanBloc titre="Tes premiers pas" items={bilan.plan.premiers} coche />
            <PlanBloc titre="La suite, une fois ceux-là faits" items={bilan.plan.ensuite} coche />
            <PlanBloc titre="Indicateurs d'avancée" items={bilan.plan.indicateurs} />
          </Card>

          {/* Résumé exportable */}
          <div className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia">
            Résumé exportable
          </div>
          <Card className="mt-2 p-5">
            <p className="text-sm text-muted">
              À copier dans Notion, un doc, ou à garder pour un coach.
            </p>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-noir p-3 text-[12px] leading-relaxed text-ink">
              {resume}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <Button onClick={copier}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copié ✓" : "Copier le résumé"}
              </Button>
              <Button variant="outline" onClick={() => setPhase("questions")}>
                <RefreshCw size={14} /> Ajuster mes réponses
              </Button>
            </div>
          </Card>

          <Link
            href="/aujourdhui"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <Home size={15} /> Retour à l'accueil
          </Link>
        </>
      )}
    </div>
  );
}

function Bloc({ titre, items }: { titre: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mt-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{titre}</div>
      <ul className="mt-1 grid gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-snug text-ink">
            <Compass size={13} className="mt-1 flex-none text-fuchsia" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlanBloc({ titre, items, coche }: { titre: string; items: string[]; coche?: boolean }) {
  if (!items?.length) return null;
  return (
    <div className="mt-3 first:mt-0">
      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
        {titre}
      </div>
      <ul className="mt-1.5 grid gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-snug text-ink">
            <span
              className="mt-0.5 flex-none rounded-[5px] border border-line"
              style={{ width: 15, height: 15, background: "var(--noir)" }}
              aria-hidden
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
