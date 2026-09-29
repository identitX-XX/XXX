import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ListeAttente } from "@/components/formulaires/ListeAttente";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Programmes & événements",
  description: "Glow Up, M.C MEN et le coaching de Maï Diaw. Dîners, ateliers et cercles de lune, sur invitation.",
};

const PROGRAMMES = [
  { n: "I", nom: "Glow Up", texte: "Image, posture, présence : aligner ce que l'on voit de vous avec ce que vous êtes." },
  { n: "II", nom: "M.C MEN", texte: "Le programme pensé pour les hommes qui veulent construire des relations à la hauteur de leurs ambitions." },
  { n: "III", nom: "Coaching", texte: "Un accompagnement individuel : standards, confiance, intelligence émotionnelle." },
];

const FORMATS = [
  { nom: "Dîners", texte: "Une table choisie, des personnes alignées. La conversation fait le reste." },
  { nom: "Ateliers", texte: "Mindset, posture, image : apprendre ensemble, en groupe restreint." },
  { nom: "Cercles de lune", texte: "À chaque pleine lune, faire le point ensemble, en ligne.", lune: true },
];

export default function Programmes() {
  return (
    <>
      <Section>
        <Eyebrow>Programmes &amp; coaching</Eyebrow>
        <h1 className="mt-8 font-serif text-manifeste font-black">
          Devenir aligné·e,
          <br />
          <span className="font-normal italic text-bordeaux">avant de choisir.</span>
        </h1>
        <div className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <p className="max-w-2xl text-xl leading-relaxed text-gris">
            On ne choisit bien que lorsqu&apos;on se connaît. Les programmes de Maï Diaw travaillent ce qui se voit et ce qui ne se voit pas :
            l&apos;image, la posture, le mindset, l&apos;intelligence émotionnelle.
          </p>
          <span className="self-start border border-encre px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.26em] lg:self-auto">
            Ouverture prochaine
          </span>
        </div>
        <div className="mt-16 grid md:grid-cols-3">
          {PROGRAMMES.map((p, i) => (
            <article key={p.nom} className={`space-y-4 border-t-2 border-encre py-10 md:px-9 ${i === 0 ? "md:pl-0" : ""} ${i < 2 ? "md:border-r md:border-r-filet" : "md:pr-0"}`}>
              <span className="block font-serif text-6xl font-black leading-none text-bordeaux">{p.n}</span>
              <h2 className="font-serif text-5xl font-extrabold">{p.nom}</h2>
              <p className="text-lg leading-relaxed text-gris">{p.texte}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section ton="nuit" id="evenements">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.2fr]">
          <figure className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="absolute -bottom-[18px] left-[18px] -right-[18px] top-[18px] border border-champagne" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/mai-diaw-rire.jpg"
                alt="Maï Diaw éclate de rire, une coupe à la main, sur une terrasse ensoleillée"
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "40% 30%" }}
              />
            </div>
          </figure>
          <div className="space-y-8">
            <Eyebrow surSombre>Événements · sur invitation</Eyebrow>
            <h2 className="font-serif text-titre font-extrabold">
              Certaines rencontres changent une soirée. <span className="font-normal italic text-champagne">D&apos;autres, une trajectoire.</span>
            </h2>
            <dl className="border-t border-champagne/50">
              {FORMATS.map((f) => (
                <div key={f.nom} className="grid gap-2 border-b border-champagne/25 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <dt className={`font-serif text-3xl ${f.lune ? "italic text-champagne" : "font-bold"}`}>{f.nom}</dt>
                  <dd className="leading-relaxed text-ivoire/75">{f.texte}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section ton="bordeaux">
        <div className="grid items-end gap-14 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-champagne">Liste d&apos;attente</p>
            <h2 className="font-serif text-titre font-extrabold">
              Soyez informé·e
              <br />
              <span className="font-normal italic text-champagne">en premier.</span>
            </h2>
          </div>
          <div className="space-y-8">
            <ListeAttente liste="programmes" action="M'inscrire" promesse="Annonces d'ouverture des programmes et invitations aux événements." surSombre />
            <Link href="/appel" className="inline-block text-xs font-semibold uppercase tracking-[0.2em] underline decoration-champagne underline-offset-4">
              Sans attendre, réserver mon appel →
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
