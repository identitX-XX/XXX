import type { Metadata } from "next";
import { PageLegale } from "@/components/ui/PageLegale";

export const metadata: Metadata = { title: "Mentions légales", robots: { index: false } };

// ⚠️ Remplacer chaque [À compléter] par les informations exactes (Kbis, INPI).
export default function MentionsLegales() {
  return (
    <PageLegale titre="Mentions légales" maj="29 septembre 2026">
      <h2>Éditeur</h2>
      <p>
        CéliBOSS™ — [À compléter : forme juridique, raison sociale, capital]
        <br />
        Siège : [À compléter]
        <br />
        SIREN / RCS : [À compléter] — TVA intracommunautaire : [À compléter]
        <br />
        Directrice de la publication : Maï Diaw
        <br />
        Contact : [À compléter : e-mail]
      </p>
      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        CéliBOSS™, Glow Up et M.C MEN, ainsi que les textes, visuels et le manifeste publiés sur ce
        site, sont la propriété de leur autrice. Toute reproduction sans autorisation écrite est
        interdite.
      </p>
    </PageLegale>
  );
}
