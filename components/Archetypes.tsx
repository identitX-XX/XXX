"use client";

import { useState } from "react";
import { ARCHETYPES, ARCHETYPE_CONTEXTS } from "@/data/constants";
import { Card } from "./ui";

// Module local-first : les 12 archétypes comme lentilles d'exploration.
// Galerie des 12 → sélection d'un archétype → lecture selon le contexte de vie
// actif. Aucun backend, aucun état persistant au stade squelette : pure
// exploration (la sélection vit dans le composant).
export function Archetypes() {
  const [activeKey, setActiveKey] = useState<string>(ARCHETYPES[0].key);
  const [context, setContext] = useState<string>(ARCHETYPE_CONTEXTS[0].key);

  const active = ARCHETYPES.find((a) => a.key === activeKey) ?? ARCHETYPES[0];
  const reading = active.readings?.[context];
  const contextLabel =
    ARCHETYPE_CONTEXTS.find((c) => c.key === context)?.label ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Galerie des 12 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {ARCHETYPES.map((a, i) => {
          const selected = a.key === activeKey;
          return (
            <button
              key={a.key}
              onClick={() => setActiveKey(a.key)}
              className="group block text-left focus-visible:outline-none"
              aria-pressed={selected}
            >
              <Card
                className={`flex h-full items-start gap-4 p-5 transition-all ${
                  selected
                    ? "border-fuchsia shadow-glow"
                    : "group-hover:border-fuchsia group-focus-visible:border-fuchsia"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm ${
                    selected
                      ? "brand-gradient text-white"
                      : "border border-line text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-light text-ink">
                    {a.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {a.lens}
                  </p>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Détail : lecture selon le contexte */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <Card className="p-6">
          <div className="text-xs uppercase tracking-[0.25em] text-fuchsia">
            Lentille
          </div>
          <h2 className="mt-2 font-display text-2xl font-light text-ink">
            {active.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {active.lens}
          </p>

          {/* Sélecteur de contexte de vie */}
          <div className="mt-6">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Contexte de vie
            </div>
            <div className="flex flex-wrap gap-2">
              {ARCHETYPE_CONTEXTS.map((c) => {
                const on = c.key === context;
                return (
                  <button
                    key={c.key}
                    onClick={() => setContext(c.key)}
                    className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                      on
                        ? "brand-gradient text-white"
                        : "border border-line text-muted hover:border-fuchsia hover:text-fuchsia"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lecture contextuelle */}
          <div className="mt-6 rounded-xl border border-line bg-noir p-4">
            <div className="text-xs uppercase tracking-wider text-muted">
              {active.name} · {contextLabel}
            </div>
            {reading ? (
              <p className="mt-2 text-sm leading-relaxed text-ink">{reading}</p>
            ) : (
              <p className="mt-2 text-sm italic leading-relaxed text-muted">
                À rédiger — la lecture de cet archétype dans ce contexte.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
