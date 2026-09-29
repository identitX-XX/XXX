# CéliBOSS™ — par Maï Diaw

> Choisir sa vie. Choisir ses relations. Choisir son cercle.

Média éditorial + matchmaking d'exception (pro, relationnel, sentimental). Next.js 14 (App Router), TypeScript strict,
Tailwind, MDX lu depuis `content/`. Autonome : ce dossier est un projet à part
entière dans le repo (le `tsconfig` racine l'exclut).

## Principe

**Le média attire, les portes convertissent, un seul bouton.**

- Le **Journal** (`content/journal/*.mdx`) est gratuit. Chaque article appartient
  à une **rubrique**, et chaque rubrique mène à une **porte** (`lib/rubriques.ts`).
- 4 portes : Rencontrer et Journal (actives), Programmes (Glow Up, M.C MEN,
  coaching) et Événements (bientôt).
  Une porte « bientôt » renvoie vers l'appel en attendant.
- Une seule conversion : `<CTA />` → `/appel` : court formulaire RGPD, puis
  calendrier Cal.com. Libellé verrouillé dans `components/ui/CTA.tsx`.
- Le manifeste de Maï Diaw (`components/home/Manifeste.tsx`) est reproduit tel quel.

## Palette

| Rôle | Couleur | Usage |
|---|---|---|
| Signature | Bordeaux `#5A1726` | titres en italique, CTA, sections fortes |
| Fond | Ivoire chaud `#F3EDE3` | fond principal |
| Sophistication | Taupe minéral `#A79A8D` | filets, numéros, décors — jamais du texte courant (contraste trop faible) |
| Texte | Espresso `#291D1B` | texte, pied de page |
| Détail | Champagne mat `#B7A27A` | < 10 %, uniquement sur fonds sombres |

## Données personnelles (RGPD)

- **Minimisation** : prénom, e-mail, (téléphone, ville), terrain, message. Aucune
  donnée sensible (art. 9) collectée en ligne.
- **Consentement** explicite, case non pré-cochée ; newsletter en case séparée
  et facultative. Chaque envoi porte l'horodatage et la version de la notice
  (`VERSION_NOTICE` dans `lib/candidature.ts`) = preuve du consentement.
- **Pas de stockage sur le site** : `/api/candidature` transmet à
  `CANDIDATURE_WEBHOOK_URL` (variable Vercel : CRM, Brevo, Make, Airtable…
  hébergé dans l'UE de préférence). Sans elle, le formulaire répond « bientôt ».
- **Aucun cookie** de mesure ni de pub → pas de bandeau. Cal.com ne se charge
  qu'au clic, avec information préalable.
- Pages `/confidentialite` et `/mentions-legales` : compléter les `[À compléter]`.

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
- [ ] `CANDIDATURE_WEBHOOK_URL` sur Vercel (réception des demandes)
- [ ] `app/mai-diaw/page.tsx` : parcours détaillé et presse (rien n'est inventé)
- [ ] `[À compléter]` des pages légales (raison sociale, SIREN, adresse, e-mail RGPD)
- [ ] Registre des traitements (obligation interne RGPD)
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
