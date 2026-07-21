"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { genererScenarios, labelPerimetre, Perimetre } from "@/parcours-archetypes/scenarios";

// Rapport final : 3 scénarios de sortie activables, un par périmètre de vie,
// générés depuis les éclairages de la progression. Activer = choisir son plan.
export default function RapportPage() {
  const etat = useParcoursStore((s) => s.etat);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const [actif, setActif] = useState<Perimetre | null>(null);

  if (!diagnostic || etat.historique.length === 0) {
    return (
      <div>
        <PageHead
          eyebrow="Rapport"
          title="Tes scénarios de sortie"
          sub="Ton rapport se construit à partir de ta progression. Vis quelques journées, puis reviens."
        />
        <Link href="/parcours-archetypes" className="text-sm text-fuchsia hover:underline">
          ← Aller au parcours
        </Link>
      </div>
    );
  }

  const scenarios = genererScenarios(etat, diagnostic.dominant, diagnostic.secondaire);

  return (
    <div>
      <PageHead
        eyebrow="Rapport"
        title="Tes 3 scénarios de sortie"
        sub="Tes objectifs dispersés, ramenés à un scénario clair et aligné : trois voies concrètes, une par périmètre, éclairées par tes 30 jours. Active celle qui te parle — elle devient ton plan."
      />

      <Link
        href="/progression"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-fuchsia hover:underline"
      >
        <ArrowLeft size={15} />
        Retour à ta progression
      </Link>

      <div className="grid gap-4 md:grid-cols-3">
        {scenarios.map((s) => {
          const on = actif === s.perimetre;
          return (
            <Card
              key={s.perimetre}
              className={`flex flex-col p-6 transition-all ${on ? "border-fuchsia shadow-glow" : ""}`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-fuchsia">
                {labelPerimetre(s.perimetre)} · {s.mouvement}
              </div>
              {objectifs?.[s.perimetre]?.trim() && (
                <div className="mt-2 rounded-lg border border-line bg-noir p-2.5 text-xs text-muted">
                  <span className="uppercase tracking-wider text-[10px]">Ton objectif</span>
                  <div className="mt-0.5 text-ink">{objectifs[s.perimetre]}</div>
                </div>
              )}
              <h3 className="mt-3 font-display text-xl font-light text-ink">{s.titre}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.texte}</p>
              <div className="mt-3 text-xs text-muted">
                S'appuie sur <span className="text-ink">{s.appui}</span>
              </div>
              <button
                onClick={() => setActif(on ? null : s.perimetre)}
                className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  on
                    ? "brand-gradient text-white"
                    : "border border-line text-ink hover:border-fuchsia hover:text-fuchsia"
                }`}
              >
                {on ? (<><Check size={15} /> Scénario activé</>) : "Activer ce scénario"}
              </button>
            </Card>
          );
        })}
      </div>

      {actif && (
        <Card className="mt-6 p-5">
          <p className="text-sm text-ink">
            <span className="font-medium">Plan activé — {labelPerimetre(actif)}.</span>{" "}
            <span className="text-muted">
              Tu peux en activer un autre à tout moment ; les trois voies restent disponibles.
            </span>
          </p>
        </Card>
      )}
    </div>
  );
}
