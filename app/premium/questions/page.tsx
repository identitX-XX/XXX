"use client";

// Offre premium n°3 — panels de 10 questions par périmètre (2,50 € chacun).

import { PageHead, Card } from "@/components/ui";
import {
  PANELS_QUESTIONS,
  LABEL_PERIMETRE,
  PerimetreQ,
} from "@/parcours-archetypes/premiumContenu";

const ORDRE: PerimetreQ[] = ["perso", "pro", "identitaire", "relationnel"];

export default function QuestionsPage() {
  return (
    <div>
      <PageHead
        eyebrow="Aller plus loin"
        title="Tes 10 questions par périmètre"
        sub="Dix questions ciblées pour creuser un domaine — à déposer dans ton journal, à ton rythme."
      />
      <div className="space-y-6">
        {ORDRE.map((p) => (
          <PanelView key={p} perimetre={p} />
        ))}
      </div>
    </div>
  );
}

function PanelView({ perimetre, apercu }: { perimetre: PerimetreQ; apercu?: boolean }) {
  const questions = PANELS_QUESTIONS[perimetre];
  const liste = apercu ? questions.slice(0, 3) : questions;
  return (
    <Card className="p-6">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia">
        {LABEL_PERIMETRE[perimetre]}
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {liste.map((q, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="grid h-6 w-6 flex-none place-items-center rounded-full border border-line text-[12px] font-bold text-fuchsia">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-ink">{q}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
