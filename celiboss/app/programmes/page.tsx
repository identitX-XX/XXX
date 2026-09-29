import type { Metadata } from "next";
import { PageBientot } from "@/components/formulaires/PageBientot";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Glow Up, M.C MEN et le coaching de Maï Diaw : mindset, posture, image, intelligence émotionnelle.",
};

export default function Programmes() {
  return (
    <PageBientot
      liste="programmes"
      surtitre="Programmes & coaching"
      titre={
        <>
          Devenir aligné·e, <span className="italic text-bordeaux">avant de choisir.</span>
        </>
      }
      chapo="On ne choisit bien que lorsqu'on se connaît. Les programmes de Maï Diaw travaillent ce qui se voit et ce qui ne se voit pas : l'image, la posture, le mindset, l'intelligence émotionnelle."
      piliers={[
        { nom: "Glow Up", texte: "Image, posture, présence : aligner ce que l'on voit de vous avec ce que vous êtes." },
        { nom: "M.C MEN", texte: "Le programme pensé pour les hommes qui veulent construire des relations à la hauteur de leurs ambitions." },
        { nom: "Coaching", texte: "Un accompagnement individuel : standards, confiance, intelligence émotionnelle." },
      ]}
      promesse="Vous recevrez l'annonce d'ouverture des programmes et les dates des prochaines sessions."
    />
  );
}
