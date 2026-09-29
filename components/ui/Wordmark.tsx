/** Logotype CéliBOSS™ : « Céli » en serif, « BOSS » en capitales espacées. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-serif tracking-tight ${className}`} aria-label="CéliBOSS">
      <span aria-hidden>Céli</span>
      <span aria-hidden className="ml-[0.06em] font-sans text-[0.62em] font-medium tracking-[0.2em]">
        BOSS
      </span>
      <sup aria-hidden className="ml-0.5 font-sans text-[0.32em] tracking-normal">
        ™
      </sup>
    </span>
  );
}
