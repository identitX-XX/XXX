"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { track } from "@/lib/metrics";
import { Profile } from "@/types";
import { PHASES } from "@/parcours-archetypes/archetypes";
import { Button, Label, TextInput } from "./ui";
import { Constellation } from "./Constellation";
import { Glyph } from "./Glyph";

// Onboarding « classe mondiale » : court, graphique, pédagogique. Six étapes qui
// racontent le parcours — Bienvenue · Faisons connaissance · Exploration ·
// Signature · Le rythme · Le mouvement — avant de révéler le diagnostic. Une
// seule saisie : le prénom. Le reste du profil se complète au fil de la quête
// (profil progressif), jamais en barrage à l'entrée.
const STEPS = 6;

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
      scrollTo(1); // il manque le prénom : on y ramène plutôt que de bloquer sec
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
  const steps = [
    <StepAccueil key="accueil" />,
    <StepPrenom
      key="prenom"
      name={name}
      setName={setName}
      age={age}
      setAge={setAge}
      intention={intention}
      setIntention={setIntention}
    />,
    <StepTerritoires key="territoires" />,
    <StepChemin key="chemin" />,
    <StepRythme key="rythme" />,
    <StepMouvement key="mouvement" />,
  ];

  return (
    <div className="min-h-[100dvh]">
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

      {steps.map((content, i) => {
        const last = i === STEPS - 1;
        return (
          <section
            key={i}
            data-idx={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="flex min-h-[100dvh] flex-col px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))]"
          >
            {/* Le contenu, centré quand il est court, qui pousse le bouton plus
                bas quand il est long. */}
            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center animate-fade-up">
              {content}
            </div>

            {/* L'action, TOUJOURS dans le flux (jamais en absolu) : elle reste
                accessible même quand le contenu dépasse l'écran. */}
            <div className="mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-2">
              {last ? (
                <>
                  <Button
                    onClick={finish}
                    disabled={!canFinish}
                    className="w-full justify-center"
                  >
                    Commencer mon parcours <ArrowRight size={16} />
                  </Button>
                  {!canFinish && (
                    <button
                      onClick={() => scrollTo(1)}
                      className="text-xs text-muted underline underline-offset-2"
                    >
                      Il manque juste ton prénom — appuie pour l'ajouter
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => scrollTo(i + 1)}
                  className="flex flex-col items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-fuchsia"
                  aria-label="Continuer"
                >
                  Continuer
                  <ChevronDown size={20} className="animate-bounce" />
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// Étape 0 — la promesse, portée par le motif, presque sans texte.
function StepAccueil() {
  return (
    <div className="text-center">
      <div className="text-base font-bold uppercase tracking-[0.2em] text-fuchsia">Bienvenue</div>
      <p className="mx-auto mb-4 mt-3 max-w-sm font-display text-2xl font-semibold leading-snug text-ink">
        Déconstruis ta légende. Vois émerger tes possibles.
      </p>
      <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-muted">
        En six étapes, explore tes multiples, pour transformer ton identité
        subie en une identité choisie.
      </p>
      <div className="flex justify-center">
        <Constellation size={190} />
      </div>
    </div>
  );
}

// Étape « signature » — enseigne le chemin : trois stations reliées, graphique.
function StepChemin() {
  const stations = [
    { icon: <Glyph name="signature" size={24} />, label: "Ta signature", sous: "ton schéma dominant" },
    { icon: <Glyph name="mue" size={24} />, label: "Ton vortex", sous: "quand tu bascules" },
    { icon: <Glyph name="possibles" size={24} />, label: "Tes possibles", sous: "des voies à tenter" },
  ];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Ta signature</div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Découvre les dynamiques qui s'expriment le plus naturellement chez toi.</h2>
      <div className="mt-7 flex items-start justify-between">
        {stations.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-start">
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl text-fuchsia"
                style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}
              >
                {s.icon}
              </span>
              <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink">
                {s.label}
              </span>
              <span className="max-w-[11ch] text-[12px] leading-tight text-muted">{s.sous}</span>
            </div>
            {i < stations.length - 1 && (
              <ArrowRight size={16} className="mt-5 flex-none text-fuchsia" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Étape « territoires » — ancre la quête sur TOUTE la vie : elle relie les
// trois périmètres (perso · pro · relationnel), jamais un seul en vase clos.
function StepTerritoires() {
  const perimetres = [
    { icon: <Glyph name="perso" size={22} />, label: "Perso", sous: "équilibre, corps, sens" },
    { icon: <Glyph name="pro" size={22} />, label: "Pro", sous: "travail, projets" },
    { icon: <Glyph name="relationnel" size={22} />, label: "Relationnel", sous: "amour, famille, amis" },
  ];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Exploration</div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
        Observe tes dimensions les plus présentes
      </h2>
      <div className="mt-7 grid grid-cols-3 gap-3">
        {perimetres.map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center gap-2 p-2"
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-2xl text-fuchsia"
              style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}
            >
              {p.icon}
            </span>
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink">
              {p.label}
            </span>
            <span className="text-[12px] leading-tight text-muted">{p.sous}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Étape 3 — le rythme quotidien, pour installer l'habitude (≈ 4 min/jour).
function StepRythme() {
  const piliers = [
    { icon: <Glyph name="question" size={20} />, t: "Une question", sous: "Pour regarder dans la bonne direction." },
    { icon: <Glyph name="defi" size={20} />, t: "Un micro-défi", sous: "Pour expérimenter de nouvelles actions." },
    { icon: <Glyph name="ressource" size={20} />, t: "Une ressource", sous: "Pour nourrir ta réflexion et ouvrir de nouvelles perspectives." },
  ];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Le tempo</div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
        Chaque jour, une capsule
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Quelques minutes pour observer ce qui s'active en toi.
      </p>
      <div className="mt-7 grid grid-cols-3 gap-3">
        {piliers.map((p) => (
          <div
            key={p.t}
            className="flex flex-col items-center gap-2 p-2"
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-xl text-fuchsia"
              style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}
            >
              {p.icon}
            </span>
            <span className="text-[12px] font-medium leading-tight text-ink">{p.t}</span>
            <span className="text-[12px] leading-tight text-muted">{p.sous}</span>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-sm font-display text-sm italic leading-snug text-muted">
        Pas à pas.
      </p>
    </div>
  );
}

// Étape « le mouvement » — le cœur d'identitX, désormais PORTÉ par l'onboarding
// (et non plus caché derrière un lien) : le principe (l'identité ne se fige pas,
// la matrice respire) + l'arc des 30 jours en quatre phases. C'est la dernière
// marche avant de révéler l'archétype.
function StepMouvement() {
  // Boucle INTERACTIVE : on touche une phase, elle s'illumine et livre son détail.
  const [active, setActive] = useState(0);
  // Positions sur l'orbite (r≈104) + ancrage du nom de phase, posé à l'extérieur.
  const nodes = [
    { x: 140, y: 36, lx: 140, ly: 13, anchor: "middle" as const },
    { x: 244, y: 140, lx: 261, ly: 141, anchor: "start" as const },
    { x: 140, y: 244, lx: 140, ly: 269, anchor: "middle" as const },
    { x: 36, y: 140, lx: 19, ly: 141, anchor: "end" as const },
  ];
  const ph = PHASES[active];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Le mouvement</div>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
        30 jours de redéploiement identitaire
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
        Ton identité n'est pas figée. Pendant 30 jours, observe comment tes
        différentes dimensions s'expriment selon les situations.
      </p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
        Tu ne cherches pas à devenir quelqu'un d'autre. Tu apprends à voir ce
        qui, en toi, demande à évoluer.
      </p>
      {/* La boucle en orbite céleste : nébuleuse en fond, phases-étoiles nommées,
          un balayage lumineux qui tourne (le sens du cycle). Tactile. */}
      <div className="relative mx-auto mt-7" style={{ maxWidth: 288 }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 47%, color-mix(in srgb, var(--fuchsia) 13%, transparent), transparent 60%)",
          }}
        />
        <svg viewBox="0 0 280 280" width="100%" style={{ display: "block", overflow: "visible", position: "relative" }}>
          {/* L'orbite, fine */}
          <circle cx="140" cy="140" r="104" fill="none" stroke="var(--line)" strokeWidth="1" />
          {/* Le balayage — arc lumineux qui tourne, sens du cycle */}
          <g style={{ transformOrigin: "140px 140px", animation: "idx-spin 18s linear infinite" }}>
            <circle
              cx="140"
              cy="140"
              r="104"
              fill="none"
              stroke="var(--fuchsia)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="52 602"
              opacity="0.9"
            />
          </g>
          {nodes.map((nd, i) => {
            const on = i === active;
            return (
              <g
                key={i}
                onClick={() => setActive(i)}
                role="button"
                aria-label={PHASES[i].label}
                style={{ cursor: "pointer" }}
              >
                {/* zone tactile généreuse */}
                <circle cx={nd.x} cy={nd.y} r="22" fill="transparent" />
                {on && <circle cx={nd.x} cy={nd.y} r="10" fill="var(--fuchsia)" opacity="0.2" />}
                <circle
                  cx={nd.x}
                  cy={nd.y}
                  r={on ? 5.5 : 3.5}
                  fill="var(--fuchsia)"
                  opacity={on ? 1 : 0.55}
                  style={{ transition: "r .25s, opacity .25s" }}
                />
                <text
                  x={nd.lx}
                  y={nd.ly}
                  textAnchor={nd.anchor}
                  dominantBaseline="central"
                  fontSize="11.5"
                  fontStyle="italic"
                  fill={on ? "var(--ink)" : "var(--muted)"}
                  fontFamily="var(--font-fraunces),serif"
                  style={{ transition: "fill .25s" }}
                >
                  {PHASES[i].label}
                </text>
              </g>
            );
          })}
          {/* Cœur — un pouls discret (la matrice qui respire), sans mot */}
          <circle cx="140" cy="140" r="17" fill="none" stroke="var(--fuchsia)" strokeWidth="1" opacity="0.14" />
          <g style={{ transformOrigin: "140px 140px", animation: "idx-breathe 4.5s ease-in-out infinite" }}>
            <circle cx="140" cy="140" r="10" fill="none" stroke="var(--fuchsia)" strokeWidth="1" opacity="0.32" />
          </g>
          <circle cx="140" cy="140" r="3.5" fill="var(--fuchsia)" />
        </svg>
      </div>

      <p className="mx-auto mt-2 text-[12px] uppercase tracking-[0.14em] text-muted">
        Touche une phase
      </p>

      {/* Détail de la phase active — change au toucher */}
      <div
        key={active}
        className="animate-fade-up mx-auto mt-3 max-w-sm rounded-2xl border border-line bg-surface p-4 text-left"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">{ph.label}</span>
          <span className="text-[12px] uppercase tracking-[0.12em] text-muted">
            J{ph.jours[0]}–{ph.jours[1]}
          </span>
        </div>
        <p className="mt-1 text-xs leading-snug text-muted">{ph.intention}</p>
      </div>

      <p className="mx-auto mt-3 max-w-xs font-display text-sm italic leading-snug text-muted">
        Ta signature n'est pas fixe. Elle évolue au fil de tes observations.
      </p>
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
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Faisons connaissance</div>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Avant d'explorer ta constellation, donne-nous quelques repères.
        </p>
      </div>
      <div>
        <Label>Ton prénom</Label>
        <p className="mb-1.5 text-xs text-muted">Comment souhaites-tu être appelé·e ?</p>
        <TextInput value={name} onChange={setName} placeholder="Ton prénom" />
      </div>
      <div>
        <Label>Ton âge approximatif</Label>
        <p className="mb-1.5 text-xs text-muted">Chaque période de vie ouvre des questions différentes.</p>
        <TextInput value={age} onChange={setAge} placeholder="ex. la trentaine, 42…" />
      </div>
      <div>
        <Label>Ton intention du moment</Label>
        <p className="mb-1.5 text-xs text-muted">Qu'aimerais-tu mieux comprendre, clarifier ou faire évoluer ?</p>
        <TextInput value={intention} onChange={setIntention} placeholder="ex. clarté, oser, alignement…" />
      </div>
      <p className="text-center text-xs italic leading-relaxed text-muted">
        Tu peux modifier ces informations à tout moment.
      </p>
      <p className="text-center text-xs leading-relaxed text-muted">
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
