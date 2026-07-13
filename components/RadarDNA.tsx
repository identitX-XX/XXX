"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { RadarPoint } from "@/types";

export function RadarDNA({ data }: { data: RadarPoint[] }) {
  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--fuchsia)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--orange)" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="var(--line)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
          />
          <Radar
            dataKey="value"
            stroke="var(--fuchsia)"
            strokeWidth={2}
            fill="url(#radarFill)"
            fillOpacity={1}
            isAnimationActive
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
