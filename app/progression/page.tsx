"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { DayStrip } from "@/components/DayStrip";
import { Objectifs } from "@/parcours-archetypes/components/Objectifs";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { phaseDuJour } from "@/parcours-archetypes/archetypes";
import {
  coherenceCourante,
  courbeEvolution,
  archetypeDominant,
  progression,
} from "@/parcours-archetypes/indicateurs";

// Module « Progression » : cartographie l'AVANCEMENT sur 30 jours (remplace la
// Ligne de vie). On regarde en avant — le chemin en cours — pas les événements
// passés.
export default function ProgressionPage() {
  const router = useRouter();
  const etat = useParcoursStore((s) => s.etat);
  const reponses = useParcoursStore((s) => s.reponses);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const definirObjectifs = useParcoursStore((s) => s.definirObjectifs);
  const [editObj, setEditObj] = useState(false);

  if (editObj) {
    return (
      <Objectifs
        initial={objectifs ?? undefined}
        eyebrow="Mes objectifs"
        titre="Ajuste ton cap"
        intro="Revois tes objectifs quand tu veux — ils guident ton parcours et nourrissent ton rapport."
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
          eyebrow="Avancement"
          title="Ta progression"
          sub="Ton avancement sur 30 jours apparaîtra ici, une fois ton parcours lancé."
        />
        <Card className="p-6">
          <p className="text-sm text-muted">
            Commence par identifier ton archétype, puis reviens suivre
            ton chemin jour après jour.
          </p>
          <Link
            href="/parcours-archetypes"
            className="mt-4 inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-white"
          >
            Je commence ma quête
            <ArrowRight size={15} />
          </Link>
        </Card>
      </div>
    );
  }

  const prog = progression(etat);
  const phase = phaseDuJour(Math.min(prog.jourCourant, 30));
  const dom = archetypeDominant(etat);
  const courbe = courbeEvolution(etat);
  const trend =
    courbe.length >= 2 ? courbe[courbe.length - 1].coherence - courbe[0].coherence : 0;
  const termine = prog.jourCourant > 30;
  const angle = (prog.part / 100) * 360;

  return (
    <div>
      <PageHead
        eyebrow="Avancement"
        title="Ta progression"
        sub="Où tu en es sur tes 30 jours — le chemin en cours, pas tes événements passés."
      />

      {/* Anneau + repères */}
      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <Card className="flex items-center gap-5 p-6">
          <div
            style={{
              width: 108, height: 108, borderRadius: "50%",
              background: `conic-gradient(var(--fuchsia) ${angle}deg, var(--line) ${angle}deg)`,
              display: "grid", placeItems: "center", flex: "none",
            }}
          >
            <div className="grid h-[86px] w-[86px] place-items-center rounded-full bg-noir text-center">
              <div>
                <div className="font-display text-2xl text-ink">{prog.faits}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted">/ 30 jours</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-fuchsia">Phase · {phase.label}</div>
            <p className="mt-1 max-w-xs text-sm text-muted">{phase.intention}</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted">Ton archétype</div>
            <div className="mt-1 font-display text-lg font-light text-ink">
              {dom ? dom.name : "—"}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted">Cohérence</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-lg font-light text-ink">
                {coherenceCourante(etat)}
              </span>
              <span className={`text-xs ${trend >= 0 ? "text-fuchsia" : "text-muted"}`}>
                {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Ton cap · tes objectifs (revoir / modifier) */}
      {objectifs && (
        <Card className="mt-4 p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-muted">Ton cap · tes objectifs</div>
            <button
              onClick={() => setEditObj(true)}
              className="text-xs font-medium text-fuchsia hover:underline"
            >
              Modifier
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {([["perso", "🌱 Perso"], ["pro", "💼 Pro"], ["relationnel", "🤝 Relationnel"]] as const).map(
              ([k, label]) => (
                <div key={k}>
                  <div className="text-xs text-muted">{label}</div>
                  <div className="mt-1 text-sm text-ink">
                    {objectifs[k]?.trim() ? objectifs[k] : <span className="italic text-muted">Non défini</span>}
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      )}

      {/* Frise d'avancement */}
      <div className="mt-8">
        <DayStrip
          jourCourant={prog.jourCourant}
          selected={Math.min(prog.jourCourant, 30)}
          reponses={reponses}
          onSelect={() => router.push("/parcours-archetypes")}
          legende="Ton avancement · clique un jour pour l'ouvrir"
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/parcours-archetypes"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 text-sm font-medium text-white"
        >
          {termine ? "Revoir mon parcours" : "Reprendre le parcours"}
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/parcours-archetypes/rapport"
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm ${
            prog.faits >= 5
              ? "border-fuchsia text-fuchsia hover:bg-raised"
              : "pointer-events-none border-line text-muted opacity-50"
          }`}
        >
          {prog.faits >= 5 ? "Voir mon rapport" : "Rapport dès 5 jours"}
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
