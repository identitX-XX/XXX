"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Profile } from "@/types";
import { Button, Label, Slider, TextArea, TextInput } from "./ui";

const STEPS = 6;

export function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>({
    name: "",
    age: "",
    situation: "",
    goal: "",
    energy: 62,
    clarity: 48,
    blocker: "",
    understand: "",
    values: ["", "", ""],
    strengths: ["", "", ""],
    fear: "",
    ambition: "",
    keyword: "",
  });

  const set = (patch: Partial<Profile>) => setP((prev) => ({ ...prev, ...patch }));
  const setValue = (i: number, v: string) =>
    setP((prev) => {
      const values = [...prev.values];
      values[i] = v;
      return { ...prev, values };
    });
  const setStrength = (i: number, v: string) =>
    setP((prev) => {
      const strengths = [...prev.strengths];
      strengths[i] = v;
      return { ...prev, strengths };
    });

  const next = () => (step < STEPS - 1 ? setStep(step + 1) : complete(p));
  const back = () => setStep(Math.max(0, step - 1));
  const canNext = step === 0 ? p.name.trim().length > 0 : true;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <div className="mb-10 flex items-center gap-2">
        <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="font-display text-lg tracking-tight text-ink">IDENTITX</span>
      </div>

      {/* Progress */}
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

      <div key={step} className="animate-fade-up space-y-6">
        {step === 0 && (
          <>
            <Head t="Faisons connaissance" s="Trois repères pour poser le décor." />
            <div>
              <Label>Prénom ou pseudo</Label>
              <TextInput value={p.name} onChange={(v) => set({ name: v })} placeholder="Ton prénom" />
            </div>
            <div>
              <Label>Âge approximatif</Label>
              <TextInput value={p.age} onChange={(v) => set({ age: v })} placeholder="ex. 45" />
            </div>
            <div>
              <Label>Situation actuelle</Label>
              <TextInput
                value={p.situation}
                onChange={(v) => set({ situation: v })}
                placeholder="En quelques mots"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Head t="Où tu regardes" s="Ce qui oriente ton moment présent." />
            <div>
              <Label>Objectif principal du moment</Label>
              <TextArea
                value={p.goal}
                onChange={(v) => set({ goal: v })}
                placeholder="Ce vers quoi tu tends en ce moment"
                rows={3}
              />
            </div>
            <div>
              <Label>Un mot-clé identitaire</Label>
              <TextInput
                value={p.keyword}
                onChange={(v) => set({ keyword: v })}
                placeholder="Un seul mot qui te résume"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Head t="Ton état intérieur" s="Sans te juger, à l'instant T." />
            <Slider label="Niveau d'énergie perçu" value={p.energy} onChange={(v) => set({ energy: v })} />
            <Slider label="Niveau de clarté intérieure" value={p.clarity} onChange={(v) => set({ clarity: v })} />
          </>
        )}

        {step === 3 && (
          <>
            <Head t="Les zones de friction" s="Nommer, c'est déjà reprendre la main." />
            <div>
              <Label>Ce qui bloque le plus aujourd'hui</Label>
              <TextArea value={p.blocker} onChange={(v) => set({ blocker: v })} rows={3} />
            </div>
            <div>
              <Label>Ce que tu veux mieux comprendre chez toi</Label>
              <TextArea value={p.understand} onChange={(v) => set({ understand: v })} rows={3} />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <Head t="Tes appuis" s="Trois valeurs, trois forces." />
            <div>
              <Label>Trois valeurs dominantes</Label>
              <div className="space-y-2">
                {p.values.map((v, i) => (
                  <TextInput key={i} value={v} onChange={(val) => setValue(i, val)} placeholder={`Valeur ${i + 1}`} />
                ))}
              </div>
            </div>
            <div>
              <Label>Trois forces perçues</Label>
              <div className="space-y-2">
                {p.strengths.map((v, i) => (
                  <TextInput key={i} value={v} onChange={(val) => setStrength(i, val)} placeholder={`Force ${i + 1}`} />
                ))}
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <Head t="Le cap" s="Une peur à regarder, une direction à tenir." />
            <div>
              <Label>Une peur récurrente</Label>
              <TextInput value={p.fear} onChange={(v) => set({ fear: v })} />
            </div>
            <div>
              <Label>Une ambition à 12 mois</Label>
              <TextArea value={p.ambition} onChange={(v) => set({ ambition: v })} rows={3} />
            </div>
          </>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={back} className={step === 0 ? "invisible" : ""}>
          <ArrowLeft size={16} /> Retour
        </Button>
        <Button onClick={next} disabled={!canNext}>
          {step === STEPS - 1 ? "Générer mon Lab" : "Continuer"}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function Head({ t, s }: { t: string; s: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-light text-ink">{t}</h2>
      <p className="mt-1 text-sm text-muted">{s}</p>
    </div>
  );
}
