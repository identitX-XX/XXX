import type { Metadata } from "next";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Maï Diaw",
  description: "Fondatrice de Celiboss. Parcours, méthode et presse.",
};

// ⚠️ Contenus à fournir par Maï Diaw : parcours réel et parutions presse.
// Rien n'est inventé ici — les listes vides ne s'affichent pas.
const PARCOURS: { annee: string; texte: string }[] = [];
const PRESSE: { media: string; titre: string; url: string }[] = [];

export default function MaiDiaw() {
  return (
    <>
      <Section>
        <Eyebrow>La fondatrice</Eyebrow>
        <h1 className="mt-8 text-manifeste">Maï Diaw</h1>
        <p className="mt-10 max-w-lecture text-chapo text-gris">
          Fondatrice et CEO de Celiboss. {/* TODO: phrase d'autorité — qui elle est, en une ligne. */}
        </p>
      </Section>

      {PARCOURS.length > 0 && (
        <Section ton="sable">
          <Eyebrow>Parcours</Eyebrow>
          <ol className="mt-10 space-y-8">
            {PARCOURS.map((p) => (
              <li key={p.annee} className="grid gap-2 border-t border-filet pt-6 md:grid-cols-[8rem_1fr]">
                <span className="font-serif text-2xl text-bronze">{p.annee}</span>
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
                  <span className="mt-2 block font-serif text-2xl group-hover:text-bronze-fonce">{p.titre}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section ton="sable" etroit>
        <h2 className="text-titre">Parlons-en de vive voix.</h2>
        <div className="mt-10">
          <CTA />
        </div>
      </Section>
    </>
  );
}
