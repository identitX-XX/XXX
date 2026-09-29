import { Eyebrow } from "@/components/ui/Eyebrow";

// Le seuil filtre avant l'appel : mieux vaut perdre une candidature que
// décevoir une membre. Ajuster les critères ici, nulle part ailleurs.
const CRITERES = [
  { titre: "Vous êtes disponible", texte: "Célibataire, et prête à rendre de la place dans votre agenda comme dans votre vie." },
  { titre: "Vous êtes établie", texte: "Une vie professionnelle et personnelle stable. Vous ne cherchez pas quelqu'un pour vous sauver." },
  { titre: "Vous savez ce que vous voulez", texte: "Une relation engagée, durable. Pas une distraction." },
  { titre: "Vous acceptez d'être accompagnée", texte: "Un regard extérieur, des retours francs, et parfois des remises en question." },
];

export function Seuil() {
  return (
    <>
      <Eyebrow>Le seuil</Eyebrow>
      <h2 className="mt-6 max-w-2xl text-titre">Ce n&apos;est pas pour tout le monde. C&apos;est voulu.</h2>
      <dl className="mt-14 grid gap-10 md:grid-cols-2">
        {CRITERES.map((c) => (
          <div key={c.titre} className="border-t border-filet pt-6">
            <dt className="font-serif text-2xl">{c.titre}</dt>
            <dd className="mt-3 text-gris">{c.texte}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
