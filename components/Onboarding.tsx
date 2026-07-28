"use client";

import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Compass, HelpCircle, Route, Shuffle, Sparkles, Target,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Profile } from "@/types";
import { Button, Label, TextInput } from "./ui";
import { Constellation } from "./Constellation";

// Onboarding « classe mondiale » : court, graphique, pédagogique. On enseigne le
// chemin (Archétype → Mue → Tes Choix) et le rythme AVANT de demander quoi que
// ce soit — puis une seule saisie : le prénom. Le reste du profil se complète au
// fil de la quête (profil progressif), jamais en barrage à l'entrée.
const STEPS = 4;

export function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");

  const canNext = step === STEPS - 1 ? name.trim().length > 0 : true;

  const finish = () => {
    const mot = intention.trim();
    const profile: Profile = {
      name: name.trim(),
      age: "",
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

      <div key={step} className="animate-fade-up">
        {step === 0 && <StepAccueil />}
        {step === 1 && <StepChemin />}
        {step === 2 && <StepRythme />}
        {step === 3 && (
          <StepPrenom
            name={name}
            setName={setName}
            intention={intention}
            setIntention={setIntention}
          />
        )}
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
      <div className="mb-2 flex justify-center">
        <Constellation size={210} />
      </div>
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Bienvenue</div>
      <h2 className="mt-2 font-display text-2xl font-light leading-snug text-ink">
        Développe des convictions à la hauteur de tes ambitions.
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
        IdentitX t'aide à abattre les schémas répétitifs qui bloquent ton
        alignement — en partant de ton archétype.
      </p>
    </div>
  );
}

// Étape 1 — enseigne le chemin : trois stations reliées, graphique d'abord.
function StepChemin() {
  const stations = [
    { icon: <Compass size={20} />, label: "Archétype", sous: "ton schéma dominant" },
    { icon: <Shuffle size={20} />, label: "La Mue", sous: "quand tu bascules" },
    { icon: <Route size={20} />, label: "Tes Choix", sous: "des voies à tenter" },
  ];
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Ton chemin</div>
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
      <p className="mx-auto mt-7 max-w-sm text-sm leading-relaxed text-muted">
        Ton archétype se révèle, bouge, puis ouvre des possibles concrets. On avance
        une étape à la fois — rien n'apparaît avant son heure.
      </p>
    </div>
  );
}

// Étape 2 — le rythme quotidien, pour installer l'habitude (≈ 4 min/jour).
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
        ≈ 4 minutes, le soir idéalement. Trois appuis pour faire bouger ton schéma.
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
      <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-muted">
        Tiens la série : c'est la régularité, pas l'intensité, qui construit.
      </p>
    </div>
  );
}

// Étape 3 — la seule saisie : le prénom (requis) + une intention (optionnelle).
function StepPrenom({
  name, setName, intention, setIntention,
}: {
  name: string;
  setName: (v: string) => void;
  intention: string;
  setIntention: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.22em] text-fuchsia">Faisons connaissance</div>
        <h2 className="mt-2 font-display text-2xl font-light text-ink">Comment t'appelles-tu ?</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Juste ton prénom pour commencer. Le reste se dessinera au fil de ta quête.
        </p>
      </div>
      <div>
        <Label>Prénom ou pseudo</Label>
        <TextInput value={name} onChange={setName} placeholder="Ton prénom" />
      </div>
      <div>
        <Label>Ton intention, en un mot (optionnel)</Label>
        <TextInput value={intention} onChange={setIntention} placeholder="ex. clarté, oser, alignement…" />
      </div>
    </div>
  );
}
