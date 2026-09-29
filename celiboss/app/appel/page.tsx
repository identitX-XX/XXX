import type { Metadata } from "next";
import { FormulaireAppel } from "@/components/appel/FormulaireAppel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CALCOM_LINK } from "@/lib/links";

export const metadata: Metadata = {
  title: "L'appel découverte",
  description: "Trente minutes avec Maï Diaw pour savoir si CéliBOSS™ est fait pour vous.",
};

const ENSUITE = [
  { t: "Vos informations", d: "Deux minutes, le strict nécessaire." },
  { t: "Votre créneau", d: "Choisi dans l'agenda de Maï Diaw." },
  { t: "L'appel", d: "Trente minutes, sans engagement. Elle vous appelle." },
];

const ASSURANCES = ["Confidentiel", "Sans engagement", "30 minutes"];

export default function Appel() {
  return (
    <div className="bg-ivoire">
      <div className="mx-auto grid max-w-page gap-14 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.5fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>L&apos;appel découverte</Eyebrow>
          <h1 className="mt-6 text-titre">Trente minutes pour savoir si nous sommes faits pour travailler ensemble.</h1>

          <ol className="mt-12 space-y-6">
            {ENSUITE.map((e, i) => (
              <li key={e.t} className="flex gap-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bordeaux font-serif text-bordeaux">
                  {i + 1}
                </span>
                <div>
                  <p className="font-serif text-xl">{e.t}</p>
                  <p className="text-sm text-gris">{e.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <ul className="mt-12 flex flex-wrap gap-2">
            {ASSURANCES.map((a) => (
              <li key={a} className="border border-taupe/70 px-3 py-1.5 text-eyebrow uppercase text-gris">
                {a}
              </li>
            ))}
          </ul>
        </aside>

        <div className="border border-filet bg-ivoire shadow-[0_30px_60px_-40px_rgba(41,29,27,0.35)]">
          <FormulaireAppel calcomLink={CALCOM_LINK} />
        </div>
      </div>
    </div>
  );
}
