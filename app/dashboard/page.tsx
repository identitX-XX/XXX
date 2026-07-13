"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { computeScores, useStore } from "@/store/useStore";
import { ArcGauge } from "@/components/ArcGauge";
import { Card } from "@/components/ui";

const QUICK = [
  { href: "/explorer", label: "Explorer" },
  { href: "/journal", label: "Journal" },
  { href: "/timeline", label: "Ligne de vie" },
  { href: "/reports", label: "Rapports" },
  { href: "/coach", label: "Coach IA" },
];

export default function DashboardPage() {
  const profile = useStore((s) => s.profile);
  const scores = computeScores(profile);

  const gauges = [
    { label: "Connaissance de soi", value: scores.selfKnowledge },
    { label: "Clarté identitaire", value: scores.clarity },
    { label: "Énergie actuelle", value: scores.energy },
    { label: "Alignement personnel", value: scores.alignment },
  ];

  return (
    <div>
      <div className="mb-10 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia">
          Lab Identitaire
        </p>
        <h1 className="mt-2 font-display text-4xl font-light text-ink md:text-5xl">
          Bonjour {profile.name || "à toi"}.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Bienvenue dans ton Lab Identitaire.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {gauges.map((g, i) => (
          <Card
            key={g.label}
            className="animate-fade-up p-6"
          >
            <div style={{ animationDelay: `${i * 60}ms` }}>
              <ArcGauge value={g.value} label={g.label} />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <p className="mb-3 text-xs uppercase tracking-wider text-muted">
          Continuer
        </p>
        <div className="flex flex-wrap gap-3">
          {QUICK.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-all hover:border-fuchsia hover:text-fuchsia"
            >
              {q.label}
              <ArrowUpRight
                size={15}
                className="text-muted transition-colors group-hover:text-fuchsia"
              />
            </Link>
          ))}
        </div>
      </div>

      {profile.keyword && (
        <Card className="mt-10 p-6">
          <p className="text-xs uppercase tracking-wider text-muted">
            Ton mot-clé identitaire
          </p>
          <p className="mt-2 font-display text-2xl font-light brand-text">
            {profile.keyword}
          </p>
        </Card>
      )}
    </div>
  );
}
