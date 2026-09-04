// L'exercice du jour — un par périmètre de vie (perso · pro · relationnel),
// orienté par la direction posée sur chaque périmètre ET par la signature du
// moment. La consigne CHANGE vraiment d'un jour à l'autre : ce n'est plus la
// même phrase avec un nom d'archétype échangé, mais une formulation différente
// (verbe, angle, geste) choisie par rotation sur le numéro du jour. La quête
// « évolue » donc de façon visible, jour après jour et signature après signature.

import type { Archetype, Objectifs } from "./types";
import { PERIMETRES, anglePerimetre, directionDe, Perimetre } from "@/parcours-gap/perimetres";

export type { Perimetre } from "@/parcours-gap/perimetres";

export interface ExercicePerimetre {
  perimetre: Perimetre;
  label: string;
  direction: string; // la direction posée (peut être vide)
  consigne: string; // l'exercice du jour, teinté de la signature du moment
}

// Plusieurs cadrages DISTINCTS par périmètre. On en choisit un selon le jour
// (rotation déterministe) → deux jours consécutifs ne tombent jamais sur la
// même consigne, même si la signature n'a pas encore changé. `sig` = nom de la
// signature du moment ; `cible` = la direction posée (ou un repli neutre).
type Cadrage = (sig: string, cible: string) => string;

const CADRAGES: Record<Perimetre, Cadrage[]> = {
  perso: [
    (sig, cible) => `Où, dans ${anglePerimetre("perso")}, l'énergie de « ${sig} » demande-t-elle à s'exprimer aujourd'hui ? Pose un geste minuscule, au service de ${cible}.`,
    (sig, cible) => `Repère un moment où ${anglePerimetre("perso")} se tend. Comment « ${sig} » y répondrait autrement ? Tente ce petit ajustement, pour ${cible}.`,
    (sig, cible) => `Offre-toi trois minutes rien que pour toi, dans l'esprit de « ${sig} ». Qu'est-ce que ce temps change pour ${cible} ?`,
    (sig, cible) => `Ce soir, nomme une sensation que « ${sig} » a réveillée dans ton corps. Qu'est-ce qu'elle t'apprend sur ${cible} ?`,
    (sig, cible) => `Choisis une habitude qui t'épuise. Traversée par « ${sig} », comment l'allégerais-tu aujourd'hui, au service de ${cible} ?`,
    (sig, cible) => `Accorde-toi un plaisir simple, teinté de « ${sig} ». En quoi nourrit-il ${cible} ?`,
    (sig, cible) => `Écoute ce dont ton énergie a besoin, là, maintenant. Réponds-y à la manière de « ${sig} », pour ${cible}.`,
    (sig, cible) => `Quel « non » « ${sig} » poserait-elle pour se protéger aujourd'hui ? Dis-le, même tout bas, au service de ${cible}.`,
    (sig, cible) => `Nomme une pensée qui te juge en boucle. Que lui répondrait « ${sig} » ? Écris-lui une phrase, pour ${cible}.`,
    (sig, cible) => `Bouge ton corps deux minutes comme « ${sig} » le ferait — grande, lente, ou vive. Qu'est-ce que ça réveille pour ${cible} ?`,
    (sig, cible) => `Repère une chose que tu fais « parce qu'il faut ». « ${sig} » la garderait-elle ? Décide, pour ${cible}.`,
    (sig, cible) => `Avant de dormir, remercie-toi pour UN geste d'aujourd'hui, à la manière de « ${sig} ». En quoi sert-il ${cible} ?`,
  ],
  pro: [
    (sig, cible) => `Dans ${anglePerimetre("pro")}, comment « ${sig} » changerait ta prochaine action concrète ? Fais ce pas, pour faire avancer ${cible}.`,
    (sig, cible) => `Identifie une tâche que tu repousses. Abordée avec « ${sig} », par quoi commencerais-tu, au service de ${cible} ?`,
    (sig, cible) => `Dans un échange pro aujourd'hui, ose une prise de parole teintée de « ${sig} ». Que fait-elle bouger pour ${cible} ?`,
    (sig, cible) => `Repère une contrainte de ton travail. Vue par « ${sig} », quelle marge de jeu te reste-t-il pour ${cible} ?`,
    (sig, cible) => `Avant ce soir, termine UNE chose, à la manière de « ${sig} ». En quoi rapproche-t-elle ${cible} ?`,
    (sig, cible) => `Quelle décision pro évites-tu ? Nomme le premier micro-pas que « ${sig} » oserait, pour ${cible}.`,
    (sig, cible) => `Observe ta façon de travailler aujourd'hui. Où « ${sig} » voudrait-elle plus de place, au service de ${cible} ?`,
    (sig, cible) => `À qui pourrais-tu demander quelque chose aujourd'hui ? Formule-le comme « ${sig} » le ferait, pour ${cible}.`,
    (sig, cible) => `Repère un moment où tu t'effaces au travail. Qu'est-ce que « ${sig} » y affirmerait, au service de ${cible} ?`,
    (sig, cible) => `Choisis une idée que tu gardes pour toi. Partage-la à une personne, dans l'esprit de « ${sig} », pour ${cible}.`,
    (sig, cible) => `Où mets-tu trop d'énergie pour rien aujourd'hui ? « ${sig} » couperait où, au service de ${cible} ?`,
    (sig, cible) => `Fixe-toi une seule priorité pour demain, choisie par « ${sig} ». En quoi sert-elle ${cible} ?`,
  ],
  love: [
    (sig, cible) => `Dans ${anglePerimetre("love")}, ose aujourd'hui un geste tendre teinté de « ${sig} » — au service de ${cible}.`,
    (sig, cible) => `Dis à l'autre une chose que tu ressens et que tu gardes d'habitude, dans l'esprit de « ${sig} ». Qu'est-ce que ça ouvre pour ${cible} ?`,
    (sig, cible) => `Repère un automatisme qui t'éloigne dans le couple (ou face à l'amour). Comment « ${sig} » ferait autrement, pour ${cible} ?`,
    (sig, cible) => `Demande clairement ce dont tu as besoin en amour, avec l'assise de « ${sig} ». En quoi ça change ${cible} ?`,
    (sig, cible) => `Offre une attention gratuite à la personne qui compte, teintée de « ${sig} ». Qu'est-ce que ça fait à ${cible} ?`,
    (sig, cible) => `Nomme une peur que l'amour réveille en toi. Traversée par « ${sig} », comment l'apprivoiser aujourd'hui, pour ${cible} ?`,
    (sig, cible) => `Pose une limite douce ou dis un vrai « non » à l'autre, dans l'esprit de « ${sig} ». En quoi protège-t-il ${cible} ?`,
    (sig, cible) => `Reçois un compliment ou un geste sans le minimiser, à la manière de « ${sig} ». Que remarques-tu pour ${cible} ?`,
    (sig, cible) => `Prends l'initiative d'un moment à deux (ou d'un pas vers quelqu'un), teinté de « ${sig} », au service de ${cible}.`,
    (sig, cible) => `Repère où tu te caches en amour. Qu'est-ce que « ${sig} » oserait montrer aujourd'hui, pour ${cible} ?`,
    (sig, cible) => `Remercie sincèrement l'autre pour une chose précise, dans l'esprit de « ${sig} ». Qu'est-ce que ça change pour ${cible} ?`,
    (sig, cible) => `Écoute la personne aimée sans chercher à résoudre, à la manière de « ${sig} ». Que découvres-tu pour ${cible} ?`,
  ],
  relationnel: [
    (sig, cible) => `Avec ${anglePerimetre("relationnel")}, ose aujourd'hui une interaction teintée de « ${sig} » — au service de ${cible}.`,
    (sig, cible) => `Dis à quelqu'un une chose vraie que tu tais d'habitude, dans l'esprit de « ${sig} ». Qu'est-ce que ça ouvre pour ${cible} ?`,
    (sig, cible) => `Écoute un proche sans préparer ta réponse, à la manière de « ${sig} ». Que remarques-tu pour ${cible} ?`,
    (sig, cible) => `Pose une petite limite, avec la douceur de « ${sig} ». En quoi protège-t-elle ${cible} ?`,
    (sig, cible) => `Offre une attention gratuite à quelqu'un, teintée de « ${sig} ». Qu'est-ce que ça change pour ${cible} ?`,
    (sig, cible) => `Repère une relation qui te coûte. Traversée par « ${sig} », quel ajustement tenterais-tu, pour ${cible} ?`,
    (sig, cible) => `Demande de l'aide, ou dis merci vraiment, dans l'esprit de « ${sig} ». Que fait ce geste pour ${cible} ?`,
    (sig, cible) => `À qui penses-tu sans jamais le lui dire ? Envoie-lui un mot, comme « ${sig} », au service de ${cible}.`,
    (sig, cible) => `Dans une conversation aujourd'hui, laisse un silence au lieu de combler. Que fait « ${sig} » de ce vide, pour ${cible} ?`,
    (sig, cible) => `Repère un « oui » que tu allais dire par habitude. « ${sig} » le dirait-elle ? Choisis, pour ${cible}.`,
    (sig, cible) => `Exprime un désaccord sans te justifier, avec l'assise de « ${sig} ». Qu'est-ce que ça change pour ${cible} ?`,
    (sig, cible) => `Montre une facette de toi que tu caches d'habitude à tes proches, dans l'esprit de « ${sig} », pour ${cible}.`,
  ],
};

function consigne(perimetre: Perimetre, arch: Archetype, direction: string, jour: number): string {
  const cible = direction ? `« ${direction} »` : "ce que tu veux faire grandir";
  const cadrages = CADRAGES[perimetre];
  const i = ((jour - 1) % cadrages.length + cadrages.length) % cadrages.length;
  return cadrages[i](arch.name, cible);
}

// Les exercices du jour, un par périmètre — variés par le numéro du jour.
export function exercicesDuJour(
  arch: Archetype,
  objectifs: Objectifs | null,
  jour = 1
): ExercicePerimetre[] {
  return PERIMETRES.map(({ key, label }) => {
    const direction = directionDe(objectifs, key);
    return { perimetre: key, label, direction, consigne: consigne(key, arch, direction, jour) };
  });
}
