import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

// La mécanique produit, rendue lisible : du média gratuit à l'accompagnement.
// Chaque étape est une porte ; on peut entrer à n'importe laquelle.
const ETAPES = [
  { n: "01", verbe: "Lire", porte: "Le Journal", texte: "Identité, confiance, standards. Gratuit, chaque semaine.", href: "/journal" },
  { n: "02", verbe: "Se révéler", porte: "Programmes", texte: "Mindset, posture, image : devenir aligné·e avant de choisir.", href: "/programmes" },
  { n: "03", verbe: "Rencontrer", porte: "Matchmaking", texte: "Sentimental, relationnel, pro. Sur entretien, à la main.", href: "/rencontrer" },
  { n: "04", verbe: "S'entourer", porte: "Événements", texte: "Des rendez-vous en petit comité pour élargir son cercle.", href: "/evenements" },
];

export function Parcours() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <Eyebrow>Le parcours CéliBOSS™</Eyebrow>
          <h2 className="mt-6 text-titre">Se connaître pour mieux choisir.</h2>
        </div>
        <p className="max-w-md text-gris md:justify-self-end">
          Quatre étapes, une même exigence. On entre par celle qui vous ressemble aujourd&apos;hui.
        </p>
      </div>

      <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
        {/* Le fil qui relie les étapes (desktop). */}
        <span aria-hidden className="absolute left-0 right-0 top-[0.6rem] hidden h-px bg-taupe/50 md:block" />
        {ETAPES.map((e) => (
          <li key={e.n} className="relative">
            <span aria-hidden className="relative z-10 block h-5 w-5 rounded-full border border-bordeaux bg-ivoire" />
            <p className="mt-6 text-eyebrow uppercase text-gris">
              {e.n} · {e.porte}
            </p>
            <h3 className="mt-3 text-4xl">{e.verbe}</h3>
            <p className="mt-3 text-gris">{e.texte}</p>
            <Link href={e.href} className="mt-5 inline-block text-xs uppercase tracking-[0.18em] text-bordeaux hover:text-encre">
              Découvrir →
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
