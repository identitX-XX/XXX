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
export type Genre = "femme" | "homme" | "np";

export function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const router = useRouter();
  const [gender, setGender] = useState<Genre | "">("");
  const [age, setAge] = useState("");
  const [intention, setIntention] = useState("");
  // La section actuellement à l'écran (défilement vertical), pour le fil de
  // progression — la mesure reste discrète, le rituel garde son repère.
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Le genre (dernière étape) reste requis : la dernière action est verrouillée
  // tant qu'il n'est pas choisi — le gate, préservé malgré le défilement libre.
  const canFinish = gender !== "";

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
      scrollTo(steps.length - 1); // il manque le genre : on y ramène plutôt que de bloquer sec
      return;
    }
    const mot = intention.trim();
    const profile: Profile = {
      name: "", // plus de prénom demandé : on s'adresse à « toi »
      gender: (gender || undefined) as Profile["gender"],
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
    track("onboarding_completed", { gender });
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
    <StepIdentite
      key="identite"
      gender={gender}
      setGender={setGender}
      age={age}
      setAge={setAge}
      intention={intention}
      setIntention={setIntention}
      canFinish={canFinish}
      onFinish={finish}
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
          className={`flex flex-col px-6 pb-14 ${
            i === STEPS - 1 ? "min-h-[60vh] justify-start" : "min-h-[100dvh] justify-center"
          } ${
            i === 0
              ? "pt-[calc(6rem+env(safe-area-inset-top))]"
              : "pt-[calc(5rem+env(safe-area-inset-top))]"
          }`}
        >
          <div className="mx-auto w-full max-w-lg animate-fade-up rounded-[1.75rem] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(90,118,208,0.10),rgba(90,118,208,0.03))] px-5 py-9 shadow-[0_24px_70px_-34px_rgba(72,102,200,0.55)]">
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

      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))]" />
    </div>
  );
}

// Étape 0 — le MANIFESTE : l'objet d'IdentitX, plein écran, sur fond
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
          Bienvenue dans IdentitX
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
      texte="Quelques questions révèlent ta signature principale et tes deux signatures secondaires — ton point de départ. C'est la toute première étape, avant tout le reste."
    />
  );
}

// Les territoires — planètes + valeurs / forces / compétences.
export function StepTerritoires() {
  return (
    <StageP
      eyebrow="Tes piliers"
      titre="Quatre piliers de vie"
      graphic={<Planetes />}
      texte="Relationnel & famille, love, pro, santé. Sur chacun, tu choisis une direction — et ta quête t'y fait avancer, un geste à la fois."
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
      texte="L'écart entre ce que tu crois, penses et fais — sur chaque pilier. Et d'autres pratiques qui tournent chaque jour : expérimentation, recadrage, projection, ancrage… Chacune nourrit ton éclairage."
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

// La quête — le redéploiement, à ton rythme.
export function StepQuete() {
  return (
    <StageP
      eyebrow="La quête"
      titre="Un redéploiement, à ton rythme"
      graphic={<Orbite />}
      texte="Ta signature se déplace, tes possibles s'actualisent, tes légendes se réécrivent. Tu avances quand tu veux — rien n'est chronométré."
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

// Libellé de champ à fort contraste (lisible sur le bloc), défini AU NIVEAU
// MODULE : une identité stable évite que React ne remonte les champs à chaque
// frappe (sinon l'input perd le focus et la page saute).
function Champ({
  titre, aide, children,
}: { titre: string; aide: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[15px] font-semibold text-ink">{titre}</p>
      <p className="mb-2 text-[13px] leading-relaxed text-ink/70">{aide}</p>
      {children}
    </div>
  );
}

// Étape finale — l'intake : genre (requis, 3 choix) + âge approximatif +
// intention (optionnelle). Plus de prénom : on s'adresse à « toi ».
function StepIdentite({
  gender, setGender, age, setAge, intention, setIntention, canFinish, onFinish,
}: {
  gender: Genre | "";
  setGender: (v: Genre) => void;
  age: string;
  setAge: (v: string) => void;
  intention: string;
  setIntention: (v: string) => void;
  canFinish: boolean;
  onFinish: () => void;
}) {
  const GENRES: { key: Genre; label: string }[] = [
    { key: "femme", label: "Femme" },
    { key: "homme", label: "Homme" },
    { key: "np", label: "Je préfère ne pas dire" },
  ];
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-fuchsia">
          Faisons connaissance
        </div>
        <p className="mx-auto mt-3 max-w-sm text-[15px] font-medium leading-relaxed text-ink/85">
          Deux repères, et on entre dans ta quête. Pas de prénom : ici, on se
          parle en « tu ».
        </p>
      </div>
      <Champ titre="Tu es…" aide="Pour un ton juste. IdentitX accueille les femmes comme les hommes.">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {GENRES.map((g) => {
            const on = gender === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setGender(g.key)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  on
                    ? "border-fuchsia bg-fuchsia/10 text-ink"
                    : "border-line bg-surface text-muted hover:border-fuchsia/50 hover:text-ink"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </Champ>
      <Champ titre="Ton âge approximatif" aide="Chaque période de vie ouvre des questions différentes. (facultatif)">
        <TextInput value={age} onChange={setAge} placeholder="ex. la trentaine, 42…" />
      </Champ>
      <Champ titre="Ton intention du moment" aide="Qu'aimerais-tu mieux comprendre, clarifier ou faire évoluer ? (facultatif)">
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

      {/* L'action finale, juste sous les champs : impossible à rater, pas besoin
          de chercher un bouton perdu en bas de page. Le prénom reste requis. */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <Button onClick={onFinish} disabled={!canFinish} className="w-full justify-center">
          Révéler ma signature <ArrowRight size={16} />
        </Button>
        {!canFinish && (
          <p className="text-xs text-muted">Choisis une option ci-dessus pour continuer.</p>
        )}
      </div>
    </div>
  );
}
