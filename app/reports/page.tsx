"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "@/store/useStore";
import { Card, PageHead } from "@/components/ui";

export default function ReportsPage() {
  const journal = useStore((s) => s.journal);
  const timeline = useStore((s) => s.timeline);

  const series = [...journal]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      Humeur: e.mood,
      Énergie: e.energy,
      Confiance: e.confidence,
    }));

  const bars = [...timeline]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ name: e.date, Importance: e.importance }));

  const avg = (key: "mood" | "confidence") =>
    journal.length
      ? Math.round(journal.reduce((s, e) => s + e[key], 0) / journal.length)
      : 0;

  const stats = [
    { label: "Entrées de journal", value: journal.length },
    { label: "Humeur moyenne", value: avg("mood") },
    { label: "Confiance moyenne", value: avg("confidence") },
    { label: "Jalons de vie", value: timeline.length },
  ];

  return (
    <div>
      <PageHead
        eyebrow="Rapports"
        title="Ton évolution"
        sub="Une lecture claire de la trajectoire, sans surcharge."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="font-display text-3xl font-light brand-text">{s.value}</div>
            <div className="mt-1 text-xs text-muted">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="mb-6 p-6">
        <p className="mb-4 font-display text-lg text-ink">Évolution émotionnelle</p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 11 }} stroke="var(--line)" />
              <YAxis domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 11 }} stroke="var(--line)" />
              <Tooltip
                contentStyle={{
                  background: "var(--raised)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  color: "var(--ink)",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="Humeur" stroke="var(--fuchsia)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Énergie" stroke="var(--orange)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Confiance" stroke="var(--muted)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <p className="mb-4 font-display text-lg text-ink">Intensité des jalons</p>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bars} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--fuchsia)" />
                  <stop offset="100%" stopColor="var(--orange)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} stroke="var(--line)" />
              <YAxis domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 11 }} stroke="var(--line)" />
              <Tooltip
                cursor={{ fill: "var(--line)" }}
                contentStyle={{
                  background: "var(--raised)",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  color: "var(--ink)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="Importance" fill="url(#barFill)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
