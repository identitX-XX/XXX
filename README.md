# Celiboss — par Maï Diaw

Média éditorial + matchmaking sélectif. Next.js 14 (App Router), TypeScript strict,
Tailwind, MDX lu depuis `content/`. Autonome : ce dossier est un projet à part
entière dans le repo (le `tsconfig` racine l'exclut).

## Principe

**Le média attire, les portes convertissent, un seul bouton.**

- Le **Journal** (`content/journal/*.mdx`) est gratuit. Chaque article appartient
  à une **rubrique**, et chaque rubrique mène à une **porte** (`lib/rubriques.ts`).
- 4 portes : Rencontrer et Journal (actives), Le Cercle et L'Atelier (bientôt).
  Une porte « bientôt » renvoie vers l'appel en attendant.
- Une seule conversion : `<CTA />` → `/appel` (Cal.com). Libellé verrouillé dans
  `components/ui/CTA.tsx`.

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
rubrique: relationnel   # relationnel | mindset | posture-image | art-de-vivre
couverture: /images/ma-photo.jpg   # optionnel
brouillon: true                    # optionnel — visible en dev seulement
---
```

Un frontmatter incomplet ou une rubrique inconnue fait **échouer le build**
(volontaire : rien de cassé ne part en ligne).

## Avant la mise en ligne

- [ ] `lib/links.ts` : Cal.com, Tally, Instagram, e-mail
- [ ] `app/mai-diaw/page.tsx` : phrase d'autorité, parcours, presse (rien n'est inventé)
- [ ] Mentions légales + politique de confidentialité (obligatoires)
- [ ] Photos dans `public/images/` (+ `HeroImage` sur l'accueil / Maï Diaw)
- [ ] Icônes PWA 192/512 dans `public/` puis `app/manifest.ts`
- [ ] `NEXT_PUBLIC_SITE_URL` sur Vercel (sinon `https://celiboss.fr`)

## Déployer (Vercel)

Nouveau projet Vercel sur ce repo, **Root Directory = `celiboss`**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```
