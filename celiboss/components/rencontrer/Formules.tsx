import { Eyebrow } from "@/components/ui/Eyebrow";

// Les trois terrains du matchmaking de Maï Diaw. Aucun prix affiché : tout se
// discute en entretien.
const FORMULES = [
  {
    nom: "Sentimental",
    accroche: "Rencontrer la bonne personne",
    texte: "Des présentations choisies à la main, pour une relation amoureuse engagée et durable.",
  },
  {
    nom: "Relationnel",
    accroche: "Choisir son cercle",
    texte: "Élargir son entourage avec des personnes alignées : amitiés, réseau de confiance, affinités.",
  },
  {
    nom: "Pro",
    accroche: "Les bonnes connexions",
    texte: "Associé·e, mentor, partenaire : la mise en relation professionnelle, avec le même discernement.",
  },
];

export function Formules() {
  return (
    <>
      <Eyebrow>Trois terrains de rencontre</Eyebrow>
      <h2 className="mt-6 max-w-3xl text-titre">Amoureuses, amicales, professionnelles. Toujours choisies.</h2>
      <ul className="mt-14 grid gap-px bg-filet md:grid-cols-3">
        {FORMULES.map((f) => (
          <li key={f.nom} className="bg-sable p-10">
            <p className="text-eyebrow uppercase text-gris">{f.accroche}</p>
            <h3 className="mt-4 text-4xl">{f.nom}</h3>
            <p className="mt-4 text-gris">{f.texte}</p>
            <p className="mt-10 text-sm uppercase tracking-[0.14em] text-bordeaux">Sur entretien</p>
          </li>
        ))}
      </ul>
    </>
  );
}
