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
  ],
  pro: [
    (sig, cible) => `Dans ${anglePerimetre("pro")}, comment « ${sig} » changerait ta prochaine action concrète ? Fais ce pas, pour faire avancer ${cible}.`,
    (sig, cible) => `Identifie une tâche que tu repousses. Abordée avec « ${sig} », par quoi commencerais-tu, au service de ${cible} ?`,
    (sig, cible) => `Dans un échange pro aujourd'hui, ose une prise de parole teintée de « ${sig} ». Que fait-elle bouger pour ${cible} ?`,
    (sig, cible) => `Repère une contrainte de ton travail. Vue par « ${sig} », quelle marge de jeu te reste-t-il pour ${cible} ?`,
    (sig, cible) => `Avant ce soir, termine UNE chose, à la manière de « ${sig} ». En quoi rapproche-t-elle ${cible} ?`,
    (sig, cible) => `Quelle décision pro évites-tu ? Nomme le premier micro-pas que « ${sig} » oserait, pour ${cible}.`,
    (sig, cible) => `Observe ta façon de travailler aujourd'hui. Où « ${sig} » voudrait-elle plus de place, au service de ${cible} ?`,
  ],
  relationnel: [
    (sig, cible) => `Avec ${anglePerimetre("relationnel")}, ose aujourd'hui une interaction teintée de « ${sig} » — au service de ${cible}.`,
    (sig, cible) => `Dis à quelqu'un une chose vraie que tu tais d'habitude, dans l'esprit de « ${sig} ». Qu'est-ce que ça ouvre pour ${cible} ?`,
    (sig, cible) => `Écoute un proche sans préparer ta réponse, à la manière de « ${sig} ». Que remarques-tu pour ${cible} ?`,
    (sig, cible) => `Pose une petite limite, avec la douceur de « ${sig} ». En quoi protège-t-elle ${cible} ?`,
    (sig, cible) => `Offre une attention gratuite à quelqu'un, teintée de « ${sig} ». Qu'est-ce que ça change pour ${cible} ?`,
    (sig, cible) => `Repère une relation qui te coûte. Traversée par « ${sig} », quel ajustement tenterais-tu, pour ${cible} ?`,
    (sig, cible) => `Demande de l'aide, ou dis merci vraiment, dans l'esprit de « ${sig} ». Que fait ce geste pour ${cible} ?`,
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
