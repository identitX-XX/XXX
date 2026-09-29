import { Eyebrow } from "@/components/ui/Eyebrow";

const ETAPES = [
  { titre: "L'appel", texte: "Trente minutes pour se rencontrer et vérifier que le cadre vous convient." },
  { titre: "L'entretien", texte: "Un échange approfondi avec Maï Diaw : votre histoire, vos exigences, vos angles morts." },
  { titre: "La sélection", texte: "Des profils présentés un à un, choisis à la main. Jamais d'algorithme, jamais de catalogue." },
  { titre: "Le suivi", texte: "Un débrief après chaque rencontre, pour ajuster la trajectoire." },
];

export function Methode() {
  return (
    <>
      <Eyebrow>La méthode</Eyebrow>
      <h2 className="mt-6 text-titre">Quatre étapes. Aucune automatisée.</h2>
      <ol className="mt-14 grid gap-10 md:grid-cols-4">
        {ETAPES.map((e, i) => (
          <li key={e.titre}>
            <span className="font-serif text-5xl text-taupe">{i + 1}</span>
            <h3 className="mt-4 text-2xl">{e.titre}</h3>
            <p className="mt-3 text-gris">{e.texte}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
