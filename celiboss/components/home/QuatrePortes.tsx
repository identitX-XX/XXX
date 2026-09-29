import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ORDRE_PORTES, PORTES } from "@/lib/rubriques";

export function QuatrePortes() {
  return (
    <>
      <Eyebrow>Quatre portes</Eyebrow>
      <ul className="mt-10 grid gap-px bg-filet md:grid-cols-2">
        {ORDRE_PORTES.map((id, i) => {
          const p = PORTES[id];
          const contenu = (
            <>
              <span className="font-serif text-lg text-bronze">0{i + 1}</span>
              <h2 className="mt-6 text-4xl">{p.nom}</h2>
              <p className="mt-4 max-w-sm text-gris">{p.promesse}</p>
              <span className="mt-10 block text-sm uppercase tracking-[0.14em]">
                {p.active ? "Entrer →" : "Bientôt"}
              </span>
            </>
          );
          return (
            <li key={id} className="bg-ivoire">
              {p.active ? (
                <Link href={p.href} className="block h-full p-10 transition-colors hover:bg-sable">
                  {contenu}
                </Link>
              ) : (
                <div className="h-full p-10 opacity-50" aria-disabled>
                  {contenu}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
