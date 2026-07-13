"use client";

import { useEffect, useState } from "react";

/**
 * Signature element: a 270° arc gauge with the brand gradient stroke.
 * Animates from 0 to the target value on mount.
 */
export function ArcGauge({
  value,
  label,
  size = 132,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const [shown, setShown] = useState(0);
  const stroke = 9;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const sweep = 270;
  const circumference = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * circumference;

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const gradId = `g-${label.replace(/\s+/g, "")}`;
  const dashOffset = arcLen - (shown / 100) * arcLen;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--fuchsia)" />
              <stop offset="100%" stopColor="var(--orange)" />
            </linearGradient>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--line)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
            transform={`rotate(${startAngle} ${cx} ${cy})`}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(${startAngle} ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-light text-ink">
            {Math.round(shown)}
          </span>
        </div>
      </div>
      <span className="mt-2 text-center text-xs text-muted">{label}</span>
    </div>
  );
}
