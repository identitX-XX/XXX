import { CONVERGENCES } from "@/lib/positionnement";

/** Les trois convergences, en triptyque : domaine → mouvement → destination. */
export function Convergences({ surSombre, compact }: { surSombre?: boolean; compact?: boolean }) {
  const filet = surSombre ? "border-ivoire/20" : "border-taupe/60";
  const doux = surSombre ? "text-ivoire/70" : "text-gris";
  const accent = surSombre ? "text-champagne" : "text-bordeaux";
  return (
    <ol className={`grid gap-10 ${compact ? "" : "md:grid-cols-3 md:gap-8"}`}>
      {CONVERGENCES.map((c) => (
        <li key={c.domaine} className={`border-t pt-6 ${filet}`}>
          <p className={`text-eyebrow uppercase ${doux}`}>{c.domaine}</p>
          <p className={`mt-4 font-serif font-light leading-tight ${compact ? "text-3xl" : "text-4xl"}`}>
            <span className={`italic ${accent}`}>{c.verbe}</span> {c.destination}
          </p>
          {!compact && <p className={`mt-4 ${doux}`}>{c.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
