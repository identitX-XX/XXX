import { PageHead } from "@/components/ui";
import { Archetypes } from "@/components/Archetypes";

export default function ArchetypesPage() {
  return (
    <div>
      <PageHead
        eyebrow="Module"
        title="Les 12 Archétypes"
        sub="Un archétype n'est jamais une étiquette : c'est une lentille d'exploration, activée différemment selon les contextes de vie."
      />
      <Archetypes />
    </div>
  );
}
