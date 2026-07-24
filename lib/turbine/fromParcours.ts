import { SnapshotJour } from "@/parcours-archetypes/types";
import { detecterChapitres, derniereBascule } from "@/parcours-archetypes/bascules";
import { archetypeByKey } from "@/parcours-archetypes/archetypes";

// Le DÉCLENCHEUR réel de la Turbine : détecte la dernière bascule d'archétype
// dominant depuis l'historique du parcours. S'appuie sur le moteur existant
// (detecterChapitres + derniereBascule), avec son anti-flicker : un dominant
// nouveau ne bascule que s'il TIENT — c'est la condition « méritée ».
// Renvoie null tant qu'il n'y a pas encore de vraie bascule.

export interface BasculeTurbine {
  actuel: string;
  precedent: string;
  bascule: string;
}

export function basculeDepuisHistorique(
  historique: SnapshotJour[]
): BasculeTurbine | null {
  const b = derniereBascule(detecterChapitres(historique));
  if (!b) return null;
  const vers = archetypeByKey[b.vers]?.name ?? b.vers;
  const depuis = archetypeByKey[b.depuis]?.name ?? b.depuis;
  return {
    actuel: vers,
    precedent: depuis,
    bascule: `Au jour ${b.jour}, ${vers} est passé devant ${depuis} — et il a tenu.`,
  };
}
