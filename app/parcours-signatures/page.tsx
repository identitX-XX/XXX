"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronDown, Dumbbell, GraduationCap } from "lucide-react";
import { PageHead } from "@/components/ui";
import { DayStrip } from "@/components/DayStrip";
import { Dashboard } from "@/parcours-archetypes/components/Dashboard";
import { Diagnostic } from "@/parcours-archetypes/components/Diagnostic";
import { Objectifs } from "@/parcours-archetypes/components/Objectifs";
import { JourView } from "@/parcours-archetypes/components/JourView";
import { useParcoursStore } from "@/parcours-archetypes/store";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";
import { detecterChapitres, derniereBascule } from "@/parcours-archetypes/bascules";
import type { Diagnostic as Diag, Objectifs as ObjectifsT, EtatEvolution } from "@/parcours-archetypes/types";

// Route du module. Tant que le dominant n'est pas déterminé, on présente le
// diagnostic (écran-miroir). Une fois fait, il ouvre le parcours 30 jours.
// Enveloppé dans <Suspense> car on lit le paramètre ?jour= (useSearchParams).
export default function ParcoursArchetypesPage() {
  return (
    <Suspense fallback={<ParcoursSkeleton />}>
      <ParcoursContent />
    </Suspense>
  );
}

// Squelette d'attente — remplace l'écran blanc le temps que la page s'arme.
function ParcoursSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="idx-skeleton mb-3 h-3 w-28" />
      <div className="idx-skeleton mb-6 h-8 w-3/4" />
      <div className="idx-skeleton mb-3 h-24 w-full" />
      <div className="idx-skeleton mb-3 h-40 w-full" />
      <div className="idx-skeleton h-40 w-full" />
    </div>
  );
}

function ParcoursContent() {
  const parcours = useParcoursStore((s) => s.parcours);
  const jourCourant = useParcoursStore((s) => s.etat.jourCourant);
  const reponses = useParcoursStore((s) => s.reponses);
  const diagnostic = useParcoursStore((s) => s.diagnostic);
  const objectifs = useParcoursStore((s) => s.objectifs);
  const etat = useParcoursStore((s) => s.etat);

  // Jour demandé via l'URL (?jour=N), p. ex. depuis la Progression.
  const searchParams = useSearchParams();
  const jourParam = Number(searchParams.get("jour"));

  // Jour sélectionné à l'écran (suit le jour courant par défaut, mais on peut
  // revenir sur n'importe quelle journée déjà close).
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  useEffect(() => {
    setSelectedDay((d) => (d == null ? Math.min(jourCourant, 30) : d));
  }, [jourCourant]);
  // Ouvre le jour demandé par l'URL (s'il est atteint).
  useEffect(() => {
    if (jourParam >= 1 && jourParam <= 30 && jourParam <= jourCourant) {
      setSelectedDay(jourParam);
    }
  }, [jourParam, jourCourant]);

  // Les grandes bascules du module (diagnostic → objectifs → parcours) ne sont
  // PAS des changements de route : le ScrollTop global ne s'y déclenche pas. On
  // remet donc en haut à chaque bascule, sinon on hérite du scroll de l'écran
  // précédent (ex. arriver sur « Perso » avec le titre coupé sous le header).
  const phase = !diagnostic ? "diag" : !objectifs ? "obj" : "parcours";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [phase]);

  const jourN = selectedDay ?? Math.min(jourCourant, 30);
  const jour = parcours.jours.find((j) => j.n === jourN) ?? null;
  const reponseDuJour = reponses[jourN];
  const termine = jourCourant > 30;

  return (
    <div>
      {!diagnostic ? (
        <Diagnostic />
      ) : !objectifs ? (
        <Objectifs />
      ) : (
      <>

      {/* En-tête du module — seulement une fois le parcours lancé, pour ne pas
          écraser l'écran des questions (il respire : juste « Ma quête »). */}
      {/* J1 : en-tête complet (contexte utile). J2+ : version compacte, le
          paragraphe se replie derrière « En savoir plus » pour rendre l'écran
          au quotidien (il occupait ~40 % de la hauteur, répété chaque jour). */}
      {jourCourant <= 1 ? (
        <PageHead
          eyebrow="Module"
          title="Parcours des 20 signatures"
          sub="Ta signature n'est pas figée, elle oscille dans un mouvement permanent — qui soutient ta mécanique d'expansion ou celle de tes schémas connus."
        />
      ) : (
        <div className="mb-8 animate-fade-up">
          <div className="mb-2 text-xs uppercase tracking-[0.25em] text-fuchsia">Module</div>
          <h1 className="font-display text-xl font-light leading-tight text-ink">
            Parcours des 20 signatures
          </h1>
          <details className="group mt-1">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs text-fuchsia [&::-webkit-details-marker]:hidden">
              En savoir plus
              <ChevronDown size={13} className="transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Ta signature n'est pas figée, elle oscille dans un mouvement permanent — qui soutient ta mécanique d'expansion ou celle de tes schémas connus.
            </p>
          </details>
        </div>
      )}

      {/* « Ma quête » : la vue qui relie ce qui l'anime, ce qu'elle construit,
          ce qu'elle explore et ce qui évolue — les quatre fils du parcours. */}
      {diagnostic && (
        <MaQueteApercu diagnostic={diagnostic} objectifs={objectifs} etat={etat} />
      )}

      {/* Adossé au module, une fois le parcours lancé : les exercices (Quête) et
          les savoirs. Ils n'encombrent plus l'entrée du diagnostic. */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/quete"
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-fuchsia"
        >
          <Dumbbell size={18} className="flex-none text-fuchsia" />
          <span className="flex-1 text-sm text-ink">Les exercices de ta Quête — se délester, choisir, s'engager</span>
          <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
        </Link>
        <Link
          href="/ressources"
          className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-fuchsia"
        >
          <GraduationCap size={18} className="flex-none text-fuchsia" />
          <span className="flex-1 text-sm text-ink">Les savoirs — neurosciences & psychologie de l'identité</span>
          <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
        </Link>
      </div>


      {/* Frise des 30 jours : relecture de l'historique, sans rien perdre */}
      <DayStrip
        jourCourant={jourCourant}
        selected={jourN}
        reponses={reponses}
        onSelect={setSelectedDay}
      />

      {termine && (
        <p className="mb-8 text-sm text-muted">
          Les 30 jours sont clos. Tu peux revoir chaque journée ci-dessus — ton
          radar reflète tout le chemin.
        </p>
      )}

      {jour && (
        <section style={{ marginBottom: 48 }}>
          <JourView
            key={jour.n}
            jour={jour}
            reponse={reponseDuJour}
            onClose={(r) => setSelectedDay(Math.min(r.jour + 1, 30))}
          />
        </section>
      )}

      <Dashboard />
      </>
      )}
    </div>
  );
}

// « Ma quête » — les quatre fils reliés : ce qui l'anime (sa signature), ce
// qu'elle construit (ses directions), ce qu'elle explore (sa secondaire) et ce
// qui évolue (ses mues). Chaque section pointe vers une donnée réelle du
// parcours, jamais un texte creux.
function MaQueteApercu({
  diagnostic,
  objectifs,
  etat,
}: {
  diagnostic: Diag;
  objectifs: ObjectifsT | null;
  etat: EtatEvolution;
}) {
  const dom = archetypeByKey[diagnostic.dominant];
  const sec = archetypeByKey[diagnostic.secondaire];
  const caps = objectifs
    ? [objectifs.perso, objectifs.pro, objectifs.relationnel].filter((v) => v && v.trim())
    : [];
  // Détection de mue : blindée (un historique d'ancienne version peut avoir une
  // autre forme et faire planter la segmentation → on tombe alors sur « pas de
  // mue » au lieu de casser toute la page).
  let mue: ReturnType<typeof derniereBascule> = null;
  try {
    mue = derniereBascule(detecterChapitres(etat.historique));
  } catch {
    mue = null;
  }

  const sections = [
    {
      titre: "Ce qui m'anime",
      hint: "Ce qui me donne naturellement de l'énergie.",
      valeur: dom.name,
      href: "/synthese",
      cta: "Voir ton portrait",
    },
    {
      titre: "Ce que je construis",
      hint: caps.length
        ? "Tes directions — et ce qu'elles rendent possible."
        : "Ce que je souhaite faire exister.",
      valeur: caps.length ? caps.join(" · ") : "À préciser",
      href: caps.length ? "/scenarios" : "/progression",
      cta: caps.length ? "Voir ce que ça ouvre" : "Poser tes directions",
    },
    {
      titre: "Ce que j'explore",
      hint: "Les dimensions que je veux mieux comprendre.",
      valeur: sec.name,
      href: "/explorer",
      cta: "Explorer",
    },
    {
      titre: "Ce qui évolue",
      hint: "Les changements que je commence à percevoir.",
      valeur: mue
        ? `De ${archetypeByKey[mue.depuis].name} à ${archetypeByKey[mue.vers].name}`
        : "Tes premières observations se dessinent",
      href: "/progression",
      cta: "Suivre l'évolution",
    },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-line bg-surface p-6 animate-fade-up">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia">Ma quête</div>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Ta quête relie ce que tu observes, ce que tu veux faire émerger et les
        directions que tu choisis d'explorer. Chaque fil est cliquable.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.titre}
            href={s.href}
            className="group flex flex-col rounded-xl border border-line p-4 transition-colors hover:border-fuchsia"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">{s.titre}</div>
              <ArrowUpRight size={15} className="flex-none text-muted transition-colors group-hover:text-fuchsia" />
            </div>
            <div className="mt-0.5 text-xs text-muted">{s.hint}</div>
            <div className="mt-2 font-display text-base font-semibold leading-snug text-ink">
              {s.valeur}
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-fuchsia">
              {s.cta} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
