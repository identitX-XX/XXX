import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { CALCOM_LINK, CONTACT_EMAIL } from "@/lib/links";

export const metadata: Metadata = {
  title: "L'appel découverte",
  description: "Trente minutes avec Maï Diaw pour savoir si Celiboss est fait pour vous.",
};

export default function Appel() {
  return (
    <Section>
      <div className="mx-auto max-w-lecture text-center">
        <Eyebrow>L&apos;appel découverte</Eyebrow>
        <h1 className="mt-6 text-titre">Trente minutes. Sans engagement.</h1>
        <p className="mt-6 text-chapo text-gris">
          Choisissez un créneau. Maï Diaw vous appelle, personnellement.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl border border-filet bg-ivoire">
        {CALCOM_LINK ? (
          <iframe
            src={`https://cal.com/${CALCOM_LINK}?embed=true&theme=light&layout=month_view`}
            title="Réserver un appel découverte"
            className="h-[720px] w-full"
            loading="lazy"
          />
        ) : (
          <p className="p-10 text-center text-gris">
            Les réservations ouvrent très bientôt.
            {CONTACT_EMAIL && (
              <>
                {" "}En attendant :{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-bronze underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </Section>
  );
}
