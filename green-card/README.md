# Green Card — CDC Habitat

> Vos éco-gestes comptent.

Application mobile (PWA) qui transforme les éco-gestes des locataires CDC Habitat en jeu :
un parcours de **10 défis**, des **GreenPoints**, une **Green Card** qui se remplit, et des cadeaux pour les meilleurs.

## État d'avancement

| Étape | Contenu | État |
|---|---|---|
| **1. Socle** | Activation et connexion, modèle de données, design system CDC, composant Green Card, RGPD | ✅ |
| 2 | Jeux 1 (Compteur Malin), 6 (Tri Master) et 9 (Boîte à Astuces) avec attribution des GreenPoints | à faire |
| 3 | Les 7 autres jeux, classements, cadeaux | à faire |
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

- **Carte déjà activée** : résidence *Les Tilleuls*, UG `TIL-A-102`, PIN `246810`.
- **Cartes à activer** : les 29 autres logements. Leurs codes d'activation sont dans `prisma/codes-demo.csv`
  (généré par le seed, non versionné). Les codes dépendent de `AUTH_SECRET` : relancez `npm run db:seed` si vous la changez.

### Tests

```bash
npm test                        # tests unitaires (règles, sécurité, n° d'UG)
npm run build && npm run e2e    # parcours complet dans Chromium + captures dans ./captures
```

## Le parcours d'entrée

1. **Accueil** : logo Green Card, « une initiative CDC Habitat ».
2. **Activation, étape 1** : recherche de la résidence (nom, ville ou code postal), n° d'UG, et code d'activation à 8 caractères
   reçu par courrier ou SMS.
3. **Activation, étape 2** : nom de la carte (pseudo affiché dans les classements), code PIN à 6 chiffres,
   CGU (obligatoire) et consentement aux relevés de consommation (facultatif).
4. **Ma carte** : animation d'activation, 20 GreenPoints de bienvenue, niveau, et les 10 cases du parcours.
5. **Reconnexion** : résidence + UG + PIN.

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
components/     Logo, EnTete, CarteVerte, formulaires, choix de résidence
lib/            règles pures (carte, ug, defis), sécurité, session, accès aux données
prisma/         schéma + seed de démo
tests/          tests unitaires (Vitest)
scripts/e2e.mjs parcours de bout en bout (Playwright)
```
