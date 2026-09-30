import { Constellation } from "@/components/compagnon/Constellation";
import { EXEMPLE_ELAN } from "@/lib/compagnon";

function Boitier({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-8 w-24 rounded-t-[10px] bg-[#3a2c28]" />
      <div className="relative flex h-[236px] w-[200px] flex-col justify-center rounded-[52px] border-[7px] border-[#3a2c28] bg-[#0b0706] px-4 text-ivoire shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)]">
        {children}
        <div className="absolute -right-3.5 top-16 h-9 w-2 rounded-sm bg-champagne" />
      </div>
      <div className="h-8 w-24 rounded-b-[10px] bg-[#3a2c28]" />
    </div>
  );
}

/** Deux cadrans : l'élan au poignet, et l'humeur notée d'un geste. */
export function Montres({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-10 ${className}`} role="img" aria-label="Aperçu du Compagnon sur montre connectée">
      <Boitier>
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[0.625rem] font-semibold tracking-[0.3em] text-champagne">ÉLAN</p>
          <Constellation elan={EXEMPLE_ELAN.valeur} scores={EXEMPLE_ELAN.detail} avecLibelles={false} className="h-[84px] w-[120px]" />
          <p className="text-xs text-ivoire/85">Sommeil 7 h 12</p>
          <p className="text-xs text-ivoire/85">Cardio 58 bpm</p>
        </div>
      </Boitier>
      <Boitier>
        <div className="flex flex-col gap-2">
          <p className="text-center font-serif text-[1.05rem] italic leading-tight">
            Et vous,
            <br />
            ce soir ?
          </p>
          <span className="flex h-8 items-center justify-center rounded-2xl bg-champagne text-xs font-semibold text-nuit">En élan</span>
          <span className="flex h-8 items-center justify-center rounded-2xl border border-champagne/60 text-xs">Sereine</span>
          <span className="flex h-8 items-center justify-center rounded-2xl border border-champagne/60 text-xs">Tendue</span>
        </div>
      </Boitier>
    </div>
  );
}
