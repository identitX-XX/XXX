import type { Metadata } from "next";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";
import { Etoile } from "@/components/ui/Symboles";
import { HISTOIRE, MEDIA } from "@/lib/histoire";
import { CONVERGENCES, PRECISION, PROMESSE } from "@/lib/positionnement";

export const metadata: Metadata = {
  title: "Maï Diaw",
  description: "Maï Diaw, matchmakeuse d'exception. Elle accorde votre mental, votre cœur et votre vie, puis provoque la rencontre qui compte.",
};

const COLONNES = [
  { titre: "Mettre en relation", items: ["Pro", "Relationnel", "Sentimental"] },
  { titre: "Expertises", items: ["Intelligence émotionnelle", "Mindset", "Posture", "Image"] },
  { titre: "Formats", items: ["Événements", "Coaching", "Programmes"] },
  { titre: "Univers", items: ["CéliBOSS™", "Glow Up", "M.C MEN"] },
];

export default function MaiDiaw() {
  return (
    <>
      <section className="bg-ivoire text-encre">
        <div className="mx-auto grid max-w-[90rem] items-center gap-16 px-6 pb-28 pt-20 md:px-10 lg:grid-cols-[1.6fr_1fr] lg:pt-24 xl:px-24">
          <div className="space-y-7">
            <Eyebrow>Fondatrice de CéliBOSS™</Eyebrow>
            <h1 className="font-serif text-manifeste font-medium">Maï Diaw</h1>
            <p className="font-serif text-4xl italic leading-none text-bordeaux md:text-5xl">Matchmakeuse d&apos;exception.</p>
            <div className="space-y-4 border-t border-filet pt-7">
              <p className="font-serif text-3xl font-medium leading-none md:text-[2.75rem]">
                {PROMESSE.avant} <span className="font-normal italic text-bordeaux">{PROMESSE.apres}</span>
              </p>
              <p className="max-w-xl text-lg leading-relaxed text-gris">{PRECISION}</p>
            </div>
          </div>
          <Portrait src="/images/mai-diaw-tailleur.jpg" alt="Portrait de Maï Diaw, souriante, en tailleur blanc" priority filet="gauche" className="mx-auto w-full max-w-sm" />
        </div>
      </section>

      <Section ton="sable">
        <Eyebrow>Trois convergences</Eyebrow>
        <h2 className="mt-6 font-serif text-titre font-medium">
          Une méthode.
          <br />
          <span className="font-normal italic text-bordeaux">Trois dimensions de votre vie.</span>
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {CONVERGENCES.map((c) => (
            <li key={c.domaine} className="space-y-3.5 border-t border-filet pt-6">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gris">{c.domaine}</p>
              <p className="font-serif text-4xl leading-tight">
                <span className="italic text-bordeaux">{c.verbe}</span> {c.destination}
              </p>
              <p className="leading-relaxed text-gris">{c.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLONNES.map((c) => (
            <div key={c.titre} className="space-y-4 border-t border-filet pt-5">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-bordeaux">{c.titre}</p>
              <ul className="space-y-1 font-serif text-3xl font-semibold leading-snug">
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section ton="sable">
        <Eyebrow>Son histoire, en ses mots</Eyebrow>
        <h2 className="mt-6 font-serif text-titre font-medium">
          {HISTOIRE.titre.avant}
          <br />
          <span className="font-normal italic text-bordeaux">{HISTOIRE.titre.apres}</span>
        </h2>
        <ol className="mt-16 grid border-t border-filet md:grid-cols-2 xl:grid-cols-4">
          {HISTOIRE.chapitres.map((c, i) => (
            <li key={c.n} className={`space-y-3.5 border-b border-taupe py-8 xl:border-b-0 xl:px-7 ${i === 0 ? "xl:pl-0" : ""} ${i < 3 ? "xl:border-r" : "xl:pr-0"}`}>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em]">{c.titre}</p>
              <p className="leading-relaxed text-gris">« {c.texte} »</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid items-end gap-10 lg:grid-cols-[2fr_1fr]">
          <blockquote className="space-y-6 bg-sable p-10 md:p-12">
            <p className="text-lg text-gris">« {HISTOIRE.mission.amorce} »</p>
            <p className="font-serif text-titre font-medium">
              {HISTOIRE.mission.phrase.avant} <span className="font-normal italic text-bordeaux">{HISTOIRE.mission.phrase.apres}</span>
            </p>
            <p className="font-serif text-2xl italic leading-snug text-gris">{HISTOIRE.mission.suite}</p>
          </blockquote>
          <div className="space-y-5 pb-2">
            <p className="font-serif text-2xl leading-snug">
              {HISTOIRE.sens.avant} <span className="italic text-bordeaux">{HISTOIRE.sens.apres}</span>
            </p>
            <p className="flex items-center gap-2.5 border-t border-filet pt-5 text-[0.8125rem] font-semibold uppercase tracking-[0.28em] text-bordeaux">
              <Etoile className="text-bordeaux" />
              {HISTOIRE.signature}
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-4">
            <Eyebrow>Son média</Eyebrow>
            <p className="leading-relaxed text-gris">La parole de Maï Diaw, en conversation.</p>
          </div>
          <div className="space-y-6 border-filet lg:border-l lg:pl-10">
            <p className="font-serif text-titre font-medium">
              {MEDIA.nom.avant} <span className="font-normal italic text-bordeaux">{MEDIA.nom.apres}</span>
            </p>
            <ul className="flex flex-wrap text-[0.8125rem] font-semibold uppercase tracking-[0.3em]">
              {MEDIA.piliers.map((p, i) => (
                <li key={p} className={`${i > 0 ? "pl-5" : ""} ${i < MEDIA.piliers.length - 1 ? "border-r border-filet pr-5" : "text-bordeaux"}`}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section ton="sable">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <h2 className="font-serif text-titre font-medium">
            Parlons-en
            <br />
            <span className="font-normal italic text-bordeaux">de vive voix.</span>
          </h2>
          <CTA />
        </div>
      </Section>
    </>
  );
}
