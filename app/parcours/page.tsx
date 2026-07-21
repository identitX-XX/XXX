import { PageHead } from "@/components/ui";
import { ParcoursOverview } from "@/components/ParcoursOverview";

export default function ParcoursPage() {
  return (
    <div>
      <PageHead
        eyebrow="Quête IdentitX"
        title="Ton parcours"
        sub="Ton exploration, étape par étape. Suis le fil, ou entre par où ça t'appelle."
      />
      <ParcoursOverview />
    </div>
  );
}
