"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Card, PageHead } from "@/components/ui";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { genererScenarios, labelPerimetre, Perimetre } from "@/parcours-archetypes/scenarios";
import { detecterChapitres, derniereBascule } from "@/parcours-archetypes/bascules";

// Première phrase d'un texte (pour un aperçu compact de l'ombre secondaire).
function premierePhrase(t: string): string {
  const i = t.indexOf(". ");
  return i > 0 ? t.slice(0, i + 1) : t;
}

// Rapport final : 3 scénarios de sortie activables, un par périmètre de vie,
// générés depuis les éclairages de la progression. Activer = choisir son plan.
export default function RapportPage() {
  const etat = useParcoursStore((s) => s.etat);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const [actif, setActif] = useState<Perimetre | null>(null);

  // Garde-fou : on exige un diagnostic COHÉRENT (clés d'archétype connues) et de
  // la matière vécue. Protège contre tout état incohérent (import, migration).
  if (
    !diagnostic ||
    etat.historique.length === 0 ||
    !archetypeByKey[diagnostic.dominant] ||
    !archetypeByKey[diagnostic.secondaire]
  ) {
    return (
      <div>
        <PageHead
          eyebrow="30 jours"
          title="Ce qui a émergé"
          sub="Ton bilan se tisse à partir de ce que tu vis. Traverse quelques journées, puis reviens le découvrir."
        />
        <Link href="/parcours-signatures" className="text-sm text-fuchsia hover:underline">
          ← Aller au parcours
        </Link>
      </div>
    );
  }

  const scenarios = genererScenarios(etat, diagnostic.dominant, diagnostic.secondaire);
  const dom = archetypeByKey[diagnostic.dominant];
  const sec = archetypeByKey[diagnostic.secondaire];

  // Ce qui a évolué : la dernière mue traversée, si le parcours en a détecté une.
  // Blindé : un historique d'ancienne version ne doit pas casser le rapport.
  let mue: ReturnType<typeof derniereBascule> = null;
  try {
    mue = derniereBascule(detecterChapitres(etat.historique));
  } catch {
    mue = null;
  }
  const caps = objectifs
    ? [objectifs.perso, objectifs.pro, objectifs.relationnel].filter((v) => v && v.trim())
    : [];

  const emerge = [
    {
      titre: "Ce qui s'est confirmé",
      hint: "Les forces et dynamiques qui reviennent naturellement.",
      corps: dom.force
        ? `${dom.name} — ${dom.force}`
        : `${dom.name} revient comme ta dynamique la plus présente.`,
    },
    {
      titre: "Ce qui a évolué",
      hint: "Les changements apparus au fil de tes observations.",
      corps: mue
        ? `Un vortex s'est amorcé : de ${archetypeByKey[mue.depuis].name} à ${archetypeByKey[mue.vers].name}.`
        : `${dom.name} s'est affirmée au fil des journées, sans bascule majeure.`,
    },
    {
      titre: "Ce qui demande encore à être exploré",
      hint: "Les zones ouvertes, les tensions et les questions qui restent vivantes.",
      corps: dom.ombre
        ? dom.ombre
        : sec.ombre
        ? premierePhrase(sec.ombre)
        : "Les zones que tu n'as pas encore eu le temps de regarder.",
    },
    {
      titre: "La direction qui se dessine",
      hint: "Le mouvement que tu souhaites poursuivre.",
      corps: caps.length ? caps.join(" · ") : "À préciser dans tes voies de sortie ci-dessous.",
    },
  ];

  return (
    <div>
      <PageHead
        eyebrow="30 jours"
        title="Ce qui a émergé"
        sub="Pendant 30 jours, tu as observé comment tes différentes dimensions s'expriment, se rencontrent et évoluent."
      />

      <Link
        href="/progression"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-fuchsia hover:underline"
      >
        <ArrowLeft size={15} />
        Retour à ta progression
      </Link>

      {/* Les quatre lectures de la traversée — confirmé · évolué · à explorer ·
          direction — chacune adossée à ce que le parcours a réellement produit. */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {emerge.map((e) => (
          <Card key={e.titre} className="p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-fuchsia">
              {e.titre}
            </div>
            <div className="mt-1 text-xs text-muted">{e.hint}</div>
            <p className="mt-3 text-sm leading-relaxed text-ink">{e.corps}</p>
          </Card>
        ))}
      </div>

      {/* La partie actionnable : trois voies de sortie, une par territoire. */}
      <h2 className="mb-3 font-display text-2xl font-light text-ink">
        Tes voies de sortie
      </h2>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted">
        Trois voies concrètes, une par territoire, éclairées par tout ce que tu
        as traversé. Active celle qui te parle — elle devient ton plan.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {scenarios.map((s) => {
          const on = actif === s.perimetre;
          return (
            <Card
              key={s.perimetre}
              className={`flex flex-col p-6 transition-all ${on ? "border-fuchsia shadow-glow" : ""}`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-fuchsia">
                {labelPerimetre(s.perimetre)} · {s.mouvement}
              </div>
              {objectifs?.[s.perimetre]?.trim() && (
                <div className="mt-2 rounded-lg border border-line bg-noir p-2.5 text-xs text-muted">
                  <span className="uppercase tracking-wider text-[12px]">Ton objectif</span>
                  <div className="mt-0.5 text-ink">{objectifs[s.perimetre]}</div>
                </div>
              )}
              <h3 className="mt-3 font-display text-xl font-light text-ink">{s.titre}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.texte}</p>
              <div className="mt-3 text-xs text-muted">
                S'appuie sur <span className="text-ink">{s.appui}</span>
              </div>
              <button
                onClick={() => setActif(on ? null : s.perimetre)}
                className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  on
                    ? "brand-gradient text-[color:var(--on-brand)]"
                    : "border border-line text-ink hover:border-fuchsia hover:text-fuchsia"
                }`}
              >
                {on ? (<><Check size={15} /> Scénario activé</>) : "Activer ce scénario"}
              </button>
            </Card>
          );
        })}
      </div>

      {actif && (
        <Card className="mt-6 p-5">
          <p className="text-sm text-ink">
            <span className="font-medium">Plan activé — {labelPerimetre(actif)}.</span>{" "}
            <span className="text-muted">
              Tu peux en activer un autre à tout moment ; les trois voies restent disponibles.
            </span>
          </p>
        </Card>
      )}

      {/* Clôture — l'arc « légende » ouvert à l'accueil se referme ici, au J30. */}
      <div className="mt-12 text-center">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted">
          Tu n'as pas trouvé une définition définitive de toi. Tu as rendu
          visibles de nouvelles directions.
        </p>
        <p className="mx-auto mt-5 max-w-md font-display text-lg font-light italic leading-snug text-ink">
          Ta légende n'est pas terminée. Elle vient de s'ouvrir.
        </p>
      </div>
    </div>
  );
}
