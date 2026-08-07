// Bouton d'appel à l'action (accent bronze, texte ivoire). Identique en
// sections 1 et 6. Pleine largeur en mobile, zone tactile ≥ 48px. Ouvre le
// planning dans un nouvel onglet. L'URL vient de l'environnement, avec une
// valeur en dur pour l'instant (à remplacer avant mise en ligne).
const CALL_URL =
  process.env.NEXT_PUBLIC_CALL_URL ?? "https://cal.com/REMPLACER/decouverte";

export function CtaButton({ label }: { label: string }) {
  return (
    <a
      href={CALL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[2px] bg-[var(--bronze)] px-8 py-3 text-center text-[17px] font-medium leading-tight text-[color:var(--ivoire)] sm:w-auto"
    >
      {label}
    </a>
  );
}
