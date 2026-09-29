import { ListeAttente } from "@/components/formulaires/ListeAttente";
import { CTA } from "@/components/ui/CTA";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";
import type { Liste } from "@/lib/candidature";

type Props = {
  liste: Liste;
  surtitre: string;
  titre: React.ReactNode;
  chapo: string;
  piliers: { nom: string; texte: string }[];
  promesse: string;
  photo?: { src: string; alt: string; focus?: string; zoom?: number };
};

/** Porte « bientôt » : présenter, puis capter l'intérêt (jamais d'impasse). */
export function PageBientot({ liste, surtitre, titre, chapo, piliers, promesse, photo }: Props) {
  return (
    <>
      <Section>
        <div className={photo ? "grid items-center gap-16 md:grid-cols-[1.1fr_0.9fr] lg:gap-24" : ""}>
          <div>
            <Eyebrow>{surtitre}</Eyebrow>
            <h1 className="mt-8 max-w-4xl text-manifeste font-light">{titre}</h1>
            <p className="mt-10 max-w-lecture text-chapo text-gris">{chapo}</p>
            <p className="mt-10 inline-block border border-taupe px-4 py-2 text-eyebrow uppercase text-gris">
              Ouverture prochaine
            </p>
          </div>
          {photo && <Portrait {...photo} priority className="mx-auto w-full max-w-md" />}
        </div>
      </Section>

      <Section ton="sable">
        <ul className="grid gap-px bg-filet md:grid-cols-3">
          {piliers.map((p, i) => (
            <li key={p.nom} className="bg-sable p-8 md:p-10">
              <span className="font-serif text-lg text-taupe">0{i + 1}</span>
              <h2 className="mt-5 text-3xl">{p.nom}</h2>
              <p className="mt-4 text-gris">{p.texte}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section ton="bordeaux">
        <div className="grid gap-14 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow surSombre>Liste d&apos;attente</Eyebrow>
            <h2 className="mt-6 text-titre">Soyez informé·e en premier.</h2>
          </div>
          <ListeAttente liste={liste} action="M'inscrire" promesse={promesse} surSombre />
        </div>
        <div className="mt-20 border-t border-ivoire/15 pt-10">
          <p className="mb-6 font-serif text-xl italic text-ivoire/80">Sans attendre, parlons de votre projet :</p>
          <CTA ton="sombre" />
        </div>
      </Section>
    </>
  );
}
