"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { Objectifs } from "@/parcours-archetypes/components/Objectifs";
import { SphereIcon } from "@/components/SphereIcon";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { archetypeDominant } from "@/parcours-archetypes/indicateurs";
import { futurMoiDe, queteDe } from "@/parcours-archetypes/quete";
import { detecterChapitres, derniereBascule } from "@/parcours-archetypes/bascules";
import { PERIMETRES } from "@/parcours-gap/perimetres";

// « Progression » — sans unité de temps. Pas un compteur de jours : la TRANSITION
// que tu traverses (d'où tu pars → vers quoi tu vas) et le LEVIER qui t'y porte.
export default function ProgressionPage() {
  const etat = useParcoursStore((s) => s.etat);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const definirObjectifs = useParcoursStore((s) => s.definirObjectifs);
  const [editObj, setEditObj] = useState(false);

  if (editObj) {
    return (
      <Objectifs
        initial={objectifs ?? undefined}
        eyebrow="Ma direction"
        titre="Ajuste ton cap"
        intro="Revois tes directions quand tu veux — elles guident ton parcours et nourrissent ton rapport."
        submitLabel="Enregistrer"
        onSubmit={(o) => {
          definirObjectifs(o);
          setEditObj(false);
        }}
        onCancel={() => setEditObj(false)}
      />
    );
  }

  if (!diagnostic) {
    return (
      <div>
        <PageHead
          eyebrow="Ta direction"
          title="Où tu vas"
          sub="Ta transition apparaîtra ici dès que ta signature sera révélée."
        />
        <Card className="p-6">
          <p className="text-sm text-muted">
            Commence par révéler ta signature — la transition que tu traverses se
            dessinera ensuite.
          </p>
          <Link
            href="/parcours-signatures"
            className="mt-4 inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-[color:var(--on-brand)]"
          >
            Je révèle ma signature
            <ArrowRight size={15} />
          </Link>
        </Card>
      </div>
    );
  }

  const domKey = archetypeDominant(etat)?.key ?? diagnostic.dominant;
  const arch = archetypeByKey[domKey];
  const futur = futurMoiDe(domKey);
  const quete = queteDe(domKey);
  let mue: ReturnType<typeof derniereBascule> = null;
  try {
    mue = derniereBascule(detecterChapitres(etat.historique));
  } catch {
    mue = null;
  }
  const depuisNom = mue ? archetypeByKey[mue.depuis].name : arch.name;
  const versNom = futur?.nom ?? "ta version haute";
  const lest = quete?.lest ?? "ce qui te pèse en ce moment";
  const directions = objectifs
    ? PERIMETRES.map((p) => ({ ...p, val: (objectifs[p.key] ?? "").trim() })).filter((d) => d.val)
    : [];

  return (
    <div>
      <PageHead
        eyebrow="Ta direction"
        title="Où tu vas"
        sub="Pas un compteur : la transition que tu traverses, et ce qui t'y porte."
      />

      {/* La transition — d'où tu pars, vers quoi tu vas. Aucune durée. */}
      <Card className="mb-4 p-6 animate-fade-up">
        <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-fuchsia">
          La transition en cours
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-xl border border-line bg-raised px-3.5 py-2 font-display text-lg text-ink">
            {depuisNom}
          </span>
          <ArrowRight size={18} className="text-fuchsia" />
          <span className="rounded-xl brand-gradient px-3.5 py-2 font-display text-lg text-[color:var(--on-brand)]">
            {versNom}
          </span>
        </div>
        {futur?.pourquoi && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{futur.pourquoi}</p>
        )}
      </Card>

      {/* Le levier — ce qui te fait passer d'un état à l'autre. */}
      <Card className="mb-4 p-6 animate-fade-up">
        <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-fuchsia">
          Ton levier
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink">
          Ce qui te fait avancer vers <b>{versNom}</b>, ce n'est pas le temps qui
          passe : c'est de <b>déposer {lest}</b>. Chaque fois que tu le relâches,
          un peu, tu te rapproches.
        </p>
        {directions.length > 0 && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Et la direction que tu as choisie —{" "}
            <span className="text-ink">{directions[0].val}</span> — est l'endroit
            concret où l'exercer.
          </p>
        )}
        <Link
          href="/quete"
          className="mt-4 inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-[color:var(--on-brand)]"
        >
          Actionner ce levier
          <ArrowRight size={15} />
        </Link>
      </Card>

      {/* Ton cap · tes directions (revoir / modifier) — les 4 piliers. */}
      {objectifs && (
        <Card className="mb-4 p-6 animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-muted">
              Ton cap · tes directions
            </div>
            <button
              onClick={() => setEditObj(true)}
              className="text-xs font-medium text-fuchsia hover:underline"
            >
              Modifier
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PERIMETRES.map((p) => (
              <div key={p.key}>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <SphereIcon sphere={p.key} size={14} /> {p.label}
                </div>
                <div className="mt-1 text-sm text-ink">
                  {objectifs[p.key]?.trim() ? objectifs[p.key] : <span className="italic text-muted">Non défini</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/parcours-signatures"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-[color:var(--on-brand)]"
        >
          Reprendre le parcours
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/parcours-signatures/rapport"
          className="inline-flex items-center gap-2 rounded-full border border-fuchsia px-5 py-2.5 text-sm text-fuchsia hover:bg-raised"
        >
          Voir mon rapport
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
