import type { Metadata } from "next";
import Link from "next/link";
import { SectionCompagnon } from "@/components/compagnon/SectionCompagnon";
import { ListeAttente } from "@/components/formulaires/ListeAttente";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Le Compagnon",
  description: "Sommeil, cardio, humeur, énergie, ambition : le Compagnon écoute votre corps et le traduit en élan. Sur téléphone et montre connectée.",
};

const GARANTIES = [
  { titre: "Votre consentement, explicite", texte: "Les données de santé ne sont lues qu'avec votre accord, donné à part et retirable à tout moment." },
  { titre: "Jamais visibles par le Cercle", texte: "Votre élan vous appartient. Aucun membre, aucune mise en relation n'y a accès." },
  { titre: "Chiffrées et hébergées en santé", texte: "Un hébergement certifié pour les données de santé (HDS) est prévu avant l'ouverture." },
];

export default function Compagnon() {
  return (
    <>
      <SectionCompagnon titreNiveau="h1" lien={false} />

      <Section>
        <h2 className="font-serif text-titre font-extrabold">
          Vos données de santé,
          <br />
          <span className="font-normal italic text-bordeaux">sous votre seule garde.</span>
        </h2>
        <div className="mt-14 grid border-t-2 border-encre md:grid-cols-3">
          {GARANTIES.map((g, i) => (
            <div key={g.titre} className={`space-y-3 border-b border-filet py-8 md:border-b-0 md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i < 2 ? "md:border-r" : "md:pr-0"}`}>
              <p className="font-serif text-2xl font-bold">{g.titre}</p>
              <p className="leading-relaxed text-gris">{g.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section ton="bordeaux" id="acces">
        <div className="grid items-end gap-14 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-champagne">Accès par e-mail et mot de passe</p>
            <h2 className="font-serif text-titre font-extrabold">
              Le Compagnon ouvre
              <br />
              <span className="font-normal italic text-champagne">à la prochaine lune.</span>
            </h2>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/inscription" className="bg-ivoire px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-nuit hover:bg-champagne">
                Créer mon compte
              </Link>
              <Link href="/connexion" className="border border-ivoire/60 px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:border-champagne hover:text-champagne">
                Se connecter
              </Link>
            </div>
          </div>
          <ListeAttente liste="compagnon" action="Être invité·e" promesse="Une invitation à l'ouverture du Compagnon, rien d'autre." surSombre />
        </div>
      </Section>
    </>
  );
}
