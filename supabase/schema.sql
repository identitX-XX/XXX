-- IdentitX — Backend A (instrumentation). Schéma minimal pour des métriques
-- réelles sans migrer tout l'état : identité anonyme d'abord, reliée à l'email
-- au consentement. À exécuter dans le SQL Editor de ton projet Supabase (UE).

-- Testeuses (identité minimale pour les cohortes).
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  anon_id text unique,
  prenom text,
  cohort text,
  created_at timestamptz not null default now()
);
-- Ajout du prénom sur une base déjà créée (idempotent).
alter table profiles add column if not exists prenom text;

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

-- Paroles des testeuses — le feedback libre, dans leurs propres mots. Rattaché
-- à l'identité anonyme (jamais nominatif par défaut), horodaté.
create table if not exists feedback (
  id bigint generated always as identity primary key,
  anon_id text not null,
  message text not null,
  route text,
  created_at timestamptz not null default now()
);
create index if not exists feedback_created_idx on feedback (created_at);

-- Entonnoir d'activation (une ligne) : combien de personnes distinctes à chaque
-- étape-clé — de l'inscription au scénario généré. Le cœur du récit de traction.
create or replace view funnel as
select
  (select count(*) from profiles) as inscrites,
  (select count(distinct anon_id) from events where name = 'app_open') as ouvertures,
  (select count(distinct anon_id) from events where name = 'onboarding_complete') as onboardees,
  (select count(distinct anon_id) from events where name = 'archetype_revealed') as archetype,
  (select count(distinct anon_id) from events where name = 'objectifs_set') as cap_pose,
  (select count(distinct anon_id) from events where name = 'scenario_generated') as scenarios;

-- Engagement par page / module : visites, visiteuses uniques, temps moyen (s).
-- Le « où passent-elles du temps » — l'intérêt réel par surface.
create or replace view page_engagement as
select
  v.page,
  v.visites,
  v.visiteuses,
  coalesce(d.temps_moyen_s, 0) as temps_moyen_s
from
  (select props->>'path' as page, count(*) as visites,
          count(distinct anon_id) as visiteuses
   from events where name = 'page_view' and props ? 'path'
   group by props->>'path') v
left join
  (select props->>'path' as page,
          round(avg((props->>'seconds')::numeric), 1) as temps_moyen_s
   from events where name = 'page_time' and props ? 'seconds'
   group by props->>'path') d
  on v.page = d.page
order by v.visites desc;

-- Inscriptions cumulées par jour (courbe de croissance).
create or replace view signups_daily as
select created_at::date as jour, count(*) as nb
from profiles group by created_at::date order by jour;

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
