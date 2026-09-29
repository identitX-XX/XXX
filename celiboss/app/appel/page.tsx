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
  { t: "L'appel", d: "Elle vous appelle, personnellement." },
];

const ASSURANCES = ["Confidentiel", "Sans engagement", "30 minutes"];

export default function Appel() {
  return (
    <div className="bg-ivoire text-encre">
      <div className="mx-auto grid max-w-[90rem] items-start gap-14 px-6 pb-rythme pt-20 md:px-10 lg:grid-cols-[1fr_1.25fr] lg:pt-24 xl:px-24">
        <aside className="space-y-10 lg:sticky lg:top-32">
          <Eyebrow>L&apos;appel découverte</Eyebrow>
          <h1 className="font-serif text-titre font-medium">
            Trente minutes.
            <br />
            <span className="font-normal italic text-bordeaux">Sans engagement.</span>
          </h1>
          <ol className="border-t border-filet">
            {ENSUITE.map((e, i) => (
              <li key={e.t} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-filet py-5">
                <span className={`font-serif text-4xl font-medium ${i === 0 ? "text-bordeaux" : "text-taupe"}`}>{i + 1}</span>
                <div>
                  <p className="font-serif text-2xl font-semibold">{e.t}</p>
                  <p className="mt-1 text-sm text-gris">{e.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <ul className="flex flex-wrap gap-2">
            {ASSURANCES.map((a) => (
              <li key={a} className="border border-taupe px-3.5 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-gris">
                {a}
              </li>
            ))}
          </ul>
        </aside>

        <div className="border border-filet bg-white shadow-[0_40px_80px_-48px_rgba(20,13,12,0.45)]">
          <FormulaireAppel calcomLink={CALCOM_LINK} />
        </div>
      </div>
    </div>
  );
}
