"use client";

// « Ton portrait » — le module UNIQUE qui fusionne les surfaces contemplatives
// autrefois éparpillées (Synthèse, Jauges, Radar/ADN, Cartographie, Journal).
// Un seul point d'entrée, un onglet par facette : elles ne diluent plus, elles
// composent un même portrait.

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { PageHead, Card } from "@/components/ui";
import { RadarDNA } from "@/components/RadarDNA";
import { CognitiveMap } from "@/components/CognitiveMap";
import { JournalFusion } from "@/components/JournalFusion";

type Onglet = "radar" | "carte" | "journal";
const ONGLETS: { key: Onglet; label: string }[] = [
  { key: "radar", label: "Radar" },
  { key: "carte", label: "Cartographie" },
  { key: "journal", label: "Journal" },
];

export default function PortraitPage() {
  const [tab, setTab] = useState<Onglet>("radar");
  const radar = useStore((s) => s.radar);

  return (
    <div>
      <PageHead
        eyebrow="Ton portrait"
        title="Toutes tes facettes, convoquées"
        sub="Un seul lieu où tes fragments se répondent — radar, cartographie, journal. La matière première de ton récit, rassemblée."
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
