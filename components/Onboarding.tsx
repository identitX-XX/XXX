"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { track } from "@/lib/metrics";
import { Profile } from "@/types";
import { Button, TextInput } from "./ui";
import { Constellation } from "./Constellation";
import { ADN, Planetes, Neurones, EcartVisu, Possibles, Orbite } from "./ParcoursGraphics";

// Onboarding « classe mondiale » : court, graphique, pédagogique. Six étapes qui
// racontent le parcours — Bienvenue · Faisons connaissance · Exploration ·
// Signature · Le rythme · Le mouvement — avant de révéler le diagnostic. Une
// seule saisie : le prénom. Le reste du profil se complète au fil de la quête
// (profil progressif), jamais en barrage à l'entrée.
export function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [intention, setIntention] = useState("");
  // La section actuellement à l'écran (défilement vertical), pour le fil de
  // progression — la mesure reste discrète, le rituel garde son repère.
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Le prénom (étape 1) reste requis : la dernière action est verrouillée tant
  // qu'il n'est pas saisi — le gate, préservé malgré le défilement libre.
  const canFinish = name.trim().length > 0;

  // On suit la section la plus visible : elle pilote le fil de progression.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      // Seuil bas + marge centrée : sur une étape plus haute que l'écran (ex. le
      // formulaire), on détecte quand même correctement l'étape active.
      { threshold: 0.4, rootMargin: "-20% 0px -20% 0px" }
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (i: number) =>
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const finish = () => {
    if (!canFinish) {
      scrollTo(steps.length - 1); // il manque le prénom : on y ramène plutôt que de bloquer sec
      return;
    }
    const mot = intention.trim();
    const profile: Profile = {
      name: name.trim(),
      age: age.trim(),
      situation: "",
      goal: mot,
      energy: 60,
      clarity: 50,
      blocker: "",
      understand: "",
      values: ["", "", ""],
      strengths: ["", "", ""],
      fear: "",
      ambition: "",
      keyword: mot && !mot.includes(" ") ? mot : "",
    };
    complete(profile);
    track("onboarding_completed");
    // Droit aux questions : plus d'écran intermédiaire « Qui es-tu » qui
    // apparaissait entre l'onboarding et le diagnostic (double départ).
    router.push("/parcours-signatures");
  };

  // Six temps, empilés et « scroll-snap » : Bienvenue → Faisons connaissance →
  // Exploration → Signature → Le tempo → Le mouvement. On glisse de l'un à
  // l'autre ; le diagnostic (les 20 signatures) ne vient qu'APRÈS.
  // Le déroulé : manifeste → présentation premium de chaque composant réel
  // (signature, territoires, exercices, coach, scénarios, quête) → « tout est
  // dans le menu » → la seule saisie (prénom) → puis le questionnaire.
  const steps = [
    <StepAccueil key="accueil" />,
    <StepSignature key="signature" />,
    <StepTerritoires key="territoires" />,
    <StepExercices key="exercices" />,
    <StepCoach key="coach" />,
    <StepScenarios key="scenarios" />,
    <StepQuete key="quete" />,
    <StepMenu key="menu" />,
    <StepPrenom
      key="prenom"
      name={name}
      setName={setName}
      age={age}
      setAge={setAge}
      intention={intention}
      setIntention={setIntention}
    />,
  ];
  const STEPS = steps.length;

  return (
    <div className="relative min-h-[100dvh]">
      {/* Champ bleuté très discret, sous le ton doré : il fait « ressortir » les
          blocs de verre, comme s'ils glissaient sur une profondeur. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 75% at 50% 12%, rgba(84,112,205,0.12), transparent 58%)",
        }}
      />
      {/* Fil de progression, fixé en tête — le point d'ancrage du rituel. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 bg-gradient-to-b from-noir via-noir/90 to-transparent px-6 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="mx-auto flex max-w-lg items-center justify-between text-xs text-muted">
          <span>Étape {active + 1} sur {STEPS}</span>
          <span>≈ 2 min</span>
        </div>
        <div className="mx-auto mt-2 flex max-w-lg gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= active ? "brand-gradient" : "bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Un seul long déroulé vertical : les étapes s'enchaînent au défilement,
          chacune un bloc plein écran qui « respire », sans tap « Continuer » à
          chaque marche. Seule la dernière action (Commencer) conclut le rituel. */}
      {steps.map((content, i) => (
        <section
          key={i}
          data-idx={i}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className={`flex min-h-[100dvh] flex-col justify-center px-6 pb-14 ${
            i === 0
              ? "pt-[calc(6rem+env(safe-area-inset-top))]"
              : "pt-[calc(5rem+env(safe-area-inset-top))]"
          }`}
        >
          <div className="mx-auto w-full max-w-lg animate-fade-up rounded-[1.75rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(90,118,208,0.08),rgba(90,118,208,0.02))] px-5 py-9 shadow-[0_24px_70px_-34px_rgba(72,102,200,0.55)] backdrop-blur-[7px]">
            {content}
          </div>

          {/* Flèche « continuer » entre chaque bloc : elle invite à glisser vers
              le suivant (défilement fluide). Le libellé n'apparaît que sur la
              première marche ; ensuite, la seule flèche suffit. */}
          {i < STEPS - 1 && (
            <button
              onClick={() => scrollTo(i + 1)}
              className="group mx-auto mt-9 flex flex-col items-center gap-1 text-[12px] font-bold uppercase tracking-[0.18em] text-fuchsia/85 transition-colors hover:text-fuchsia"
              aria-label="Continuer"
            >
              {i === 0 && <span>Fais défiler</span>}
              <ChevronDown size={i === 0 ? 20 : 24} className="animate-bounce" />
            </button>
          )}
        </section>
      ))}

      {/* L'action finale — dans le flux, en fin de déroulé : impossible à rater,
          impossible à recouvrir. Le prénom reste requis (gate doux). */}
      <section className="flex flex-col px-6 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-2">
          <Button
            onClick={finish}
            disabled={!canFinish}
            className="w-full justify-center"
          >
            Révéler ma signature <ArrowRight size={16} />
          </Button>
          {!canFinish && (
            <button
              onClick={() => scrollTo(steps.length - 1)}
              className="text-xs text-muted underline underline-offset-2"
            >
              Il manque juste ton prénom — appuie pour l'ajouter
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

// Étape 0 — le MANIFESTE : l'objet d'Constellation, plein écran, sur fond
// constellation (la signature graphique de la marque). C'est la première chose
// qu'on voit après la connexion — avant tout le reste.
const MANIFESTE = [
  "Identifier tes schémas",
  "Déconstruire tes réflexes",
  "Explorer tes possibles",
  "Réécrire tes nouvelles légendes qui résonnent",
];

export function StepAccueil() {
  return (
    <div className="relative flex min-h-[62vh] flex-col justify-center text-center">
      {/* Constellation en fond — grande, douce, elle occupe la page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
      >
        <Constellation size={360} />
      </div>

      <div className="relative">
        <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-fuchsia">
          Bienvenue dans ma constellation d'explorations
        </div>
        <h1 className="mx-auto mt-5 max-w-md font-display text-[1.9rem] font-bold leading-[1.15] text-ink">
          Ton identité est une signature invisible &amp; multifactorielle.
        </h1>

        <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.2em] text-fuchsia">
          Entre dans la quête pour
        </p>
        <ul className="mx-auto mt-4 flex max-w-xs flex-col gap-3 text-left">
          {MANIFESTE.map((m) => (
            <li key={m} className="flex items-start gap-3">
              <span
                className="mt-2 h-1.5 w-1.5 flex-none rotate-45"
                style={{ background: "linear-gradient(120deg,var(--fuchsia),var(--orange))" }}
              />
              <span className="text-[15px] leading-snug text-ink">{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Étape « signature » — enseigne le chemin : trois stations reliées, graphique.
// Gabarit d'une étape de présentation premium : surtitre, figure symbolique,
// titre, texte. Une même respiration pour toutes les marches.
function StageP({
  eyebrow,
  titre,
  texte,
  graphic,
}: {
  eyebrow: string;
  titre: string;
  texte: string;
  graphic: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">{eyebrow}</div>
      <h2 className="mx-auto mt-3 max-w-md font-display text-2xl font-bold leading-tight text-ink">
        {titre}
      </h2>
      <div className="mx-auto mt-7 max-w-sm">{graphic}</div>
      <p className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-muted">{texte}</p>
    </div>
  );
}

// La signature — ADN.
export function StepSignature() {
  return (
    <StageP
      eyebrow="Ta signature"
      titre="Une signature identitaire unique"
      graphic={<ADN />}
      texte="12 questions révèlent ta signature principale et ta secondaire — ton point de départ. C'est la toute première étape, avant tout le reste."
    />
  );
}

// Les territoires — planètes + valeurs / forces / compétences.
export function StepTerritoires() {
  return (
    <StageP
      eyebrow="Tes territoires"
      titre="Trois territoires"
      graphic={<Planetes />}
      texte="Perso, pro, relationnel. Sur chacun se révèlent tes valeurs, tes forces, tes compétences — rassemblées dans « Ton portrait »."
    />
  );
}

// Les exercices — l'écart croire / penser / faire.
export function StepExercices() {
  return (
    <StageP
      eyebrow="Tes exercices"
      titre="Des exercices qui te mettent en mouvement"
      graphic={<EcartVisu />}
      texte="L'écart entre ce que tu crois, penses et fais — sur chaque territoire. Et d'autres pratiques qui tournent chaque jour : délestage, expérimentation, recadrage, projection, ancrage… Chacune nourrit ton éclairage."
    />
  );
}

// Le coach — réseau de neurones.
export function StepCoach() {
  return (
    <StageP
      eyebrow="Ton coach"
      titre="Un coach qui connaît ta signature"
      graphic={<Neurones />}
      texte="On analyse tes réponses, on t'éclaire, on relie l'écart à ta signature du moment et on projette la suite."
    />
  );
}

// Les scénarios — arborescence de possibles.
export function StepScenarios() {
  return (
    <StageP
      eyebrow="Tes scénarios"
      titre="Ce que tes directions rendent possible"
      graphic={<Possibles />}
      texte="Tes directions génèrent des scénarios concrets à tenter — des futurs activables, pas un portrait à contempler."
    />
  );
}

// La quête — orbite des 30 jours.
export function StepQuete() {
  return (
    <StageP
      eyebrow="La quête"
      titre="30 jours de redéploiement"
      graphic={<Orbite />}
      texte="Ta signature se déplace, tes possibles s'actualisent, tes légendes se réécrivent. Tout se joue ici — après avoir révélé ta signature."
    />
  );
}

// Récapitulatif — tout se retrouve dans le menu, et on reprend là où on en était.
export function StepMenu() {
  const items = [
    "Ta signature",
    "Ton portrait — valeurs, forces, compétences",
    "Tes exercices",
    "La cartographie",
    "Tes scénarios",
    "Le coach",
    "Ton rapport analytique",
    "Tes ressources",
  ];
  return (
    <div className="text-center">
      <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">Tout est à portée</div>
      <h2 className="mx-auto mt-3 max-w-md font-display text-2xl font-bold leading-tight text-ink">
        Tu retrouves tout ça dans le menu
      </h2>
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        À tout moment, via le menu (☰), tu accèdes à chaque partie de ta quête —
        et tu reprends toujours là où tu t'étais arrêtée.
      </p>
      <ul className="mx-auto mt-6 grid max-w-sm grid-cols-1 gap-2 text-left sm:grid-cols-2">
        {items.map((m) => (
          <li key={m} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
            <span
              className="mt-1.5 h-1.5 w-1.5 flex-none rotate-45"
              style={{ background: "linear-gradient(120deg,var(--fuchsia),var(--orange))" }}
            />
            <span className="text-[13.5px] leading-snug text-ink">{m}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Étape 3 — la seule saisie : le prénom (requis) + une intention (optionnelle).
function StepPrenom({
  name, setName, age, setAge, intention, setIntention,
}: {
  name: string;
  setName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  intention: string;
  setIntention: (v: string) => void;
}) {
  // Un libellé de champ à fort contraste (lisible sur le bloc de verre) + une
  // aide un cran plus claire que le gris « muted », pour que le formulaire se
  // remplisse sans effort.
  const Champ = ({
    titre, aide, children,
  }: { titre: string; aide: string; children: React.ReactNode }) => (
    <div>
      <p className="mb-1 text-[15px] font-semibold text-ink">{titre}</p>
      <p className="mb-2 text-[13px] leading-relaxed text-ink/70">{aide}</p>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">
          Faisons connaissance
        </div>
        <p className="mx-auto mt-3 max-w-sm text-[15px] font-medium leading-relaxed text-ink/85">
          Avant d'explorer ta constellation, donne-nous quelques repères.
        </p>
      </div>
      <Champ titre="Ton prénom" aide="Comment souhaites-tu être appelé·e ?">
        <TextInput value={name} onChange={setName} placeholder="Ton prénom" />
      </Champ>
      <Champ titre="Ton âge approximatif" aide="Chaque période de vie ouvre des questions différentes.">
        <TextInput value={age} onChange={setAge} placeholder="ex. la trentaine, 42…" />
      </Champ>
      <Champ titre="Ton intention du moment" aide="Qu'aimerais-tu mieux comprendre, clarifier ou faire évoluer ?">
        <TextInput value={intention} onChange={setIntention} placeholder="ex. clarté, oser, alignement…" />
      </Champ>
      <p className="text-center text-[13px] italic leading-relaxed text-ink/60">
        Tu peux modifier ces informations à tout moment.
      </p>
      <p className="text-center text-[13px] leading-relaxed text-ink/60">
        En continuant, tu acceptes les{" "}
        <a href="/cgu" target="_blank" rel="noopener noreferrer" className="text-fuchsia underline">
          conditions d'utilisation
        </a>{" "}
        et la{" "}
        <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="text-fuchsia underline">
          politique de confidentialité
        </a>
        .
      </p>
    </div>
  );
}
