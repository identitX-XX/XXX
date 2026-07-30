"use client";

import { useEffect, useState } from "react";
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

  // À chaque « Continuer », on repart du haut de l'écran — sinon, sur une étape
  // plus longue (ex. « Le mouvement »), on atterrit au milieu, comme un reliquat.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

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
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col px-6 pt-12 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
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
      <div className="flex flex-1 flex-col justify-center">
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
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={back} className={step === 0 ? "invisible" : ""}>
          <ArrowLeft size={16} /> Retour
        </Button>
        <Button onClick={next} disabled={!canNext}>
          {step === STEPS - 1 ? "Révéler ma signature" : "Continuer"}
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
    { icon: <Compass size={20} />, label: "Signature", sous: "ton schéma dominant" },
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
      <h2 className="mt-2 font-display text-2xl font-light text-ink">
        30 jours de redéploiement identitaire
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
        Ta signature n'est pas figée, elle oscille dans un mouvement permanent —
        qui soutient ta mécanique d'expansion ou celle de tes schémas connus.
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

      <p className="mx-auto mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">
        Touche une phase
      </p>

      {/* Détail de la phase active — change au toucher */}
      <div
        key={active}
        className="animate-fade-up mx-auto mt-3 max-w-sm rounded-2xl border border-line bg-surface p-4 text-left"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-ink">{ph.label}</span>
          <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
            J{ph.jours[0]}–{ph.jours[1]}
          </span>
        </div>
        <p className="mt-1 text-xs leading-snug text-muted">{ph.intention}</p>
      </div>

      <p className="mx-auto mt-3 max-w-xs font-display text-sm italic leading-snug text-muted">
        La boucle ne te ramène jamais au même point.
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
