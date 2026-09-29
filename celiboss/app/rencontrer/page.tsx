import type { Metadata } from "next";
import { FAQ } from "@/components/rencontrer/FAQ";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";
import { Etoile } from "@/components/ui/Symboles";
import { PROMESSE } from "@/lib/positionnement";

export const metadata: Metadata = {
  title: "Rencontrer",
  description: "Matchmaking d'exception — sentimental, relationnel, pro — sur entretien, mené personnellement par Maï Diaw.",
};

const CHIFFRES = [
  { n: <>1</>, titre: "Entretien", texte: "avant toute présentation." },
  { n: <>1<span className="font-normal italic text-bordeaux">à</span>1</>, titre: "Présentations", texte: "jamais de catalogue." },
  { n: <span className="text-bordeaux">0</span>, titre: "Algorithme", texte: "le regard de Maï, rien d'autre." },
];

const SEUIL = [
  { n: "I", titre: "Vous êtes disponible", texte: "Prêt·e à rendre de la place, dans votre agenda comme dans votre vie." },
  { n: "II", titre: "Vous avez construit", texte: "Une vie professionnelle et personnelle posée. Vous ne cherchez personne pour vous sauver." },
  { n: "III", titre: "Vous avez des standards", texte: "Vous savez ce que vous voulez, et surtout ce que vous ne voulez plus." },
  { n: "IV", titre: "Vous acceptez d'être accompagné·e", texte: "Un regard extérieur, des retours francs, et parfois des remises en question." },
];

const ETAPES = [
  { titre: "L'appel", texte: "Trente minutes pour se rencontrer et vérifier que le cadre vous convient." },
  { titre: "L'entretien", texte: "Votre histoire, vos exigences, vos angles morts. Avec Maï Diaw, en profondeur." },
  { titre: "La sélection", texte: "Des profils présentés un à un, choisis à la main. Jamais d'algorithme." },
  { titre: "Le suivi", texte: "Un débrief après chaque rencontre, pour ajuster la trajectoire." },
];

const TERRAINS = [
  { nom: "Sentimental", accroche: "Rencontrer la bonne personne", texte: "Des présentations choisies à la main, pour une relation amoureuse engagée et durable." },
  { nom: "Relationnel", accroche: "Choisir son cercle", texte: "Élargir son entourage avec des personnes alignées : amitiés, réseau de confiance, affinités." },
  { nom: "Pro", accroche: "Les bonnes connexions", texte: "Associé·e, mentor, partenaire : la mise en relation professionnelle, avec le même discernement." },
];

export default function Rencontrer() {
  return (
    <>
      <section className="bg-ivoire text-encre">
        <div className="mx-auto grid max-w-[90rem] gap-16 px-6 pb-28 pt-20 md:px-10 lg:grid-cols-[2fr_1fr] lg:pt-24 xl:px-24">
          <div className="space-y-10">
            <p className="flex items-center gap-3.5 text-xs font-semibold uppercase tracking-[0.32em] text-bordeaux">
              Matchmaking <Etoile taille={12} className="text-bordeaux" /> Sur entretien
            </p>
            <h1 className="font-serif text-manifeste">
              <span className="block font-medium">Rencontrer,</span>
              <span className="block font-normal italic text-bordeaux">par choix.</span>
            </h1>
            <p className="font-serif text-3xl leading-tight">
              {PROMESSE.avant} <span className="italic text-bordeaux">{PROMESSE.apres}</span>
            </p>
            <div className="grid border-t border-filet sm:grid-cols-3">
              {CHIFFRES.map((c, i) => (
                <div key={c.titre} className={`space-y-1.5 pt-5 sm:px-5 ${i === 0 ? "sm:pl-0" : ""} ${i < 2 ? "sm:border-r sm:border-filet" : "sm:pr-0"}`}>
                  <span className="block font-serif text-6xl font-medium leading-none">{c.n}</span>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">{c.titre}</p>
                  <p className="text-sm text-gris">{c.texte}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-7">
              <CTA />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gris">Sentimental · Relationnel · Pro</p>
            </div>
          </div>
          <Portrait
            src="/images/mai-diaw-tailleur.jpg"
            alt="Portrait de Maï Diaw, souriante, en tailleur blanc"
            priority
            embleme
            className="mx-auto w-full max-w-sm lg:mt-4"
            legende={
              <>
                <span className="font-serif text-xl font-semibold">Maï Diaw</span>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-bordeaux">Matchmakeuse d&apos;exception</span>
              </>
            }
          />
        </div>
      </section>

      <Section ton="sable">
        <Eyebrow>Le seuil</Eyebrow>
        <h2 className="mt-6 font-serif text-titre font-medium">
          Ce n&apos;est pas pour tout le monde.
          <br />
          <span className="font-normal italic text-bordeaux">C&apos;est voulu.</span>
        </h2>
        <div className="mt-16 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {SEUIL.map((s) => (
            <div key={s.n} className="border-t border-filet pt-6">
              <div className="space-y-2">
                <p className="font-serif text-3xl font-semibold">{s.titre}</p>
                <p className="leading-relaxed text-gris">{s.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="font-serif text-titre font-medium">
          Quatre étapes.
          <br />
          <span className="font-normal italic text-bordeaux">Aucune automatisée.</span>
        </h2>
        <ol className="mt-16 grid border-t border-filet md:grid-cols-4">
          {ETAPES.map((e, i) => (
            <li key={e.titre} className={`space-y-3 border-b border-filet py-7 md:border-b-0 md:px-7 ${i === 0 ? "md:pl-0" : ""} ${i < 3 ? "md:border-r" : "md:pr-0"}`}>
              <span className="text-xs font-semibold tracking-[0.2em] text-bordeaux">0{i + 1}</span>
              <p className="font-serif text-3xl font-semibold">{e.titre}</p>
              <p className="leading-relaxed text-gris">{e.texte}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section ton="ivoire">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bordeaux">Trois terrains de rencontre</p>
        <h2 className="mt-6 font-serif text-titre font-medium">
          Amoureuses, amicales, professionnelles.
          <br />
          <span className="font-normal italic text-bordeaux">Toujours choisies.</span>
        </h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TERRAINS.map((t) => (
            <article key={t.nom} className="space-y-3.5 border-t border-filet pt-7">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-bordeaux">{t.accroche}</p>
              <h3 className="font-serif text-5xl font-medium">{t.nom}</h3>
              <p className="leading-relaxed text-gris">{t.texte}</p>
              <p className="pt-3 text-xs font-semibold uppercase tracking-[0.22em]">Sur entretien</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <FAQ />
      </Section>

      <Section ton="sable">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <h2 className="font-serif text-titre font-medium">
            Tout commence
            <br />
            <span className="font-normal italic text-bordeaux">par un appel.</span>
          </h2>
          <CTA />
        </div>
      </Section>
    </>
  );
}
