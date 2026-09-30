# CéliBOSS™ — par Maï Diaw

> Choisir sa vie. Choisir ses relations. Choisir son cercle.

Média éditorial + matchmaking d'exception (pro, relationnel, sentimental). Next.js 14 (App Router), TypeScript strict,
Tailwind, MDX lu depuis `content/`. Autonome : ce dossier est un projet à part
entière dans le repo (le `tsconfig` racine l'exclut).

## Principe

**Le média attire, le Compagnon relie, Maï Diaw présente.**

| Page | Rôle |
|---|---|
| `/` | Les affinités électives : se relier aux autres, à son corps, à son intuition |
| `/compagnon` | Le Compagnon, cœur du projet : sommeil, cardio, humeur, énergie, ambition → élan |
| `/connexion`, `/inscription` | Accès au Compagnon par e-mail et mot de passe (voir plus bas) |
| `/rencontrer` | Matchmaking : seuil, méthode, trois terrains, FAQ |
| `/mai-diaw` | Portrait, trois convergences, son histoire en ses mots, son média |
| `/journal`, `/journal/[slug]` | Le média (MDX) ; chaque article mène à une porte |
| `/programmes` | Glow Up, M.C MEN, coaching + événements (`/evenements` y redirige) |
| `/appel` | La conversion : formulaire RGPD puis calendrier |
| `/manifeste` | Le manifeste de Maï Diaw, reproduit tel quel |

Les textes de Maï Diaw (manifeste, histoire, promesse) vivent chacun dans une
source unique : `components/home/Manifeste.tsx`, `lib/histoire.ts`,
`lib/positionnement.ts`. Ne pas les réécrire sans son accord.

## Design

- **Typographie** : Bodoni Moda (titres, contraste plein/délié, gras 800-900
  contre italique 400) + Hanken Grotesk (texte, capitales très espacées).
- **Esprit minimaliste** : un seul fond (ivoire), des filets fins, le blanc
  et la typographie pour la hiérarchie. La Nuit ne sert qu'aux boutons et à
  l'aperçu de l'appli ; le bordeaux n'est qu'un accent.
- **Couleurs** (`app/globals.css`, en canaux RGB pour permettre `bg-nuit/95`) :
  Nuit `#140D0C`, Ivoire `#F3EDE3`, Bordeaux `#5A1726`, Or champagne
  `#B7A27A`, Taupe `#A79A8D` (filets uniquement).
- **Symbole** : Osram ne Nsoromma (la lune et l'étoile, adinkra), en petit.
  `components/ui/Symboles.tsx` garde aussi l'étoile à huit branches, les bandes
  bogolan et le ciel étoilé, aujourd'hui inutilisés.

## Le Compagnon (v1)

Comptes e-mail + mot de passe, point du matin, élan, historique, profil.

| Route | Rôle |
|---|---|
| `/inscription`, `/connexion` | Compte (confirmation par e-mail obligatoire) |
| `/mot-de-passe-oublie` → `/nouveau-mot-de-passe` | Réinitialisation par lien |
| `/espace` | Élan du jour (constellation), lecture, 14 derniers jours |
| `/espace/point` | Point du matin : humeur, énergie, ambition, état d'esprit, sommeil, cardio |
| `/espace/profil` | Prénom, cap du mois, consentement santé, export JSON, suppression |
| `/api/v1/compagnon/points` | API des autres appareils (voir plus bas) |

- **Élan** (`lib/compagnon/elan.ts`, testé) : moyenne pondérée des signaux
  présents, ramenés sur 0–100. Pondérations à valider avec Maï Diaw.
- **Sécurité** (`supabase/migrations/0001_compagnon.sql`) : règles RLS (chacun
  ne voit que ses lignes) ; la base refuse sommeil et cardio sans consentement
  santé ; retirer ce consentement efface ces données ; suppression de compte
  en cascade.
- **Plusieurs appareils** : l'appli s'installe depuis le navigateur (iPhone :
  Partager → Sur l'écran d'accueil ; Android : Installer) et s'ouvre sur
  `/espace`. L'application mobile native, qui lira la montre (Apple Santé,
  Health Connect), enverra ses mesures à l'API :

```http
POST /api/v1/compagnon/points
Authorization: Bearer <jeton d'accès Supabase>
{ "jour": "2026-09-30", "sommeilMinutes": 432, "cardioRepos": 58, "source": "montre" }
```

  Les mesures de la montre fusionnent avec le point du matin (elles ne
  l'écrasent pas). `GET` sur la même route renvoie l'historique.

### Brancher Supabase (15 minutes)

1. supabase.com → **New project**, région **Europe (Paris ou Francfort)**.
2. **SQL Editor** → coller `supabase/migrations/0001_compagnon.sql` → **Run**.
3. **Authentication → URL Configuration** : *Site URL* = l'adresse du site ;
   ajouter `https://<site>/auth/confirmer` aux *Redirect URLs*.
4. **Authentication → Email Templates** : dans « Confirm signup » et « Reset
   password », remplacer le lien par
   `{{ .SiteURL }}/auth/confirmer?token_hash={{ .TokenHash }}&type=signup`
   (et `type=recovery` pour la réinitialisation).
5. **Project Settings → API** : copier *Project URL* et *anon public key* dans
   `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Vercel →
   Settings → Environment Variables), puis redéployer.

Sans ces deux variables, le site fonctionne et les écrans de compte annoncent
honnêtement que l'accès ouvre bientôt.

### ⚠️ Avant d'ouvrir au public

- **Hébergement des données de santé** : en France, héberger des données de
  santé pour le compte d'autrui exige un hébergeur certifié **HDS**. Supabase
  ne l'est pas : la v1 convient à une bêta privée ; pour l'ouverture, prévoir
  un hébergement HDS (ou un avis juridique) et une **analyse d'impact (AIPD)**.
- Le Compagnon est un outil de bien-être, **pas un dispositif médical** : ne
  jamais présenter l'élan comme un diagnostic.
- Double authentification et limitation des tentatives : réglages Supabase
  (Authentication → Providers / Rate limits).

## Déclinaison en application

Le contenu n'existe qu'à un endroit (MDX). Deux sorties :

1. **PWA** (`app/manifest.ts`) — installable sur l'écran d'accueil dès aujourd'hui.
2. **API de contenu versionnée** — statique, générée au build :
   - `GET /api/v1/journal` → liste + rubrique + porte
   - `GET /api/v1/journal/:slug` → article complet (MDX brut)

3. **Application mobile** (`mobile/`, Expo) — iPhone et Android. Lit la nuit
   de la montre connectée (Apple Santé / Health Connect) et l'envoie à
   `/api/v1/compagnon/points`, qui renvoie aussi l'élan calculé côté serveur.
   Voir [`mobile/README.md`](mobile/README.md).

## Publier un article

Créer `content/journal/mon-slug.mdx` :

```mdx
---
titre: "Titre"
chapo: "Une phrase d'accroche."
date: 2026-10-01
rubrique: relationnel   # relationnel | intelligence-emotionnelle | mindset | posture-image
couverture: /images/ma-photo.jpg   # optionnel
brouillon: true                    # optionnel — visible en dev seulement
---
```

Un frontmatter incomplet ou une rubrique inconnue fait **échouer le build**
(volontaire : rien de cassé ne part en ligne).

## Avant la mise en ligne

- [ ] `lib/links.ts` : Cal.com, Instagram, e-mail
- [ ] `FORMULAIRES_WEBHOOK_URL` sur Vercel (réception des demandes et inscriptions)
- [ ] `app/mai-diaw/page.tsx` : parcours détaillé et presse (rien n'est inventé)
- [ ] `[À compléter]` des pages légales (raison sociale, SIREN, adresse, e-mail RGPD)
- [ ] Registre des traitements (obligation interne RGPD)
- [ ] Photos dans `public/images/` (+ `HeroImage` sur l'accueil / Maï Diaw)
- [ ] `NEXT_PUBLIC_SITE_URL` sur Vercel (sinon `https://celiboss.fr`)

## Déployer (Vercel)

1. Sur vercel.com : **Add New → Project**, importer le dépôt GitHub `celiboss`.
2. Framework détecté : Next.js. Rien d'autre à régler.
3. Variables d'environnement (facultatives au premier déploiement) :
   `NEXT_PUBLIC_SITE_URL` (l'adresse du site) et `FORMULAIRES_WEBHOOK_URL`
   (réception des demandes et inscriptions ; sans elle, les formulaires
   répondent « bientôt »).
4. **Deploy**. Chaque `git push` sur `main` redéploie ensuite le site.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm test           # calcul de l'élan et validation des points
```
