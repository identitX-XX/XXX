// La Turbine — contrat de données (voir turbine-spec.md).
// Ces types matchent 1:1 le JSON produit par le modèle, pour éviter
// toute couche de mapping entre l'API et l'écran.

export interface TurbineDirection {
  nom: string;
  energie: "haute" | "moyenne" | "basse";
  etat: "actif" | "émergent" | "en veille";
}

export interface TurbineInput {
  archetype: {
    actuel: string;
    precedent: string;
    bascule: string;
  };
  valeurs: string[];
  forces: string[];
  directions: TurbineDirection[];
  tensions: string[];
  signalRecent: string[];
  // Scénarios déjà proposés — pour interdire la répétition.
  scenariosPrecedents: string[];
}

export interface TurbineScenario {
  titre: string;
  multiples_en_dialogue: string[];
  mouvement: string;
  pourquoi_maintenant: string;
  premier_pas: string;
  risque_ou_lest: string;
}

export interface TurbineOutput {
  scenarios: TurbineScenario[];
  note_de_bascule?: string;
  // Renseigné uniquement quand scenarios est vide (signal insuffisant).
  raison?: string;
  // Vrai quand la réponse vient du mode maquette (aucune clé branchée).
  _mock?: boolean;
}
