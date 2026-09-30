# CéliBOSS · Le Compagnon — application mobile

iPhone et Android (Expo / React Native). Elle lit la nuit de la montre connectée
et l'envoie au Compagnon ; l'élan est calculé par le serveur, avec la même
formule que le site.

```
Montre ──▶ Apple Santé (iOS) / Health Connect (Android) ──▶ appli ──▶ /api/v1/compagnon/points ──▶ Supabase
```

| Montre | Passe par |
| --- | --- |
| Apple Watch | Apple Santé |
| Pixel Watch, Galaxy Watch (Samsung Health), Wear OS | Health Connect |
| Garmin, Withings, Oura, Fitbit, Polar… | l'appli du fabricant, qui écrit dans Apple Santé / Health Connect |

Lecture seule : sommeil (phases endormies uniquement, chevauchements fusionnés)
et fréquence cardiaque au repos (< 48 h). Rien n'est lu sans le consentement santé
donné dans le profil (RGPD art. 9), puis l'autorisation système du téléphone.
Le serveur fusionne : la montre n'écrase jamais l'humeur saisie le matin.

## Code

- `src/app/` — écrans (Expo Router) : aiguillage, connexion, aujourd'hui.
- `src/sante/` — `index.ios.ts` (HealthKit), `index.android.ts` (Health Connect),
  `index.ts` (web : rien), `fusion.ts` (calculs purs, testés).
- `src/lib/` — Supabase (session dans le trousseau / Keystore), client d'API, synchronisation.

```
npm install
npm run typecheck && npm test
```

## Lancer sur un téléphone

Les données de santé exigent du code natif : **Expo Go ne suffit pas**, il faut
un build de développement.

1. Copier `.env.example` en `.env` (URL du site, URL et clé *anon* Supabase).
2. `npx eas-cli login` puis `npx eas-cli build --profile development --platform ios` (ou `android`).
3. Installer le build, puis `npx expo start --dev-client`.

Prérequis : compte Apple Developer (99 €/an, capacité HealthKit activée sur
l'identifiant `com.celiboss.compagnon`) et compte Google Play Console (25 $).
Pour Health Connect en production, Google demande de remplir la déclaration
d'accès aux données de santé et une politique de confidentialité publique
(`/confidentialite` sur le site).
