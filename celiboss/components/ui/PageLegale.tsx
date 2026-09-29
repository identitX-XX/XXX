import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

/** Gabarit sobre pour les pages légales. `[À compléter]` = information à fournir. */
export function PageLegale({ titre, maj, children }: { titre: string; maj: string; children: React.ReactNode }) {
  return (
    <Section etroit>
      <Eyebrow>Informations légales</Eyebrow>
      <h1 className="mt-6 text-titre">{titre}</h1>
      <p className="mt-4 text-sm text-gris">Dernière mise à jour : {maj}</p>
      <div className="prose-journal mt-12 !mx-0 text-base">{children}</div>
    </Section>
  );
}
