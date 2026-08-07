import { Accroche } from "./sections/Accroche";
import { Promesse } from "./sections/Promesse";
import { Methode } from "./sections/Methode";
import { Temoignages } from "./sections/Temoignages";
import { PourQui } from "./sections/PourQui";
import { CtaFinal } from "./sections/CtaFinal";

// Filet horizontal 1px, accent bronze : le seul séparateur entre les grandes
// sections. Contenu centré sur la largeur de lecture.
function Filet() {
  return (
    <div className="px-6" aria-hidden="true">
      <div className="mx-auto h-px max-w-[34rem] bg-[var(--bronze)]" />
    </div>
  );
}

export default function LaConversationPage() {
  return (
    <main>
      <Accroche />
      <Filet />
      <Promesse />
      <Filet />
      <Methode />
      <Filet />
      <Temoignages />
      <Filet />
      <PourQui />
      <Filet />
      <CtaFinal />

      <footer className="border-t border-[color:var(--filet)] px-6 py-10">
        <div className="mx-auto flex max-w-[34rem] flex-col gap-1 text-[13px] leading-[1.6] text-[color:var(--gris)]">
          <p>La Conversation</p>
          <p>
            <a
              href="/mentions-legales"
              className="text-[color:var(--bronze)] underline underline-offset-2"
            >
              Mentions légales
            </a>
          </p>
          <p>
            <a
              href="mailto:contact@laconversation.fr"
              className="text-[color:var(--bronze)] underline underline-offset-2"
            >
              contact@laconversation.fr
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
