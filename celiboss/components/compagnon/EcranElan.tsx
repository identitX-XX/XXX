import { Constellation } from "@/components/compagnon/Constellation";
import { EXEMPLE_ELAN } from "@/lib/compagnon";

// Aperçu de l'écran « Votre élan du jour », dans un cadre de téléphone.
// Valeurs d'exemple : le calcul réel de l'élan reste à définir avec Maï Diaw.
const SIGNAUX = [
  { nom: "Sommeil", valeur: "7 h 12", source: "Montre" },
  { nom: "Cardio", valeur: "58 bpm", source: "Montre · au repos" },
  { nom: "Humeur", valeur: "Sereine", source: "Vous · esprit clair", italique: true },
  { nom: "Énergie", valeur: "4 / 5", source: "Vous" },
  { nom: "Ambition", valeur: "Haute", source: "Vous · cap du mois", italique: true },
];

export function EcranElan({ className = "" }: { className?: string }) {
  return (
    <div className={`w-[410px] max-w-full rounded-[3.25rem] bg-[#3a2c28] p-2.5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ${className}`}>
      <div className="overflow-hidden rounded-[2.6rem] bg-nuit px-5 pb-6 pt-7 text-ivoire" role="img" aria-label="Aperçu de l'écran Votre élan du jour">
        <div className="flex items-center justify-between">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-champagne">Le Compagnon</p>
          <span className="border border-champagne/50 px-2 py-1 text-[0.6875rem] text-ivoire/85">Montre synchronisée</span>
        </div>
        <p className="mt-3 font-serif text-[2.1rem] font-medium leading-none">
          Votre élan <span className="font-normal italic text-champagne">du jour.</span>
        </p>
        <Constellation elan={EXEMPLE_ELAN.valeur} scores={EXEMPLE_ELAN.detail} className="mx-auto mt-1 w-full" />
        <div className="grid grid-cols-3 gap-px border border-champagne/30 bg-champagne/30">
          {SIGNAUX.map((s) => (
            <div key={s.nom} className="space-y-1 bg-nuit p-2.5">
              <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.2em] text-ivoire/60">{s.nom}</p>
              <p className={`font-serif text-[1.2rem] leading-none ${s.italique ? "font-bold italic" : "font-medium"}`}>{s.valeur}</p>
              <p className="text-[0.5625rem] text-champagne">{s.source}</p>
            </div>
          ))}
          <div className="flex flex-col justify-between bg-bordeaux p-2.5">
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.2em] text-champagne">Point</p>
            <p className="font-serif text-base font-semibold leading-tight">du matin →</p>
          </div>
        </div>
        <div className="mt-3 border-l-2 border-champagne bg-ivoire/5 px-4 py-3">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.24em] text-champagne">Lecture du Compagnon</p>
          <p className="mt-1.5 font-serif text-[0.95rem] leading-snug">
            Sommeil stable, ambition haute : <span className="italic text-champagne">votre élan est prêt pour une rencontre.</span>
          </p>
        </div>
        <p className="mt-3 text-[0.625rem] text-ivoire/55">Valeurs d&apos;exemple. Vos données de santé restent privées.</p>
      </div>
    </div>
  );
}
