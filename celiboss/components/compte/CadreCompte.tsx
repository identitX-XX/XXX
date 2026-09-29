import { LuneEtoile } from "@/components/ui/Symboles";

/** Écran d'accès au Compagnon : ciel de nuit, emblème, une colonne étroite. */
export function CadreCompte({ titre, sousTitre, children, pied }: { titre: React.ReactNode; sousTitre: string; children: React.ReactNode; pied: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-ivoire px-6 pb-20 pt-16 text-encre">
      <div className="relative mx-auto max-w-md space-y-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-filet text-bordeaux">
            <LuneEtoile taille={62} />
          </div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-bordeaux">CéliBOSS™ · Le Compagnon</p>
          <h1 className="font-serif text-5xl font-medium leading-none">{titre}</h1>
          <p className="text-gris">{sousTitre}</p>
        </div>
        {children}
        <div className="space-y-4 text-center text-sm text-gris">{pied}</div>
      </div>
    </section>
  );
}
