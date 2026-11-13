/** Ce qu'il faut faire pour chaque médaille, affiché en haut de chaque jeu. */
export const REGLES_MEDAILLES: Record<string, [string, string, string]> = {
  "compteur-malin": [
    "Faire votre premier relevé de compteur",
    "Relever à nouveau le même compteur au moins 6 jours plus tard",
    "Baisser de 5 % votre consommation par jour par rapport au départ",
  ],
  "chasse-au-gaspi": [
    "Trouver 6 gaspillages sur 10",
    "Trouver les 10 gaspillages",
    "Les 10 en moins d'une minute, avec 2 erreurs au plus",
  ],
  "douche-chrono": [
    "Une douche de 5 minutes ou moins",
    "Des douches de 5 minutes sur 3 jours différents",
    "7 jours d'affilée sous les 5 minutes",
  ],
  "operation-19": [
    "Tenir vos engagements chauffage une première journée",
    "7 journées tenues",
    "21 journées tenues (3 semaines)",
  ],
  "zero-gaspi-frigo": [
    "Une première action anti-gaspi",
    "Réussir le quiz « DLC ou DDM ? » sans faute",
    "Des actions anti-gaspi sur 7 jours différents",
  ],
  "defi-immeuble": [
    "Rejoindre le défi du mois et faire un éco-geste",
    "La résidence atteint l'objectif du mois, avec 5 gestes de votre part",
    "La résidence finit 1ʳᵉ d'un mois, avec 5 gestes de votre part",
  ],
  "tri-master": [
    "Trier correctement 8 déchets sur 12",
    "Trier correctement 10 déchets sur 12",
    "Un sans-faute 12 sur 12 en moins d'une minute",
  ],
  "trajets-verts": [
    "Déclarer un premier trajet à pied, à vélo, en transports ou en covoiturage",
    "Des trajets verts sur 5 jours différents",
    "Des trajets verts sur 15 jours différents",
  ],
  "seconde-vie": [
    "Une première action : achat d'occasion, réparation, don ou revente",
    "5 actions seconde vie",
    "Donner, échanger ou prêter un objet à un voisin grâce au mur",
  ],
  "boite-a-astuces": [
    "Partager une astuce avec vos voisins",
    "Voter pour 5 astuces de vos voisins",
    "Recevoir 5 votes sur une de vos astuces",
  ],
};
