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
  "boite-a-astuces": [
    "Partager une astuce avec vos voisins",
    "Voter pour 5 astuces de vos voisins",
    "Recevoir 5 votes sur une de vos astuces",
  ],
};
