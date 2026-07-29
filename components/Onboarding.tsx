"use client";

import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Briefcase, Compass, HeartHandshake, HelpCircle,
  Route, Shuffle, Sparkles, Sprout, Target,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Profile } from "@/types";
import { PHASES } from "@/parcours-archetypes/archetypes";
import { Button, Label, TextInput } from "./ui";
import { Constellation } from "./Constellation";

// Onboarding « classe mondiale » : court, graphique, pédagogique. On enseigne le
// chemin (Archétype → Mue → Tes Choix) et le rythme AVANT de demander quoi que
// ce soit — puis une seule saisie : le prénom. Le reste du profil se complète au
// fil de la quête (profil progressif), jamais en barrage à l'entrée.
const STEPS = 6;

export function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [intention, setIntention] = useState("");

  // Le prénom est requis pour quitter l'étape « intention » (désormais l'étape 1).
  const canNext = step === 1 ? name.trim().length > 0 : true;

  const finish = () => {
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
  };

  const next = () => (step < STEPS - 1 ? setStep(step + 1) : finish());
  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      {/* Repères de friction : où j'en suis, combien de temps. */}
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>Étape {step + 1} sur {STEPS}</span>
        <span>≈ 1 min</span>
      </div>
      <div className="mb-10 flex gap-1.5">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? "brand-gradient" : "bg-line"
            }`}
          />
        ))}
      </div>

      {/* Ordre pédagogique : Bienvenue → ton intention → ta trajectoire (jusqu'à
          la mue) → les deux blocs qui décrivent les 30 jours. Le diagnostic des
          archétypes ne vient qu'APRÈS (à la fin de l'onboarding). */}
      <div key={step} className="animate-fade-up">
        {step === 0 && <StepAccueil />}
        {step === 1 && (
          <StepPrenom
            name={name}
            setName={setName}
            age={age}
            setAge={setAge}
            intention={intention}
            setIntention={setIntention}
          />
        )}
        {step === 2 && <StepChemin />}
        {step === 3 && <StepTerritoires />}
        {step === 4 && <StepRythme />}
        {step === 5 && <StepMouvement />}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={back} className={step === 0 ? "invisible" : ""}>
          <ArrowLeft size={16} /> Retour
        </Button>
        <Button onClick={next} disabled={!canNext}>
          {step === STEPS - 1 ? "Révéler mon archétype" : "Continuer"}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

// Étape 0 — la promesse, portée par le motif, presque sans texte.
function StepAccueil() {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <Constellation size={190} />
      </div>
      <h2 className="font-display text-5xl font-light leading-none text-ink">Bienvenue</h2>
      <p className="mx-auto mt-5 max-w-sm font-display text-xl font-light leading-snug text-ink">
        Explorons ta constellation identitaire.
      </p>
    </div>
  );
}

// Étape 1 — enseigne le chemin : trois stations reliées, graphique d'abord.
function StepChemin() {
  const stations = [
    { icon: <Compass size={20} />, label: "Archétype", sous: "ton schéma dominant" },
    { icon: <Shuffle size={20} />, label: "La Mue", sous: "quand tu bascules" },
    { icon: <Route size={20} />, label: "Tes possibles", sous: "des voies à tenter" },
  ];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Ta trajectoire</div>
      <h2 className="mt-2 font-display text-2xl font-light text-ink">Trois temps, un mouvement</h2>
      <div className="mt-7 flex items-start justify-between">
        {stations.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-start">
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <span
                className="grid h-14 w-14 place-items-center rounded-full text-fuchsia"
                style={{ boxShadow: "inset 0 0 0 2px var(--fuchsia)" }}
              >
                {s.icon}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink">
                {s.label}
              </span>
              <span className="max-w-[11ch] text-[10px] leading-tight text-muted">{s.sous}</span>
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
    { icon: <Sprout size={20} />, label: "Perso", sous: "équilibre, corps, sens" },
    { icon: <Briefcase size={20} />, label: "Pro", sous: "travail, projets" },
    { icon: <HeartHandshake size={20} />, label: "Relationnel", sous: "amour, famille, amis" },
  ];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Ton narratif</div>
      <h2 className="mt-2 font-display text-2xl font-light text-ink">
        Chaque jour pose un cap
      </h2>
      <div className="mt-7 grid grid-cols-3 gap-3">
        {perimetres.map((p) => (
          <div
            key={p.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-4"
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-fuchsia"
              style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}
            >
              {p.icon}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink">
              {p.label}
            </span>
            <span className="text-[10px] leading-tight text-muted">{p.sous}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Étape 3 — le rythme quotidien, pour installer l'habitude (≈ 4 min/jour).
function StepRythme() {
  const piliers = [
    { icon: <HelpCircle size={18} />, t: "Une question" },
    { icon: <Target size={18} />, t: "Un micro-défi" },
    { icon: <Sparkles size={18} />, t: "Une ressource" },
  ];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Le rythme</div>
      <h2 className="mt-2 font-display text-2xl font-light text-ink">
        Chaque jour, une capsule
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        ≈ 4 minutes. Trois appuis pour faire bouger ton schéma.
      </p>
      <div className="mt-7 grid grid-cols-3 gap-3">
        {piliers.map((p) => (
          <div
            key={p.t}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-4"
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-full text-fuchsia"
              style={{ background: "color-mix(in srgb, var(--fuchsia) 12%, transparent)" }}
            >
              {p.icon}
            </span>
            <span className="text-[11px] leading-tight text-ink">{p.t}</span>
          </div>
        ))}
      </div>
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
  const nodes = [
    { x: 140, y: 30 },
    { x: 250, y: 140 },
    { x: 140, y: 250 },
    { x: 30, y: 140 },
  ];
  const ph = PHASES[active];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Le mouvement</div>
      <h2 className="mt-2 font-display text-2xl font-light text-ink">
        Trente jours pour te voir bouger
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
        Ton archétype n'est pas une étiquette. Trente jours durant, tu observes
        comment il s'active selon tes contextes — et chaque soir, la matrice
        respire : ce que tu n'as pas rejoué retombe, pour que rien ne se fige.
      </p>
      {/* La boucle, explicite ET tactile : touche une phase pour la découvrir. */}
      <div className="mx-auto mt-6" style={{ maxWidth: 300 }}>
        <svg viewBox="0 0 280 280" width="100%" style={{ display: "block" }}>
          <defs>
            <marker id="idxArrow" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
              <path d="M0,0 L6,3.5 L0,7 Z" fill="var(--fuchsia)" />
            </marker>
          </defs>
          <circle cx="140" cy="140" r="110" fill="none" stroke="var(--line)" strokeWidth="1.5" />
          <g fill="none" stroke="var(--fuchsia)" strokeWidth="2" strokeLinecap="round" markerEnd="url(#idxArrow)" opacity="0.85">
            <path d="M168.5,33.75 A110,110 0 0,1 246.25,111.53" />
            <path d="M246.25,168.47 A110,110 0 0,1 168.47,246.25" />
            <path d="M111.53,246.25 A110,110 0 0,1 33.75,168.47" />
            <path d="M33.75,111.53 A110,110 0 0,1 111.53,33.75" />
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
                {/* zone tactile généreuse (invisible) */}
                <circle cx={nd.x} cy={nd.y} r="26" fill="transparent" />
                {on && (
                  <circle
                    cx={nd.x}
                    cy={nd.y}
                    r="24"
                    fill="none"
                    stroke="var(--fuchsia)"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                )}
                <circle
                  cx={nd.x}
                  cy={nd.y}
                  r={on ? 20 : 16}
                  fill="var(--fuchsia)"
                  opacity={on ? 1 : 0.7}
                  style={{ transition: "r .2s, opacity .2s" }}
                />
                <text
                  x={nd.x}
                  y={nd.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={on ? 16 : 14}
                  fontWeight="600"
                  fill="var(--noir)"
                  fontFamily="var(--font-fraunces),serif"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
          <circle cx="140" cy="140" r="30" fill="none" stroke="var(--line)" strokeWidth="1" />
          <text x="140" y="135" textAnchor="middle" fontSize="18" fill="var(--ink)" fontFamily="var(--font-fraunces),serif">30</text>
          <text x="140" y="153" textAnchor="middle" fontSize="9" letterSpacing="0.16em" fill="var(--muted)">JOURS</text>
        </svg>
      </div>

      <p className="mx-auto mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">
        Touche une phase
      </p>

      {/* Détail de la phase active — change au toucher */}
      <div
        key={active}
        className="animate-fade-up mx-auto mt-3 max-w-sm rounded-2xl border border-line bg-surface p-4 text-left"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">
            {active + 1}. {ph.label}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
            J{ph.jours[0]}–{ph.jours[1]}
          </span>
        </div>
        <p className="mt-1 text-xs leading-snug text-muted">{ph.intention}</p>
      </div>

      <p className="mx-auto mt-3 max-w-xs text-xs italic leading-snug text-muted">
        Une boucle : elle se referme, puis recommence — un cran plus haut.
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
      </div>
      <div>
        <Label>Ton prénom</Label>
        <TextInput value={name} onChange={setName} placeholder="Ton prénom" />
      </div>
      <div>
        <Label>Âge approximatif</Label>
        <TextInput value={age} onChange={setAge} placeholder="ex. la trentaine, 42…" />
      </div>
      <div>
        <Label>Ton intention du moment</Label>
        <TextInput value={intention} onChange={setIntention} placeholder="ex. clarté, oser, alignement…" />
      </div>
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
