-- ============================================================================
-- ToxicitX — Schéma Supabase (PostgreSQL)
-- Principe : AUCUNE donnée identifiante. Pas de nom, email, IP, user_id.
-- Les résultats agrégés ne sont exposés qu'au-dessus de seuils d'anonymat.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Réponses individuelles anonymes
-- ---------------------------------------------------------------------------
create table if not exists public.responses (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  -- ID de session anonyme généré côté client, NON lié à une personne.
  session_id   text not null,

  -- Codes opaques facultatifs pour la version entreprise (non identifiants).
  -- Permettent l'agrégation par organisation / équipe sans jamais nommer qui que ce soit.
  org_code     text,
  team_code    text,

  -- Contexte d'onboarding (non identifiant) : genre, secteur, taille, poste, ancienneté, encadrement.
  context      jsonb not null default '{}'::jsonb,

  -- Réponses brutes : { "a1": 3, "d2": 0, ... }
  answers      jsonb not null default '{}'::jsonb,

  -- Résultats calculés
  score_global      numeric not null,
  level_global      int not null check (level_global between 1 and 6),
  score_ascendante  numeric not null,
  score_descendante numeric not null,
  score_laterale    numeric not null,
  level_ascendante  int not null check (level_ascendante between 1 and 6),
  level_descendante int not null check (level_descendante between 1 and 6),
  level_laterale    int not null check (level_laterale between 1 and 6),

  -- Profils dominants (ids), ordonnés du plus fort au plus faible.
  profiles     text[] not null default '{}'
);

create index if not exists responses_org_idx  on public.responses (org_code);
create index if not exists responses_team_idx on public.responses (org_code, team_code);
create index if not exists responses_created_idx on public.responses (created_at);

-- ---------------------------------------------------------------------------
-- Sécurité : le rôle anonyme peut INSÉRER, jamais LIRE les lignes brutes.
-- L'accès aux résultats se fait uniquement via les fonctions agrégées ci-dessous.
-- ---------------------------------------------------------------------------
alter table public.responses enable row level security;

drop policy if exists "anon can insert responses" on public.responses;
create policy "anon can insert responses"
  on public.responses for insert
  to anon
  with check (true);

-- (Aucune policy SELECT pour anon : les lignes brutes restent inaccessibles.)

-- ---------------------------------------------------------------------------
-- Seuils d'anonymat
--   * MIN_ANY  = 5  : aucun agrégat en dessous de 5 réponses.
--   * MIN_TEAM = 10 : restitution par équipe à partir de 10 réponses.
-- ---------------------------------------------------------------------------

-- Agrégat par organisation (seuil de 5).
create or replace function public.org_aggregate(p_org_code text)
returns table (
  n                  bigint,
  avg_global         numeric,
  avg_ascendante     numeric,
  avg_descendante    numeric,
  avg_laterale       numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)                              as n,
    round(avg(score_global), 1)           as avg_global,
    round(avg(score_ascendante), 1)       as avg_ascendante,
    round(avg(score_descendante), 1)      as avg_descendante,
    round(avg(score_laterale), 1)         as avg_laterale
  from public.responses
  where org_code = p_org_code
  having count(*) >= 5;  -- MIN_ANY : rien n'est renvoyé sous 5 réponses.
$$;

-- Agrégat par équipe (seuil renforcé de 10).
create or replace function public.team_aggregate(p_org_code text, p_team_code text)
returns table (
  n                  bigint,
  avg_global         numeric,
  avg_ascendante     numeric,
  avg_descendante    numeric,
  avg_laterale       numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(*)                              as n,
    round(avg(score_global), 1)           as avg_global,
    round(avg(score_ascendante), 1)       as avg_ascendante,
    round(avg(score_descendante), 1)      as avg_descendante,
    round(avg(score_laterale), 1)         as avg_laterale
  from public.responses
  where org_code = p_org_code and team_code = p_team_code
  having count(*) >= 10;  -- MIN_TEAM : rien n'est renvoyé sous 10 réponses.
$$;

grant execute on function public.org_aggregate(text)  to anon;
grant execute on function public.team_aggregate(text, text) to anon;
