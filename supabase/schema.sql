-- IdentitX — Backend A (instrumentation). Schéma minimal pour des métriques
-- réelles sans migrer tout l'état : identité anonyme d'abord, reliée à l'email
-- au consentement. À exécuter dans le SQL Editor de ton projet Supabase (UE).

-- Testeuses (identité minimale pour les cohortes).
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  anon_id text unique,
  cohort text,
  created_at timestamptz not null default now()
);

-- Trace RGPD du consentement (preuve horodatée, versionnée).
create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  anon_id text not null,
  granted boolean not null,
  version text not null default 'v1',
  created_at timestamptz not null default now()
);

-- Journal d'événements — le cœur des métriques (activation, rétention, usage).
create table if not exists events (
  id bigint generated always as identity primary key,
  anon_id text not null,
  name text not null,
  props jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists events_anon_idx on events (anon_id);
create index if not exists events_name_idx on events (name);
create index if not exists events_created_idx on events (created_at);

-- Rétention par cohorte hebdo : combien reviennent J1 / J7 / J30.
-- (Vue de lecture pour ton tableau de bord ; s'appuie sur l'événement app_open.)
create or replace view retention_days as
with firsts as (
  select anon_id, min(created_at)::date as d0
  from events where name = 'app_open' group by anon_id
),
opens as (
  select distinct anon_id, created_at::date as d from events where name = 'app_open'
)
select
  f.d0 as cohorte,
  count(distinct f.anon_id) as taille,
  count(distinct o.anon_id) filter (where o.d - f.d0 = 1) as j1,
  count(distinct o.anon_id) filter (where o.d - f.d0 = 7) as j7,
  count(distinct o.anon_id) filter (where o.d - f.d0 = 30) as j30
from firsts f
left join opens o on o.anon_id = f.anon_id
group by f.d0
order by f.d0;
