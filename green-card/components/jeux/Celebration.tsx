"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Gain } from "@/lib/points";

const EMOJI = ["", "🥉", "🥈", "🥇"];

/** Bandeau « case tamponnée » quand une médaille est gagnée. */
export function Celebration({ gain, onFermer }: { gain: Gain; onFermer?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Visible même si le formulaire est plus bas dans la page (et pas caché sous l'en-tête fixe).
    ref.current?.focus({ preventScroll: true });
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [gain]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="animate-monte relative scroll-mt-24 overflow-hidden rounded-carte bg-gradient-to-br from-green-400 to-green-700 p-5 text-center text-white shadow-[0_12px_28px_rgba(11,138,66,.35)] outline-none"
    >
      <Confettis />
      <div aria-hidden className="mx-auto grid h-20 w-20 animate-tampon place-items-center rounded-2xl bg-white text-4xl shadow-lg">
        {EMOJI[gain.niveau]}
      </div>
      <p className="mt-3 text-lg font-bold">Case tamponnée !</p>
      <p className="text-sm text-white/90">
        Médaille {gain.medaille} · <strong className="text-white">+{gain.points} GreenPoints</strong>
      </p>
      <div className="mt-4 flex gap-2">
        <Link href="/carte" className="btn bg-white text-green-700">
          Ma carte
        </Link>
        {onFermer && (
          <button type="button" onClick={onFermer} className="btn border-2 border-white/60 text-white">
            Continuer
          </button>
        )}
      </div>
    </div>
  );
}

function Confettis() {
  const couleurs = ["#ffffff", "#e2071b", "#fff1b8", "#b8f0cf"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="absolute top-0 h-2 w-1.5 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: couleurs[i % couleurs.length],
            animation: `confetti ${1.2 + (i % 5) * 0.25}s ease-in ${(i % 6) * 0.08}s both`,
          }}
        />
      ))}
      <style>{`@keyframes confetti{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(260px) rotate(540deg);opacity:0}}`}</style>
    </div>
  );
}
