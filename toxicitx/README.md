# ToxicitX

> En 5–7 minutes, sachez si votre organisation est juste stressée ou carrément toxique — et repartez avec un plan d'action concret (et drôle).

Appli web de **diagnostic de toxicité organisationnelle** via un quiz gamifié. Sérieux sur le fond (psycho du travail, gouvernance, RPS), léger sur la forme (métaphores, « monstres de bureau »).

> ⚠️ **App autonome**, volontairement isolée dans ce sous-dossier. Elle ne partage **aucun code** avec l'app IDENTITX présente à la racine du dépôt.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — thème sombre « clinique » + échelle de toxicité 1→6
- **Zustand** — état du quiz, persistance `localStorage` (local-first)
- **Supabase** (PostgreSQL) — stockage **anonyme** des réponses + agrégation entreprise
- **Recharts** — restitution visuelle (à venir, brique UI)

## Les 3 axes de toxicité

| Axe | Cible |
|-----|-------|
| **Ascendante** | vers la direction / le N+1 (gouvernance, remontée d'info) |
| **Descendante** | du management vers l'équipe (feedback, contrôle, reconnaissance) |
| **Latérale** | entre collègues (clans, ragots, entraide) |

10 questions par axe (30 au total). Chaque axe et le score global donnent un **niveau de 1 à 6** (Saine → Extrême).

## Structure

```
toxicitx/
├── app/                 # Pages Next.js (landing, confidentialité, + parcours à venir)
├── components/          # Composants UI (à venir : Question, Quiz, Gauge, ResultCard…)
├── content/             # ★ Contenu 100 % éditable (le cœur du produit)
│   ├── questions.json   # 30 questions (10 × 3 axes)
│   ├── profiles.json    # profils de toxicité (« monstres »)
│   ├── remedies.json    # remèdes individuels / collectifs par profil
│   ├── onboarding.ts    # options du contexte (secteur, taille, ancienneté…)
│   └── index.ts         # loader typé
├── lib/
│   ├── scoring.ts        # score global + par axe + niveau 1–6 + profils dominants
│   ├── scoring.config.ts # ★ barème paramétrable (seuils, poids, niveaux)
│   └── scoring.test.ts   # tests (node:test + tsx)
├── store/useToxStore.ts # état quiz (Zustand + persist)
├── types/index.ts       # modèle de données
└── supabase/schema.sql  # table réponses anonymes + agrégats avec seuils 5/10
```

## Anonymat (principe non négociable)

- Aucune donnée identifiante : ni nom, ni email, ni IP.
- ID de session anonyme généré côté client.
- Aucun agrégat sous **5 réponses** ; seuil **10** pour une restitution par équipe.
- Managers / RH : accès **agrégé uniquement**, jamais individuel.

Voir `supabase/schema.sql` (RLS : le rôle anonyme peut insérer, jamais lire les lignes brutes ; agrégats via fonctions `security definer` qui appliquent les seuils).

## Développement

```bash
cd toxicitx
npm install
npm run dev      # http://localhost:3000
npm test         # tests de scoring
npm run build
```

## Déploiement Vercel

Importer le dépôt sur Vercel avec **Root Directory = `toxicitx`** (pour ne pas déployer IDENTITX à la racine). Renseigner les variables de `.env.example`.

## Personnaliser le contenu

Tout le contenu est éditable sans toucher au code :
- **Questions** → `content/questions.json`
- **Profils** → `content/profiles.json`
- **Remèdes** → `content/remedies.json`
- **Barème / niveaux** → `lib/scoring.config.ts`
