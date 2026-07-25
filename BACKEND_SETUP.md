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
| `MISTRAL_API_KEY` | ta clé Mistral (pour la génération réelle des scénarios) |

Redéployer. C'est tout — les événements commencent à s'écrire.

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

## Ce qui vient ensuite (une fois le projet provisionné)

- **Compte par lien magique** (Supabase Auth) : relier `anon_id` → email.
- **Export / suppression** des données (droits RGPD) en un clic.
- **Tableau de bord de cohorte** intégré à l'app (au lieu du SQL Editor).
- **Génération Mistral réelle** activée par `MISTRAL_API_KEY`.
