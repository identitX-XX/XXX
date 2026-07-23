"use client";

// La Quête — pour ton archétype dominant, ce dont il faut te débarrasser, en
// trois exercices gamifiés (délestage · carrefour · pacte), dans le monde
// visuel de ton choix (Nature · Urbain · Futuriste · Rétro · Manga).

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown, Check, Repeat } from "lucide-react";
import { PageHead } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { queteDe, futurMoiDe } from "@/parcours-archetypes/quete";
import { MONDES, mondeByKey, Monde } from "@/parcours-archetypes/mondes";
import { ArchetypeKey } from "@/parcours-archetypes/types";

export default function QuetePage() {
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const mondeChoisi = useParcoursStore((s) => s.mondeChoisi);
  const choisirMonde = useParcoursStore((s) => s.choisirMonde);

  if (!diagnostic) {
    return (
      <div>
        <PageHead
          eyebrow="La Quête"
          title="Révèle d'abord ton archétype"
          sub="La Quête est taillée pour ton archétype dominant. Réponds aux douze questions, et elle s'ouvrira."
        />
        <Link
          href="/parcours-archetypes"
          className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white shadow-glow"
        >
          Révéler mon archétype
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const monde = mondeChoisi ? mondeByKey[mondeChoisi as Monde["key"]] : null;

  if (!monde) {
    return (
      <div>
        <PageHead
          eyebrow="La Quête"
          title="Choisis ton monde"
          sub="La même quête, cinq univers. Choisis celui où tu as envie de la vivre — tu pourras en changer."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MONDES.map((m) => (
            <button
              key={m.key}
              onClick={() => choisirMonde(m.key)}
              className="group overflow-hidden rounded-2xl border text-left transition-transform hover:scale-[1.01]"
              style={{ borderColor: m.line, background: m.bg }}
            >
              <div className="p-6">
                <div className="text-3xl">{m.motif}</div>
                <h3 className="mt-3 font-display text-xl font-light" style={{ color: m.ink }}>
                  {m.nom}
                </h3>
                <p className="mt-1 text-sm" style={{ color: m.muted }}>{m.tagline}</p>
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: m.accent }}
                >
                  Entrer dans ce monde
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <QueteMonde archKey={diagnostic.dominant} monde={monde} />;
}

function QueteMonde({ archKey, monde: m }: { archKey: ArchetypeKey; monde: Monde }) {
  const arch = archetypeByKey[archKey];
  const quete = queteDe(archKey);
  const futur = futurMoiDe(archKey);
  const done = useParcoursStore((s) => s.queteExercices);
  const choisirMonde = useParcoursStore((s) => s.choisirMonde);
  const rejouer = useParcoursStore((s) => s.rejouerQuete);
  const [tour, setTour] = useState(0);

  const ids = {
    delestage: `${archKey}:delestage`,
    carrefour: `${archKey}:carrefour`,
    pacte: `${archKey}:pacte`,
  };
  const etapes = [
    { label: "Relâcher", done: Boolean(done[ids.delestage]) },
    { label: "Choisir", done: Boolean(done[ids.carrefour]) },
    { label: "S'engager", done: Boolean(done[ids.pacte]) },
  ];
  const faits = etapes.filter((e) => e.done).length;
  const accompli = faits === 3;

  const reparcourir = () => {
    rejouer(archKey);
    setTour((t) => t + 1);
  };

  return (
    <div
      className="rounded-3xl border p-6 sm:p-9"
      style={{ background: m.bg, borderColor: m.line, color: m.ink }}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em]" style={{ color: m.accent }}>
            La Quête · {m.motif} {m.nom}
          </div>
          <h1 className="mt-2 font-display text-3xl font-light" style={{ color: m.ink }}>
            {arch.name}
          </h1>
        </div>
        <button
          onClick={() => choisirMonde("")}
          className="flex-none rounded-full border px-3 py-1.5 text-xs transition-colors"
          style={{ borderColor: m.line, color: m.muted }}
        >
          Changer de monde
        </button>
      </div>

      {/* Le lest */}
      <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: m.line, background: m.panel }}>
        <div className="text-xs uppercase tracking-[0.16em]" style={{ color: m.muted }}>
          Ce dont tu dois te débarrasser
        </div>
        <div className="mt-1.5 font-display text-2xl font-light" style={{ color: m.accent }}>
          {quete.lest}
        </div>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: m.muted }}>{quete.pourquoi}</p>
      </div>

      {/* La boucle heuristique — visible du début à la fin, s'allume à mesure. */}
      <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: m.line, background: m.panel }}>
        <div className="text-xs uppercase tracking-[0.16em]" style={{ color: m.muted }}>
          La boucle
        </div>
        <div className="mt-3 flex items-center gap-2">
          {etapes.map((e, i) => (
            <div key={e.label} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="grid h-6 w-6 flex-none place-items-center rounded-full text-[11px] font-semibold"
                  style={e.done ? { background: m.accent, color: "#0a0a0a" } : { border: `1px solid ${m.line}`, color: m.muted }}
                >
                  {e.done ? <Check size={12} /> : i + 1}
                </span>
                <span className="text-sm" style={{ color: e.done ? m.ink : m.muted }}>{e.label}</span>
              </div>
              {i < etapes.length - 1 && (
                <div className="flex flex-1 items-center gap-1">
                  <div className="h-px flex-1" style={{ background: e.done ? m.accent : m.line }} />
                  <ArrowRight size={13} style={{ color: e.done ? m.accent : m.line }} />
                </div>
              )}
            </div>
          ))}
          <Repeat size={16} style={{ color: accompli ? m.accent : m.muted, marginLeft: 4 }} />
        </div>
        <p className="mt-3 text-xs leading-relaxed" style={{ color: m.muted }}>
          L'énergie heuristique : tu essaies, tu observes, tu ajustes — puis tu recommences, un cran plus haut.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: m.line }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(faits / 3) * 100}%`, background: `linear-gradient(90deg, ${m.accent}, ${m.accent2})` }}
            />
          </div>
          <span className="text-xs" style={{ color: m.muted }}>
            {faits}/3 · {faits} {faits > 1 ? m.recompensePl : m.recompense}
          </span>
        </div>
      </div>

      {/* La boucle mène au Futur Moi — la connexion, fléchée. */}
      {accompli && (
        <div className="mt-4 flex flex-col items-center gap-1" style={{ color: m.accent }}>
          <ArrowDown size={18} />
          <span className="text-[11px] uppercase tracking-[0.18em]">La boucle t'a mené ici</span>
        </div>
      )}

      {/* Le Futur Moi — là où l'on atterrit au bout de la quête. */}
      {accompli && (
        <div
          className="mt-6 overflow-hidden rounded-2xl border"
          style={{ borderColor: m.accent, background: m.panel }}
        >
          <div
            className="px-6 py-5 text-center"
            style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${m.accent} 16%, transparent), transparent)` }}
          >
            <div className="text-xs uppercase tracking-[0.2em]" style={{ color: m.accent }}>
              Ton futur moi · le lest posé
            </div>
            <div className="mt-1.5 font-display text-2xl font-light" style={{ color: m.ink }}>
              {futur.nom}
            </div>
          </div>
          <div className="flex flex-col gap-4 px-6 py-5">
            <div>
              <div className="text-xs uppercase tracking-[0.14em]" style={{ color: m.muted }}>Pourquoi tu y es à ton meilleur</div>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: m.ink }}>{futur.pourquoi}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em]" style={{ color: m.muted }}>Ta multipotentialité, devenue force</div>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: m.ink }}>{futur.multipotentiel}</p>
            </div>
            <button
              onClick={reparcourir}
              className="mt-1 inline-flex items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-medium"
              style={{ background: `linear-gradient(90deg, ${m.accent}, ${m.accent2})`, color: "#0a0a0a" }}
            >
              <Repeat size={15} />
              Reparcourir la boucle, un cran plus haut
            </button>
          </div>
        </div>
      )}

      {/* Les trois exercices */}
      <div className="mt-6 flex flex-col gap-4">
        <Delestage key={`del-${tour}`} m={m} poids={quete.poids} id={ids.delestage} />
        <Carrefour key={`car-${tour}`} m={m} carrefour={quete.carrefour} id={ids.carrefour} />
        <Pacte key={`pac-${tour}`} m={m} geste={quete.geste} id={ids.pacte} />
      </div>
    </div>
  );
}

function Cadre({ m, num, titre, done, children }: { m: Monde; num: number; titre: string; done: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: done ? m.accent : m.line, background: m.panel }}>
      <div className="flex items-center gap-3">
        <div
          className="grid h-7 w-7 flex-none place-items-center rounded-full text-xs font-semibold"
          style={done
            ? { background: m.accent, color: "#0a0a0a" }
            : { border: `1px solid ${m.line}`, color: m.muted }}
        >
          {done ? <Check size={14} /> : num}
        </div>
        <div className="text-sm font-medium uppercase tracking-[0.14em]" style={{ color: done ? m.accent : m.ink }}>
          {titre}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

// Exercice 1 — relâcher, un à un, cinq poids.
function Delestage({ m, poids, id }: { m: Monde; poids: string[]; id: string }) {
  const done = useParcoursStore((s) => s.queteExercices[id]);
  const marquer = useParcoursStore((s) => s.marquerExercice);
  const [relaches, setRelaches] = useState<Set<number>>(new Set());

  const relacher = (i: number) => {
    const next = new Set(relaches);
    next.add(i);
    setRelaches(next);
    if (next.size === poids.length) marquer(id);
  };

  return (
    <Cadre m={m} num={1} titre="Le délestage" done={Boolean(done)}>
      {!done && (
        <p className="mb-3 text-sm" style={{ color: m.muted }}>
          Touche chaque poids pour le relâcher. Ils t'appartiennent — mais tu n'es pas obligé de les porter.
        </p>
      )}
      <div className="flex flex-wrap gap-2.5">
        {poids.map((p, i) => {
          const off = done || relaches.has(i);
          return (
            <button
              key={i}
              onClick={() => !off && relacher(i)}
              disabled={off}
              className="rounded-full border px-4 py-2 text-sm transition-all"
              style={off
                ? { borderColor: m.line, color: m.muted, opacity: 0.32, textDecoration: "line-through" }
                : { borderColor: m.accent, color: m.ink, background: `color-mix(in srgb, ${m.accent} 12%, transparent)` }}
            >
              {p}
            </button>
          );
        })}
      </div>
    </Cadre>
  );
}

// Exercice 2 — choisir la réponse qui fait grandir.
function Carrefour({ m, carrefour, id }: { m: Monde; carrefour: ReturnType<typeof queteDe>["carrefour"]; id: string }) {
  const done = useParcoursStore((s) => s.queteExercices[id]);
  const marquer = useParcoursStore((s) => s.marquerExercice);
  const [choisi, setChoisi] = useState<number | null>(null);

  const pick = (i: number) => {
    setChoisi(i);
    if (carrefour.choix[i].bon) marquer(id);
  };
  const c = choisi != null ? carrefour.choix[choisi] : null;

  return (
    <Cadre m={m} num={2} titre="Le carrefour" done={Boolean(done)}>
      <p className="text-sm leading-relaxed" style={{ color: m.ink }}>{carrefour.situation}</p>
      <div className="mt-4 flex flex-col gap-2.5">
        {carrefour.choix.map((ch, i) => {
          const actif = choisi === i;
          const bon = actif && ch.bon;
          const mauvais = actif && !ch.bon;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className="rounded-xl border px-4 py-3 text-left text-sm transition-all"
              style={{
                borderColor: bon ? m.accent : mauvais ? m.muted : m.line,
                color: m.ink,
                background: actif ? `color-mix(in srgb, ${bon ? m.accent : m.muted} 12%, transparent)` : "transparent",
              }}
            >
              {ch.texte}
            </button>
          );
        })}
      </div>
      {c && (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: c.bon ? m.accent : m.muted }}>
          {c.retour}{!c.bon && " — réessaie."}
        </p>
      )}
    </Cadre>
  );
}

// Exercice 3 — s'engager sur un geste.
function Pacte({ m, geste, id }: { m: Monde; geste: string; id: string }) {
  const done = useParcoursStore((s) => s.queteExercices[id]);
  const marquer = useParcoursStore((s) => s.marquerExercice);
  return (
    <Cadre m={m} num={3} titre="Le pacte" done={Boolean(done)}>
      <p className="text-sm leading-relaxed" style={{ color: m.ink }}>{geste}</p>
      {done ? (
        <p className="mt-3 text-sm" style={{ color: m.accent }}>Engagement pris. À toi de le tenir.</p>
      ) : (
        <button
          onClick={() => marquer(id)}
          className="mt-4 rounded-full px-6 py-2.5 text-sm font-medium"
          style={{ background: `linear-gradient(90deg, ${m.accent}, ${m.accent2})`, color: "#0a0a0a" }}
        >
          Je m'engage
        </button>
      )}
    </Cadre>
  );
}
