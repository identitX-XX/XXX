import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/lib/site";

export function Manifeste() {
  return (
    <div className="max-w-4xl">
      <Eyebrow>{site.nom} — {site.signature}</Eyebrow>
      <h1 className="mt-8 text-manifeste">
        Vous avez tout construit.
        <br />
        <span className="italic text-bronze">L&apos;amour aussi se construit.</span>
      </h1>
      <p className="mt-10 max-w-lecture text-chapo text-gris">
        Celiboss est le média des femmes qui ont réussi ailleurs et refusent de laisser le hasard
        décider du reste. On y lit, on s&apos;y repositionne — et, pour celles qui sont prêtes, on y
        rencontre.
      </p>
    </div>
  );
}
