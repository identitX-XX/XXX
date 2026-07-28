"use client";

// « Ton portrait » — le module UNIQUE qui fusionne les surfaces contemplatives
// autrefois éparpillées (Synthèse, Jauges, Radar/ADN, Cartographie, Journal).
// Un seul point d'entrée, un onglet par facette : elles ne diluent plus, elles
// composent un même portrait.

import { useState } from "react";
import { computeScores, useStore } from "@/store/useStore";
import { PageHead, Card } from "@/components/ui";
import { ArcGauge } from "@/components/ArcGauge";
import { RadarDNA } from "@/components/RadarDNA";
import { CognitiveMap } from "@/components/CognitiveMap";
import { JournalFusion } from "@/components/JournalFusion";
import { Synthese } from "@/components/Synthese";

type Onglet = "synthese" | "jauges" | "radar" | "carte" | "journal";
const ONGLETS: { key: Onglet; label: string }[] = [
  { key: "synthese", label: "Synthèse" },
  { key: "jauges", label: "Jauges" },
  { key: "radar", label: "Radar" },
  { key: "carte", label: "Cartographie" },
  { key: "journal", label: "Journal" },
];

export default function PortraitPage() {
  const [tab, setTab] = useState<Onglet>("synthese");
  const profile = useStore((s) => s.profile);
  const radar = useStore((s) => s.radar);
  const scores = computeScores(profile);

  const gauges = [
    { label: "Connaissance de soi", value: scores.selfKnowledge },
    { label: "Clarté identitaire", value: scores.clarity },
    { label: "Énergie actuelle", value: scores.energy },
    { label: "Alignement personnel", value: scores.alignment },
  ];

  return (
    <div>
      <PageHead
        eyebrow="Ton portrait"
        title="Tout ce que tu sais de toi, réuni"
        sub="Une seule surface, plusieurs facettes : ta synthèse, tes jauges, ton radar, ta cartographie et ton journal."
      />

      {/* Barre d'onglets — un seul module, plusieurs facettes. */}
      <div className="mb-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {ONGLETS.map((o) => {
          const actif = tab === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setTab(o.key)}
              className={`flex-none rounded-full border px-4 py-2 text-sm transition-colors ${
                actif
                  ? "border-fuchsia text-fuchsia"
                  : "border-line text-muted hover:border-muted hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      <div key={tab} className="animate-fade-up">
        {tab === "synthese" && <Synthese />}

        {tab === "jauges" && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gauges.map((g, i) => (
              <Card key={g.label} className="p-6">
                <div style={{ animationDelay: `${i * 60}ms` }}>
                  <ArcGauge value={g.value} label={g.label} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "radar" && (
          <Card className="p-6">
            <RadarDNA data={radar} />
          </Card>
        )}

        {tab === "carte" && <CognitiveMap />}

        {tab === "journal" && <JournalFusion />}
      </div>
    </div>
  );
}
