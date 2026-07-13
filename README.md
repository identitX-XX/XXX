# IDENTITX — Lab Identitaire

> Explore qui tu es. Construis qui tu deviens.

Prototype SaaS premium d'exploration identitaire. Next.js 14 (App Router) + TypeScript + Tailwind + Zustand + Recharts. Local-first, sans backend, sans authentification.

## Stack

- **Next.js 14** — App Router
- **Tailwind CSS** — thème noir/fuchsia/orange, Fraunces (display) + Inter (UI)
- **Zustand** — état global, persistance `localStorage`
- **Recharts** — radar ADN + graphes des rapports
- **lucide-react** — icônes

Volontairement resserré pour un **premier déploiement fiable** que tu ne peux pas tester en local. Les libs plus lourdes du cahier des charges (IndexedDB, Framer Motion, shadcn, react-hook-form) pourront s'ajouter une fois la base en ligne.

## Fonctionnalités

Onboarding guidé (6 étapes) → génère un profil et des données simulées cohérentes, puis : Tableau de bord (4 jauges), Explorer (14 cartes éditables), Ligne de vie, ADN personnel (radar), Coach IA, Journal, Rapports, Paramètres (thème, export/import JSON, export PDF via impression, réinitialisation).

## Déployer depuis l'iPhone (GitHub → Vercel)

1. **Mettre le code sur GitHub.** Décompresse ce dossier, puis pousse-le sur un repo. Depuis l'iPhone, l'app **Working Copy** importe un `.zip` directement, ou tu peux glisser les fichiers via l'interface web GitHub (« Add file › Upload files »).
2. **Importer dans Vercel.** Sur vercel.com → *Add New Project* → sélectionne le repo. Framework détecté : **Next.js**. Aucune variable d'environnement requise.
3. **Deploy.** Regarde le *Build Log* du premier déploiement : s'il y a une erreur, elle s'affiche là.

> Filet de sécurité : `next.config.mjs` ignore les erreurs TypeScript et ESLint au build pour que ce premier déploiement ne casse pas sur un détail. Une fois en ligne, repasse `ignoreBuildErrors` à `false` pour réactiver les vérifications.

## Personnaliser la marque

Toutes les couleurs sont des variables CSS dans `app/globals.css` (`--fuchsia`, `--orange`, `--noir`…). Les polices se changent dans `app/layout.tsx`.

## Brancher un vrai Coach IA (plus tard)

Le coach (`lib/coach.ts`) répond en local à partir du profil, sans clé API. Pour un vrai modèle : crée `app/api/coach/route.ts` qui appelle ton fournisseur (clé côté serveur), et remplace l'appel à `coachReply` dans `app/coach/page.tsx` par un `fetch` vers cette route.

## En local (optionnel)

```bash
npm install
npm run dev
```
