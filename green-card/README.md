# Green Card — CDC Habitat

> Vos éco-gestes comptent.

Application mobile (PWA) qui transforme les éco-gestes des locataires CDC Habitat en jeu :
un parcours de **10 défis**, des **GreenPoints**, une **Green Card** qui se remplit, et des cadeaux pour les meilleurs.

## État d'avancement

| Étape | Contenu | État |
|---|---|---|
| **1. Socle** | Activation et connexion, modèle de données, design system CDC, composant Green Card, RGPD | ✅ |
| **2. Premiers jeux** | Compteur Malin (1), Tri Master (6), Boîte à Astuces (9), moteur de médailles et de GreenPoints | ✅ |
| **2 bis. Mobilité et seconde vie** | Mes Trajets Verts (5), Seconde Vie (8) avec le mur des voisins | ✅ |
| **3. Les 10 défis** | Chasse au Gaspi (2), Douche Chrono (3), Opération 19 °C (4), Zéro Gaspi Frigo (7), Défi Immeuble (10) | ✅ |
| **3 bis. Cadeaux** | Boutique (mug, jeu de cartes, tee-shirt) et grand tirage (une semaine dans un appartement CDC Habitat) | ✅ |
| 3 ter | Classements individuels | à faire |
| 4 | Agents IA (coach, vérificateur, modérateur, animateur, analyste) | à faire |
| 5 | Back-office et tableau de bord d'impact | à faire |
| 6 | Tests, accessibilité, déploiement | en continu |

## Démarrer

```bash
cd green-card
npm install
cp .env.example .env            # puis renseigner AUTH_SECRET (openssl rand -base64 32)
npm run db:reset                # crée la base SQLite et les données de démo
npm run dev                     # http://localhost:3000
```

### Comptes de démo

- **Carte déjà activée** : résidence *Les Tilleuls*, UG `TIL-A-102`, PIN `246810` (Foyer Martin : historique de relevés,
  une astuce avec 4 votes).
- Le Foyer Martin a aussi des trajets sur 4 jours et 2 actions seconde vie. Trois annonces de voisins sont sur le mur.
- **Voisins** (même résidence, PIN `135790`) : `TIL-A-103`, `TIL-A-104`, `TIL-B-101`, `TIL-B-102`, `TIL-B-103`.
- **Cartes à activer** : les 29 autres logements. Leurs codes d'activation sont dans `prisma/codes-demo.csv`
  (généré par le seed, non versionné). Les codes dépendent de `AUTH_SECRET` : relancez `npm run db:seed` si vous la changez.

### Tests

```bash
npm test                        # tests unitaires (règles, sécurité, n° d'UG)
npm run build && npm run e2e    # parcours complet et les 3 jeux dans Chromium + captures dans ./captures
```

## Le parcours d'entrée

1. **Accueil** : logo Green Card, « une initiative CDC Habitat ».
2. **Activation, étape 1** : recherche de la résidence (nom, ville ou code postal), n° d'UG, et code d'activation à 8 caractères
   reçu par courrier ou SMS.
3. **Activation, étape 2** : nom de la carte (pseudo affiché dans les classements), code PIN à 6 chiffres,
   CGU (obligatoire) et consentement aux relevés de consommation (facultatif).
4. **Ma carte** : animation d'activation, 20 GreenPoints de bienvenue, niveau, et les 10 cases du parcours.
5. **Reconnexion** : résidence + UG + PIN.

## Les jeux et les GreenPoints

Chaque défi a 3 médailles. La carte crédite **seulement la différence** quand on monte de médaille
(`lib/points.ts`) : rejouer ne rapporte rien de plus, et on ne perd jamais une médaille.
Les défis d'ouverture, un par univers (1, 5, 6, 8, 9), sont jouables tout de suite. Les 5 autres (2, 3, 4, 7, 10)
se débloquent un par un, à chaque case tamponnée. Les 10 cases tamponnées font passer la carte **Gold**.

| Jeu | 🥉 Bronze | 🥈 Argent | 🥇 Or | Garde-fous |
|---|---|---|---|---|
| **1. Compteur Malin** | 1ᵉʳ relevé | 2ᵉ relevé ≥ 6 jours plus tard | −5 % de consommation par jour par rapport au départ | consentement requis, date fixée par le serveur, 1 relevé par jour et par compteur, index jamais en baisse, plafond de vraisemblance |
| **6. Tri Master** | 8/12 | 10/12 | 12/12 en moins de 60 s | les bonnes réponses ne quittent jamais le serveur, chrono côté serveur, 10 parties par jour |
| **5. Mes Trajets Verts** | 1ᵉʳ trajet | trajets sur 5 jours différents | trajets sur 15 jours différents | jour fixé par le serveur (aujourd'hui ou hier), distance maximale par mode, 8 trajets par jour |
| **8. Seconde Vie** | 1ʳᵉ action (occasion, réparation, don, revente) | 5 actions | un objet donné, échangé ou prêté à un voisin via le mur | 3 actions par jour ; l'échange est vérifié par les deux voisins (le receveur se dit intéressé, le donneur confirme) |
| **2. Chasse au Gaspi** | 6 gaspillages sur 10 | les 10 | les 10 en moins d'une minute, 2 erreurs maximum | solution gardée sur le serveur, chrono serveur, 10 parties par jour |
| **3. Douche Chrono** | une douche de 5 minutes ou moins | 3 jours différents | 7 jours d'affilée | durée mesurée par le serveur ; moins d'une minute ou plus d'une heure : non comptée |
| **4. Opération 19 °C** | 1ʳᵉ journée tenue | 7 journées | 21 journées | au moins 3 engagements ; une journée compte si la moitié est tenue ; aujourd'hui ou hier seulement |
| **7. Zéro Gaspi Frigo** | 1ʳᵉ action anti-gaspi | + quiz « DLC ou DDM ? » sans faute | + actions sur 7 jours | 3 actions par jour |
| **10. Défi Immeuble** | rejoindre l'équipe et faire un geste | objectif collectif (5 gestes par logement) atteint, 5 gestes perso | résidence 1ʳᵉ d'un mois complet, 5 gestes perso ce mois-là | gestes comptés depuis les autres jeux ; score par logement pour l'équité |
| **9. Boîte à Astuces** | publier une astuce | + 5 votes donnés | une astuce reçoit 5 votes | 3 astuces par jour, ni lien, ni e-mail, ni téléphone, ni insulte, pas de vote pour soi, masquage après 3 signalements |

- Les consignes de tri sont les **consignes nationales** (2023 : tous les emballages au bac jaune ; 2024 : biodéchets).
  Les consignes par commune viendront ensuite.
- Les prix et facteurs CO₂ sont **indicatifs** et à faire valider : `lib/jeux/compteur.ts`, `lib/jeux/trajets.ts`
  (comparaison avec une voiture thermique seule) et `lib/jeux/circulaire.ts` (CO₂ moyen évité par catégorie d'objet).
- Un « geste » (Défi Immeuble) = un trajet vert, un relevé, une douche réussie, une journée 19 °C tenue, une action
  seconde vie ou anti-gaspi, ou une astuce. Les quiz n'en sont pas. Voir `lib/gestes.ts`.
- Douche Chrono : douche de 12 L/min comparée à 10 minutes ; Opération 19 °C : −7 % de chauffage par degré (ADEME).
- Le mur des voisins ne montre que le pseudo et le bâtiment : pas de messagerie, ni de téléphone, ni d'e-mail.
  Les voisins se retrouvent dans la résidence.
- À l'étape 4, la lecture des compteurs par photo et la modération des astuces passeront aux agents IA.

## Les cadeaux

| Cadeau | Comment | Règle |
|---|---|---|
| ☕ Mug Green Card | 300 GreenPoints | 1 par foyer, stock limité |
| 🃏 Jeu de cartes « 52 éco-gestes » | 450 GreenPoints | 1 par foyer, stock limité |
| 👕 Tee-shirt Green Card (S à XXL) | 700 GreenPoints | 1 par foyer, stock limité |
| 🏖️ Une semaine dans un appartement CDC Habitat | grand tirage de fin de saison | cartes Gold inscrites, même chance pour tous |

- **Solde disponible** = points gagnés − points échangés. Le niveau de la carte et les médailles gardent les points gagnés :
  échanger ne fait jamais régresser.
- **Retrait** au bureau du gardien ou à l'agence avec un code (`GC-XXXXXX`) : aucune adresse postale n'est collectée.
  Annulation possible tant que la commande est « en préparation ». Les statuts « prête » et « remise » seront gérés dans le back-office.
- **Grand tirage** : `npm run tirage -- saison-2026-2027` à la date de clôture. Le script revérifie l'éligibilité,
  tire au hasard avec `crypto.randomInt` et refuse de tirer deux fois. Le pseudo du gagnant s'affiche dans l'appli.
- Le stock baisse dans une transaction, sans pouvoir passer sous zéro. Le règlement (`/cadeaux/reglement`) est **provisoire**
  et doit être validé par le juridique.

## Sécurité

- Le n° d'UG seul ne suffit pas, car il est devinable : il faut aussi le **code d'activation** à usage unique.
  Ce code est valable 60 jours, haché en base (HMAC) et bloqué après 5 essais.
- Le **PIN** est haché avec scrypt et un sel. Les PIN trop simples sont refusés, et la carte se verrouille 15 minutes après 5 erreurs.
- Les **messages d'erreur sont génériques** : ils ne révèlent pas si un UG existe.
- La **session** passe par un cookie httpOnly et SameSite. Le jeton est haché en base et la session dure 30 jours.
- L'appli **refuse de démarrer en production sans `AUTH_SECRET`**.
- **À prévoir** : une limitation de débit par adresse IP (au niveau du reverse proxy ou d'un middleware) avant la mise en ligne.

## RGPD

- Les données sont minimales : résidence, UG, pseudo, progression. Les relevés de consommation ne sont utilisés qu'avec consentement explicite.
- Depuis **Mon profil**, le locataire peut retirer son consentement, **télécharger ses données** (JSON) et **supprimer sa carte**
  (suppression en cascade).
- Le texte des CGU (`/cgu`) est **provisoire**. Il doit être validé par le service juridique et le DPO de CDC Habitat.

## Design

Les tokens sont dans `app/globals.css` et `tailwind.config.ts`.

- **Rouge CDC `#E2071B`** = l'identité : liseré de l'en-tête, bouton principal, puce de la carte.
- **Vert** = la progression : carte, succès, GreenPoints.
- Le rouge ne signifie jamais « mauvais » : les alertes utilisent l'ambre.
- Police **Poppins**, à remplacer par la police officielle si CDC Habitat en a une.
- Le mode sombre suit le réglage du téléphone. Les animations sont désactivées si l'utilisateur réduit les mouvements.
- Les cibles tactiles font au moins 44 px. Les composants ont des libellés et des rôles ARIA.
- Logos dans `public/brand/` : `cdc-habitat.png` (complet, écran d'accueil) et `cdc-habitat-seul.png` (en-tête).

## Points à confirmer avec CDC Habitat

- Le **format exact du n° d'UG**. Les UG de démo (`TIL-A-101`) sont fictifs, et la validation dans `lib/ug.ts` est volontairement souple.
- Le **canal du code d'activation** (courrier ou SMS) et la procédure en cas de PIN oublié (aujourd'hui : nouveau code via l'agence).
- La **charte graphique** : police officielle, règles d'usage du logo, et présence du bloc Caisse des Dépôts.
- La **production** : passer `provider = "postgresql"` dans `prisma/schema.prisma`.

## Structure

```
app/            pages (accueil, activer, connexion, carte, profil, cgu) + actions serveur + API d'export
components/     Logo, EnTete, CarteVerte, formulaires, choix de résidence ; components/jeux/ = jeux et célébration
lib/            règles pures (carte, ug, defis), sécurité, session, points, accès aux données
lib/jeux/       règles pures des 10 jeux, modération, textes des médailles ; lib/gestes.ts = gestes du mois
app/defis/[id]  page commune des défis + une section par jeu ; app/jeux/actions.ts = actions serveur des jeux
prisma/         schéma + seed de démo
tests/          tests unitaires (Vitest)
scripts/e2e.mjs parcours de bout en bout (Playwright)
```
