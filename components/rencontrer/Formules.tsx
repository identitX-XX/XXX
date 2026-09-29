import { Eyebrow } from "@/components/ui/Eyebrow";

// Aucun prix affiché : les formules se discutent en entretien.
const FORMULES = [
  { nom: "Essentielle", duree: "6 mois", texte: "Présentations sélectionnées et débrief après chaque rencontre." },
  { nom: "Signature", duree: "12 mois", texte: "L'accompagnement complet : présentations, coaching de posture et suivi rapproché." },
  { nom: "Privée", duree: "Sur mesure", texte: "Recherche dédiée, discrétion absolue, réseau étendu à l'international." },
];

export function Formules() {
  return (
    <>
      <Eyebrow>Les formules</Eyebrow>
      <h2 className="mt-6 text-titre">Trois niveaux d&apos;engagement.</h2>
      <ul className="mt-14 grid gap-px bg-filet md:grid-cols-3">
        {FORMULES.map((f) => (
          <li key={f.nom} className="bg-sable p-10">
            <p className="text-eyebrow uppercase text-gris">{f.duree}</p>
            <h3 className="mt-4 text-3xl">{f.nom}</h3>
            <p className="mt-4 text-gris">{f.texte}</p>
            <p className="mt-10 text-sm uppercase tracking-[0.14em] text-bronze">Sur entretien</p>
          </li>
        ))}
      </ul>
    </>
  );
}
