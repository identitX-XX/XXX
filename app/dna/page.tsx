"use client";

import { useStore } from "@/store/useStore";
import { RadarDNA } from "@/components/RadarDNA";
import { Card, PageHead, Slider } from "@/components/ui";

export default function DnaPage() {
  const radar = useStore((s) => s.radar);
  const setRadar = useStore((s) => s.setRadar);

  const update = (axis: string, value: number) =>
    setRadar(radar.map((r) => (r.axis === axis ? { ...r, value } : r)));

  return (
    <div>
      <PageHead
        eyebrow="ADN personnel"
        title="Ton empreinte"
        sub="Dix dimensions, calibrées depuis ton profil. Ajuste chaque axe : le radar suit."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex items-center justify-center p-4">
          <RadarDNA data={radar} />
        </Card>

        <Card className="space-y-4 p-6">
          {radar.map((r) => (
            <Slider
              key={r.axis}
              label={r.axis}
              value={r.value}
              onChange={(v) => update(r.axis, v)}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}
