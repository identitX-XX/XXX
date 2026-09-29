/** Logotype CéliBOSS™ : « Céli » en Bodoni, « BOSS » en capitales espacées. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline font-serif font-medium ${className}`} aria-label="CéliBOSS">
      <span aria-hidden>Céli</span>
      <span aria-hidden className="ml-[0.08em] font-sans text-[0.57em] font-semibold tracking-[0.3em]">
        BOSS
      </span>
      <sup aria-hidden className="font-sans text-[0.36em] tracking-normal text-champagne">
        ™
      </sup>
    </span>
  );
}
