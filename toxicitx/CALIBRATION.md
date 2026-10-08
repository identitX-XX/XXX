# Calibrage du scoring ToxicitX

Les seuils des 6 niveaux (`LEVELS` dans `lib/scoring.config.ts`) sont posés
**a priori** : des paliers réguliers de ~17 points (0, 17, 34, 51, 67, 84).
C'est un point de départ raisonnable, mais **à recalibrer avec de vraies
réponses** : sans données, on risque de concentrer tout le monde sur un ou
deux niveaux (souvent « Tendue »).

## Pourquoi ce n'est pas fait « en dur » maintenant

Un bon calibrage dépend de la **distribution réelle** des scores, qu'on n'a
pas tant que l'app n'a pas tourné. Inventer des seuils « qui semblent bien »
donnerait une fausse impression de précision.

## Méthode (quand il y a ≥ ~200 réponses)

1. Lancer `supabase/calibration.sql` :
   - **Requête 1** : répartition actuelle par niveau. Si un niveau capte
     > 40 % des réponses, c'est le signal d'un recalibrage.
   - **Requête 2** : percentiles du score global (p16 / p33 / p50 / p66 / p83).
   - **Requête 3** : moyennes par axe.
2. Poser les `minScore` des niveaux sur ces percentiles, pour obtenir une
   répartition à peu près équilibrée (chaque niveau ~1/6 des réponses) — ou
   volontairement asymétrique si on préfère un outil « sévère » ou « clément ».
3. Reporter les valeurs dans `LEVELS` (`lib/scoring.config.ts`), puis relancer
   les tests (`npm test`).

Exemple : si `p16=22, p33=38, p50=52, p66=64, p83=79`, alors
`minScore` = 0 / 22 / 38 / 52 / 64 / 79 pour les niveaux 1→6.

## Pondération des axes

`AXIS_WEIGHTS` (même fichier) permet de donner plus de poids à un axe
(ex. management descendant). À ajuster si la requête 3 montre un déséquilibre
structurel, ou selon un choix produit assumé.

## Items « graves »

Le filet de sécurité (`graveTriggered`) est **indépendant** du calibrage :
il se déclenche sur un item grave répondu Souvent/Toujours, quel que soit le
score. Ne pas le diluer dans le score global.
