# Backend A — mise en route (≈ 10 min)

Instrumentation minimale pour tester avec de **vraies métriques**, sans migrer
tout l'état. Identité anonyme d'abord (rétention J1/J7), reliée à l'email au
consentement. Tant que ce n'est pas provisionné, l'app fonctionne à l'identique
(les événements sont simplement ignorés).

## 1. Créer le projet Supabase (région UE — RGPD)

1. [supabase.com](https://supabase.com) → **New project**.
2. **Region : EU** (Frankfurt ou Paris). Important : données intimes = UE.
3. Ouvrir **SQL Editor** → coller le contenu de [`supabase/schema.sql`](supabase/schema.sql) → **Run**.

## 2. Récupérer les clés

Dans **Project Settings → API** :
- `Project URL` → `SUPABASE_URL`
- `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` *(secret — jamais côté navigateur)*

## 3. Poser les variables sur Vercel

**Project → Settings → Environment Variables** (Production + Preview) :

| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | l'URL du projet |
| `SUPABASE_SERVICE_ROLE_KEY` | la clé service_role |
| `SUPABASE_ANON_KEY` | la clé `anon` (publique) — *optionnelle : active l'envoi du lien magique à l'entrée par email* |
| `MISTRAL_API_KEY` | ta clé Mistral (pour la génération réelle des scénarios) |
| `NEXT_PUBLIC_CAL_LINK` | *optionnelle* : ton lien Cal.com (ex. `https://cal.com/marina/20min`) — active le bouton « Prendre un moment avec Marina » dans les Réglages |

Redéployer. C'est tout — les événements commencent à s'écrire.

> Pour l'entrée par **email + lien magique** : dans Supabase → **Authentication →
> Providers → Email**, activer « Email » et les *Magic Links*. Sans
> `SUPABASE_ANON_KEY`, l'entrée par email fonctionne quand même (l'email est
> enregistré et l'accès accordé), simplement sans envoi de lien.

## 4. Lire les métriques

Dans Supabase → **SQL Editor** :

```sql
-- Rétention par cohorte hebdo (J1 / J7 / J30)
select * from retention_days;

-- Activation : combien ont généré un scénario
select count(distinct anon_id) from events where name = 'scenario_generated';

-- Usage brut
select name, count(*) from events group by name order by 2 desc;
```

## Ce qui est déjà branché

- **Consentement RGPD** (`ConsentGate`) : aucune mesure sans accord explicite.
- **Événements** : `app_open` (rétention), `scenario_generated` (activation).
- **Endpoint** `/api/events` : écrit dans Supabase, no-op gracieux sans clés.
- **Feedback libre** (`/api/feedback`, table `feedback`) : « Ton mot à Marina ».
- **Entrée par email + lien magique** (`/api/access`, table `profiles`) : relie
  `anon_id` → email, envoie un lien magique si `SUPABASE_ANON_KEY` est posée.
- **Export / suppression RGPD** : Export JSON + `/api/rgpd` (efface events,
  feedback, consents, profiles pour l'`anon_id`) + page `/confidentialite`.

## Ce qui vient ensuite

- **Tableau de bord de cohorte** intégré à l'app (au lieu du SQL Editor).
- **Génération Mistral réelle** activée par `MISTRAL_API_KEY`.
- **Point d'étape Cal.com** : poser `NEXT_PUBLIC_CAL_LINK` pour activer le bouton.
