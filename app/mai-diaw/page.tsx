import type { Metadata } from "next";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Maï Diaw",
  description:
    "Maï Diaw, matchmakeuse d'exception et fondatrice de CéliBOSS™ : matchmaking pro, relationnel et sentimental, coaching, programmes et événements.",
};

// Faits issus de la bio de Maï Diaw. Parcours détaillé et presse : à fournir
// par elle — rien n'est inventé, les listes vides ne s'affichent pas.
const EXPERTISES = ["Intelligence émotionnelle", "Mindset", "Posture", "Image"];
const TERRAINS = ["Pro", "Relationnel", "Sentimental"];
const FORMATS = ["Événements", "Coaching", "Programmes"];
const MARQUES = ["CéliBOSS™", "Glow Up", "M.C MEN"];

const PARCOURS: { annee: string; texte: string }[] = [];
const PRESSE: { media: string; titre: string; url: string }[] = [];

function Colonne({ titre, items }: { titre: string; items: string[] }) {
  return (
    <div className="border-t border-taupe/60 pt-6">
      <Eyebrow>{titre}</Eyebrow>
      <ul className="mt-6 space-y-2 font-serif text-3xl">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default function MaiDiaw() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <Eyebrow>Fondatrice de CéliBOSS™</Eyebrow>
            <h1 className="mt-8 text-manifeste font-light">Maï Diaw</h1>
            <p className="mt-6 font-serif text-titre font-light italic text-bordeaux">Matchmakeuse d&apos;exception.</p>
            <p className="mt-10 max-w-lecture text-chapo text-gris">
              Elle met en relation celles et ceux qui ont construit — en amour, en amitié comme en
              affaires — et les accompagne pour qu&apos;ils ne choisissent plus rien par défaut.
            </p>
          </div>
          <Portrait
            src="/images/mai-diaw-portrait.jpg"
            alt="Portrait de Maï Diaw, souriante, en robe blanche sur une terrasse ensoleillée"
            focus="40% 32%"
            zoom={1.32}
            priority
            className="mx-auto w-full max-w-md"
          />
        </div>
      </Section>

      <Section ton="sable">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <Colonne titre="Mettre en relation" items={TERRAINS} />
          <Colonne titre="Expertises" items={EXPERTISES} />
          <Colonne titre="Formats" items={FORMATS} />
          <Colonne titre="Univers" items={MARQUES} />
        </div>
      </Section>

      {PARCOURS.length > 0 && (
        <Section>
          <Eyebrow>Parcours</Eyebrow>
          <ol className="mt-10 space-y-8">
            {PARCOURS.map((p) => (
              <li key={p.annee} className="grid gap-2 border-t border-filet pt-6 md:grid-cols-[8rem_1fr]">
                <span className="font-serif text-2xl text-bordeaux">{p.annee}</span>
                <p>{p.texte}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {PRESSE.length > 0 && (
        <Section>
          <Eyebrow>Presse</Eyebrow>
          <ul className="mt-10 space-y-6">
            {PRESSE.map((p) => (
              <li key={p.url} className="border-t border-filet pt-6">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="group">
                  <span className="text-eyebrow uppercase text-gris">{p.media}</span>
                  <span className="mt-2 block font-serif text-2xl group-hover:text-bordeaux">{p.titre}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section ton="bordeaux" etroit>
        <h2 className="text-titre">Parlons-en de vive voix.</h2>
        <div className="mt-10">
          <CTA ton="sombre" />
        </div>
      </Section>
    </>
  );
}
