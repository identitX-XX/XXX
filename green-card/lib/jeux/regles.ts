/** Ce qu'il faut faire pour chaque médaille, affiché en haut de chaque jeu. */
export const REGLES_MEDAILLES: Record<string, [string, string, string]> = {
  "compteur-malin": [
    "Faire votre premier relevé de compteur",
    "Relever à nouveau le même compteur au moins 6 jours plus tard",
    "Baisser de 5 % votre consommation par jour par rapport au départ",
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
