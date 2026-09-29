import { Eyebrow } from "@/components/ui/Eyebrow";

// Les objections, levées AVANT l'appel : moins de frictions, appels mieux qualifiés.
const QUESTIONS = [
  {
    q: "Combien coûte l'accompagnement ?",
    r: "Chaque accompagnement est construit sur mesure ; les tarifs sont présentés lors de l'entretien, une fois votre projet compris. L'appel découverte est sans engagement.",
  },
  {
    q: "CéliBOSS™ s'adresse-t-il aussi aux hommes ?",
    r: "Oui. CéliBOSS™ accompagne les femmes et les hommes qui ont construit leur vie et ne veulent plus choisir leurs relations par défaut.",
  },
  {
    q: "Mon identité reste-t-elle confidentielle ?",
    r: "Toujours. Aucun profil n'est publié ni partagé sans votre accord explicite. Les présentations se font une à une, jamais sous forme de catalogue.",
  },
  {
    q: "Quelle différence avec une application de rencontre ?",
    r: "Il n'y a ni algorithme ni swipe. Maï Diaw vous rencontre, comprend vos standards, puis sélectionne à la main chaque personne qu'elle vous présente.",
  },
  {
    q: "Le matchmaking pro, c'est quoi ?",
    r: "La même exigence appliquée aux relations professionnelles : associé·e, mentor, partenaire. Une mise en relation choisie, pas un réseau de plus.",
  },
];

export function FAQ() {
  return (
    <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
      <div>
        <Eyebrow>Questions fréquentes</Eyebrow>
        <h2 className="mt-6 text-titre">Avant l&apos;appel.</h2>
      </div>
      <div className="divide-y divide-filet border-y border-filet">
        {QUESTIONS.map(({ q, r }) => (
          <details key={q} className="group py-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-2xl [&::-webkit-details-marker]:hidden">
              {q}
              <span aria-hidden className="mt-1 font-sans text-xl text-bordeaux transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-lecture text-gris">{r}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
