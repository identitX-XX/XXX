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
- **Couleurs** (`app/globals.css`, en canaux RGB pour permettre `bg-nuit/95`) :
  Nuit `#140D0C`, Ivoire `#F3EDE3`, Bordeaux `#5A1726`, Or champagne
  `#B7A27A`, Taupe `#A79A8D` (filets uniquement).
- **Symboles** (`components/ui/Symboles.tsx`) : Osram ne Nsoromma (la lune et
  l'étoile, adinkra), étoile à huit branches, bandes bogolan, ciel étoilé.

## Le Compagnon : ce qui reste à brancher

Les écrans (téléphone, montre, connexion, inscription) sont en place, **pas
l'authentification ni la collecte de données de santé**. Les formulaires de
compte valident la saisie puis indiquent honnêtement que l'accès ouvre
bientôt. Avant d'ouvrir :

- un fournisseur d'authentification (e-mail + mot de passe, vérification
  d'e-mail, réinitialisation, idéalement double authentification) ;
- un hébergeur certifié HDS pour les données de santé, et une analyse
  d'impact (AIPD) : données sensibles au sens de l'article 9 du RGPD ;
- les connexions Apple Santé / Health Connect (application mobile native).

## Déclinaison en application

Le contenu n'existe qu'à un endroit (MDX). Deux sorties :

1. **PWA** (`app/manifest.ts`) — installable sur l'écran d'accueil dès aujourd'hui.
2. **API de contenu versionnée** — statique, générée au build :
   - `GET /api/v1/journal` → liste + rubrique + porte
   - `GET /api/v1/journal/:slug` → article complet (MDX brut)

   Une future app native (Expo / React Native) lit cette API : même contenu,
   aucune double saisie. Les fonctions app-only (Le Cercle, messagerie,
   comptes) viendront avec un backend dédié (auth + base de données) le moment
   venu — le site média n'en dépend pas.

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
```
