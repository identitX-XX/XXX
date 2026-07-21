"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { genererScenarios, labelPerimetre, Perimetre } from "@/parcours-archetypes/scenarios";

// Première phrase d'un texte (pour un aperçu compact de l'ombre secondaire).
function premierePhrase(t: string): string {
  const i = t.indexOf(". ");
  return i > 0 ? t.slice(0, i + 1) : t;
}

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
          sub="Ton rapport se tisse à partir de ce que tu vis. Traverse quelques journées, puis reviens le découvrir."
        />
        <Link href="/parcours-archetypes" className="text-sm text-fuchsia hover:underline">
          ← Aller au parcours
        </Link>
      </div>
    );
  }

  const scenarios = genererScenarios(etat, diagnostic.dominant, diagnostic.secondaire);
  const dom = archetypeByKey[diagnostic.dominant];
  const sec = archetypeByKey[diagnostic.secondaire];

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

      {/* Ton moteur, ton piège : la Force et l'Ombre de ton archétype, face à
          face — le cœur de « moteur ou piège » du parcours. */}
      {(dom.force || dom.ombre) && (
        <Card className="mb-8 p-6 sm:p-7">
          <div className="text-xs uppercase tracking-[0.16em] text-fuchsia">
            Ton archétype · moteur &amp; piège
          </div>
          <h2 className="mt-1 font-display text-2xl font-light text-ink">{dom.name}</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {dom.force && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink">
                  <span style={{ color: "var(--good)" }}>▲</span> Ton moteur
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{dom.force}</p>
              </div>
            )}
            {dom.ombre && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink">
                  <span style={{ color: "var(--orange)" }}>▼</span> Ton piège
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{dom.ombre}</p>
              </div>
            )}
          </div>
          {sec.ombre && (
            <div className="mt-6 border-t border-line pt-4 text-sm text-muted">
              En appui, <b className="text-ink">{sec.name}</b> — à surveiller aussi :{" "}
              {premierePhrase(sec.ombre)}
            </div>
          )}
        </Card>
      )}

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
