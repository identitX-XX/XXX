import { TurbineOutput } from "./types";

// Mode maquette : ce que la Turbine renvoie tant qu'aucune clé Mistral n'est
// branchée. Ce sont les scénarios réels générés pour le profil par défaut,
// pour que l'écran vive avant le premier appel modèle.
export const MOCK_OUTPUT: TurbineOutput = {
  scenarios: [
    {
      titre: "Sors la speakeuse de la veille — c'est elle qui fabrique ta légitimité",
      multiples_en_dialogue: ["Speakeuse", "Conceptrice"],
      mouvement:
        "Tu ne trouveras pas ta légitimité dans l'abstrait, tu la prendras en portant une thèse. Parler d'IdentitX n'est pas te vendre : c'est transmettre une idée — et au passage ta distribution et ta preuve de fondatrice.",
      pourquoi_maintenant:
        "Tant que tu explorais, parler était prématuré. Depuis que tu as assumé IdentitX jusqu'au bout, la speakeuse a enfin un objet unique à porter.",
      premier_pas:
        "Dis ta thèse à voix haute, enregistre 60 secondes. Pas pour publier — pour entendre si tu la portes.",
      risque_ou_lest:
        "L'idée que la légitimité s'obtient avant de parler. Elle vient en parlant.",
    },
    {
      titre: "Laisse le venture builder entrer dans la pièce que la conceptrice garde fermée",
      multiples_en_dialogue: ["Venture builder", "Conceptrice"],
      mouvement:
        "Ton rapport à l'argent vient d'un faux conflit : tu crois que faire payer trahit la justesse. Une table, deux casquettes — pas deux vies. Le venture builder pose le modèle pendant que la conceptrice fait le produit.",
      pourquoi_maintenant:
        "« Mener jusqu'au bout » inclut l'argent, sinon c'est un mensonge poli. Le bout d'un produit, c'est qu'il se paie.",
      premier_pas:
        "Écris le prix. Une ligne — « IdentitX coûtera X €/mois » — juste pour voir ce que ça déclenche en toi.",
      risque_ou_lest:
        "« Faire payer trahit la justesse. » Un prix juste est une forme de justesse.",
    },
    {
      titre: "Ta dispersion n'est pas un défaut à corriger — c'est ta qualification",
      multiples_en_dialogue: ["Venture builder", "Conceptrice", "Speakeuse"],
      mouvement:
        "Tu construis l'outil qui fait dialoguer les multiples parce que tu es multiple. Ta dispersion est ta R&D. IdentitX, c'est l'orchestration de tes propres multiples, rendue produit.",
      pourquoi_maintenant:
        "En assumant IdentitX jusqu'au bout, tu viens — sans le nommer — de faire dialoguer tes trois directions au lieu d'en choisir une. Tu es déjà dans ta propre thèse.",
      premier_pas:
        "Écris tes trois casquettes, et en face de chacune, ce qu'elle apporte à IdentitX. Aucune n'est de trop.",
      risque_ou_lest:
        "L'idée qu'il faut « régler » ta dispersion avant d'être légitime. Elle est ta légitimité.",
    },
  ],
  note_de_bascule:
    "Ces scénarios émergent maintenant parce que tu viens de passer d'explorer à t'engager — et l'engagement, chez une multipotentielle, ne s'ampute pas, il s'orchestre.",
};
