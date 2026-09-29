/** Séparateur éditorial : deux filets et un point — respiration entre deux idées. */
export function Ornement({ surSombre }: { surSombre?: boolean }) {
  const c = surSombre ? "text-champagne" : "text-taupe";
  return (
    <div aria-hidden className={`flex items-center justify-center gap-4 ${c}`}>
      <span className="h-px w-16 bg-current" />
      <span className="h-1.5 w-1.5 rotate-45 border border-current" />
      <span className="h-px w-16 bg-current" />
    </div>
  );
}
