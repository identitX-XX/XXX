import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ORDRE_PORTES, PORTES } from "@/lib/rubriques";

export function QuatrePortes() {
  return (
    <>
      <Eyebrow>L&apos;univers CéliBOSS™</Eyebrow>
      <h2 className="mt-6 max-w-2xl text-titre">Quatre portes. Une même exigence.</h2>
      <ul className="mt-10 grid gap-px bg-filet md:grid-cols-2">
        {ORDRE_PORTES.map((id, i) => {
          const p = PORTES[id];
          const contenu = (
            <>
              <span className="font-serif text-lg text-taupe">0{i + 1}</span>
              <h3 className="mt-6 text-4xl transition-colors group-hover:text-bordeaux">{p.nom}</h3>
              {p.detail && <p className="mt-3 text-eyebrow uppercase text-bordeaux">{p.detail}</p>}
              <p className="mt-4 max-w-sm text-gris">{p.promesse}</p>
              <span className="mt-10 block text-xs uppercase tracking-[0.18em] text-bordeaux">
                {p.active ? "Entrer →" : "Rejoindre la liste d'attente →"}
              </span>
            </>
          );
          return (
            <li key={id} className="bg-ivoire">
              <Link href={p.href} className="group relative block h-full p-10 transition-colors hover:bg-sable">
                {!p.active && (
                  <span className="absolute right-10 top-10 border border-taupe px-3 py-1 text-eyebrow uppercase text-gris">
                    Bientôt
                  </span>
                )}
                {contenu}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
