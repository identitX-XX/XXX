import { Ciel, LuneEtoile } from "@/components/ui/Symboles";

/** Écran d'accès au Compagnon : ciel de nuit, emblème, une colonne étroite. */
export function CadreCompte({ titre, sousTitre, children, pied }: { titre: React.ReactNode; sousTitre: string; children: React.ReactNode; pied: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-nuit px-6 pb-20 pt-16 text-ivoire">
      <Ciel />
      <div className="relative mx-auto max-w-md space-y-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-champagne/50 text-champagne">
            <LuneEtoile taille={62} />
          </div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-champagne">CéliBOSS™ · Le Compagnon</p>
          <h1 className="font-serif text-5xl font-extrabold leading-none">{titre}</h1>
          <p className="text-ivoire/75">{sousTitre}</p>
        </div>
        {children}
        <div className="space-y-4 text-center text-sm text-ivoire/75">{pied}</div>
      </div>
    </section>
  );
}
