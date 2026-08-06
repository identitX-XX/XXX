# Portfolio — vos photos et réalisations

Déposez ici vos images (JPG, PNG, WebP), puis référencez-les dans
`data/constellation.ts` via le champ `image`, par exemple :

    {
      id: "ma-serie",
      titre: "Ma série",
      categorie: "Photographie",
      annee: "2026",
      description: "…",
      image: "/portfolio/ma-serie.jpg",
    }

Une réalisation sans `image` (ou dont le fichier est absent) s'affiche
automatiquement avec une vignette « constellation » de repli.

Conseils : format ~4/3, largeur 1200–1600 px, poids < 400 Ko par image.
