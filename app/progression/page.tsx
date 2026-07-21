"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Flame } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { DayStrip } from "@/components/DayStrip";
import { Objectifs } from "@/parcours-archetypes/components/Objectifs";
import { Chapitres } from "@/components/Chapitres";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey, phaseDuJour } from "@/parcours-archetypes/archetypes";
import {
  coherenceCourante,
  courbeEvolution,
  archetypeDominant,
  momentum,
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
          sub="Ta carte des 30 jours s'ouvrira ici, dès que ta quête sera lancée."
        />
        <Card className="p-6">
          <p className="text-sm text-muted">
            Commence par révéler ton archétype — puis reviens voir le chemin
            se dessiner, jour après jour.
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
  const mo = momentum(etat);
  const phase = phaseDuJour(Math.min(prog.jourCourant, 30));
  const dom = archetypeDominant(etat);
  const hue = dom ? archetypeByKey[dom.key].hue : null;
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
      <div className="grid gap-4 animate-fade-up sm:grid-cols-[auto_1fr]">
        <Card className="flex items-center gap-5 p-6">
          <div className="relative flex-none">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-2xl opacity-40"
              style={{
                background:
                  hue !== null
                    ? `radial-gradient(circle, hsl(${hue} 90% 60%), transparent 70%)`
                    : "transparent",
              }}
            />
            <div
              className="relative"
              style={{
                width: 108, height: 108, borderRadius: "50%",
                background: `conic-gradient(var(--fuchsia) ${angle}deg, var(--line) ${angle}deg)`,
                display: "grid", placeItems: "center",
              }}
            >
              <div className="grid h-[86px] w-[86px] place-items-center rounded-full bg-surface text-center">
                <div>
                  <div className="font-display text-2xl text-ink">{prog.faits}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">/ 30 jours</div>
                </div>
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

      {/* Momentum — même langage que le hub Aujourd'hui : série + prochain cap. */}
      {prog.faits > 0 && (
        <div
          className="mt-4 grid gap-4 animate-fade-up sm:grid-cols-2"
          style={{ animationDelay: "60ms" }}
        >
          <Card className="flex items-center gap-4 p-5">
            <div
              className="grid h-11 w-11 flex-none place-items-center rounded-full"
              style={{
                background: "color-mix(in srgb, var(--orange) 14%, transparent)",
                color: "var(--orange)",
              }}
            >
              <Flame size={20} />
            </div>
            <div>
              <div className="font-display text-xl text-ink">
                {mo.serie > 0
                  ? `${mo.serie} jour${mo.serie > 1 ? "s" : ""} d'affilée`
                  : "Reprends le fil"}
              </div>
              <div className="text-xs text-muted">
                {mo.serie > 0
                  ? mo.record > mo.serie
                    ? `Ton record : ${mo.record} jours`
                    : "C'est ta meilleure série — tiens-la."
                  : "Une journée aujourd'hui relance ta série."}
              </div>
            </div>
          </Card>

          {mo.prochainJalon && (
            <Card className="flex flex-col justify-center gap-2 p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink">Prochain cap · {mo.prochainJalon} jours</span>
                <span className="text-xs text-muted">plus que {mo.resteAvantJalon}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full brand-gradient transition-all"
                  style={{ width: `${Math.round((prog.faits / mo.prochainJalon) * 100)}%` }}
                />
              </div>
            </Card>
          )}
        </div>
      )}

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

      <Chapitres />

      {/* Frise d'avancement */}
      <div className="mt-8 animate-fade-up" style={{ animationDelay: "120ms" }}>
        <DayStrip
          jourCourant={prog.jourCourant}
          selected={Math.min(prog.jourCourant, 30)}
          reponses={reponses}
          onSelect={(n) => router.push(`/parcours-archetypes?jour=${n}`)}
          legende="Ton avancement · clique un jour pour le revoir"
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
