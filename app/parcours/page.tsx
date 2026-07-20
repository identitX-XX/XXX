import { PageHead } from "@/components/ui";
import { ParcoursOverview } from "@/components/ParcoursOverview";

export default function ParcoursPage() {
  return (
    <div>
      <PageHead
        eyebrow="Quête IdentitX"
        title="Ton parcours"
        sub="Les huit étapes de ton exploration, dans l'ordre. Entre où tu veux."
      />
      <ParcoursOverview />
    </div>
  );
}
