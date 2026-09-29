import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section etroit>
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-6 text-titre">Cette page n&apos;existe pas. Ou plus.</h1>
      <p className="mt-6 text-chapo text-gris">
        Certaines portes se ferment. D&apos;autres attendent qu&apos;on les pousse.
      </p>
      <Link href="/journal" className="mt-10 inline-block text-sm uppercase tracking-[0.14em] text-bordeaux hover:text-encre">
        Lire le Journal →
      </Link>
    </Section>
  );
}
