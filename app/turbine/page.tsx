"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { TurbineInput, TurbineOutput } from "@/lib/turbine/types";

// Profil par défaut — sert de démonstration tant que la Turbine n'est pas
// branchée aux vraies données de l'utilisatrice. La bascule reflète l'état
// « fondatrice engagée » (le choix assumé de mener IdentitX jusqu'au bout).
const DEFAULT_INPUT: TurbineInput = {
  archetype: {
    actuel: "Fondatrice engagée",
    precedent: "Conceptrice-exploratrice",
    bascule:
      "Le choix assumé de mener IdentitX jusqu'au bout — passage d'explorer à s'engager.",
  },
  valeurs: ["Liberté", "Justesse", "Loyauté"],
  forces: ["Intelligence émotionnelle", "Créativité", "Humour"],
  directions: [
    { nom: "Venture builder", energie: "haute", etat: "émergent" },
    { nom: "Conceptrice", energie: "haute", etat: "actif" },
    { nom: "Speakeuse", energie: "moyenne", etat: "en veille" },
  ],
  tensions: ["dispersion", "manque de légitimité", "rapport à l'argent"],
  signalRecent: [
    "A assumé de mener IdentitX jusqu'au bout",
    "A nommé un prix : 12€/mois",
  ],
  scenariosPrecedents: [],
};

export default function TurbinePage() {
  const [output, setOutput] = useState<TurbineOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/turbine", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(DEFAULT_INPUT),
      });
      const data = (await res.json()) as TurbineOutput & { error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "La Turbine n'a pas répondu.");
        return;
      }
      setOutput(data);
    } catch {
      setError("Impossible de joindre la Turbine.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    generer();
  }, [generer]);

  return (
    <div>
      <PageHead
        eyebrow="La Turbine"
        title="Ce que ta bascule rend possible"
        sub="Ton archétype vient de bouger. Voici les scénarios d'orchestration qui émergent — pas un portrait à contempler, des mouvements à faire."
      />

      {/* La bascule en cours */}
      <div className="mb-6 rounded-2xl border border-line bg-surface p-5 shadow-soft">
        <div className="text-[10px] uppercase tracking-[0.2em] text-fuchsia">
          La bascule
        </div>
        <p className="mt-2 text-sm text-ink">
          <span className="text-muted">{DEFAULT_INPUT.archetype.precedent}</span>
          {"  →  "}
          <span className="font-display text-base">
            {DEFAULT_INPUT.archetype.actuel}
          </span>
        </p>
        <p className="mt-1 text-sm text-muted">{DEFAULT_INPUT.archetype.bascule}</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-muted">
          <Loader2 size={18} className="animate-spin text-fuchsia" />
          La Turbine génère tes scénarios…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-sm text-ink">{error}</p>
          <button
            onClick={generer}
            className="mt-3 inline-flex items-center gap-2 text-sm text-fuchsia"
          >
            <RefreshCw size={14} /> Réessayer
          </button>
        </div>
      )}

      {!loading && !error && output && (
        <>
          {output._mock && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[11px] text-muted">
              <Sparkles size={12} className="text-fuchsia" />
              Mode maquette — branche <code className="mx-1">MISTRAL_API_KEY</code> pour la génération réelle
            </div>
          )}

          {output.scenarios.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center">
              <p className="font-display text-lg text-ink">Signal insuffisant</p>
              <p className="mt-1 text-sm text-muted">
                {output.raison ??
                  "Rien de neuf ne justifie une bascule. Le silence vaut mieux que le bruit — reviens après avoir bougé."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {output.scenarios.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-6 shadow-soft"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {s.multiples_en_dialogue.map((m, j) => (
                      <span
                        key={j}
                        className="rounded-full border border-fuchsia/40 bg-fuchsia/10 px-2.5 py-0.5 text-[11px] font-medium text-fuchsia"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3 font-display text-xl font-light leading-snug text-ink">
                    {s.titre}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {s.mouvement}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                    <p>
                      <span className="text-fuchsia">Pourquoi maintenant · </span>
                      <span className="text-muted">{s.pourquoi_maintenant}</span>
                    </p>
                    <p className="flex items-start gap-2 text-ink">
                      <ArrowRight size={15} className="mt-0.5 flex-none text-fuchsia" />
                      <span>
                        <span className="font-medium">Premier pas · </span>
                        {s.premier_pas}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted">Lâche · </span>
                      <span className="text-muted">{s.risque_ou_lest}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {output.note_de_bascule && (
            <p className="mt-5 text-sm italic text-muted">{output.note_de_bascule}</p>
          )}

          <button
            onClick={generer}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-fuchsia hover:text-fuchsia"
          >
            <RefreshCw size={15} /> Régénérer
          </button>
        </>
      )}
    </div>
  );
}
