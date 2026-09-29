import type { Metadata } from "next";
import { PageBientot } from "@/components/formulaires/PageBientot";

export const metadata: Metadata = {
  title: "Événements",
  description: "Les événements CéliBOSS™ : des rencontres choisies, en petit comité.",
};

export default function Evenements() {
  return (
    <PageBientot
      liste="evenements"
      surtitre="Événements"
      titre={
        <>
          Certaines rencontres changent une soirée.{" "}
          <span className="italic text-bordeaux">D&apos;autres, une trajectoire.</span>
        </>
      }
      chapo="Dîners, ateliers, conversations : des formats en petit comité, sur invitation, où les connexions peuvent devenir amoureuses, amicales ou professionnelles."
      piliers={[
        { nom: "Dîners", texte: "Une table choisie, des personnes alignées. La conversation fait le reste." },
        { nom: "Ateliers", texte: "Mindset, posture, image : apprendre ensemble, en groupe restreint." },
        { nom: "Cercles", texte: "Des rendez-vous réguliers pour celles et ceux qui ont rejoint l'univers CéliBOSS™." },
      ]}
      promesse="Vous recevrez les invitations aux prochains événements, avant leur ouverture publique."
    />
  );
}
