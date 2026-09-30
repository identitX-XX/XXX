-- Le Compagnon — schéma de base (Supabase / Postgres).
-- À exécuter une fois dans Supabase : SQL Editor → coller → Run.
--
-- Principes :
-- 1. Chaque personne ne voit et ne modifie QUE ses propres lignes (RLS).
-- 2. Les données de santé (sommeil, cardio) ne peuvent être écrites que si
--    le consentement santé est enregistré — vérifié par la base elle-même.
-- 3. Retirer son consentement efface les données de santé déjà stockées.

-- ── Profils ────────────────────────────────────────────────────────────────
create table if not exists public.profils (
  id uuid primary key references auth.users (id) on delete cascade,
  prenom text not null check (char_length(prenom) between 1 and 60),
  cap_du_mois text check (char_length(cap_du_mois) <= 140),
  cgu_acceptees_le timestamptz not null,
  -- Consentement explicite au traitement des données de santé (RGPD art. 9).
  sante_consentie_le timestamptz,
  cree_le timestamptz not null default now()
);

alter table public.profils enable row level security;

create policy "profil : lecture de soi" on public.profils
  for select using (auth.uid() = id);
create policy "profil : création de soi" on public.profils
  for insert with check (auth.uid() = id);
create policy "profil : mise à jour de soi" on public.profils
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Le profil est créé à l'inscription, à partir des métadonnées fournies.
create or replace function public.creer_profil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profils (id, prenom, cgu_acceptees_le, sante_consentie_le)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'prenom', ''), 'Membre'),
    coalesce((new.raw_user_meta_data ->> 'cgu_acceptees_le')::timestamptz, now()),
    (new.raw_user_meta_data ->> 'sante_consentie_le')::timestamptz
  );
  return new;
end;
$$;

drop trigger if exists a_la_creation_d_un_compte on auth.users;
create trigger a_la_creation_d_un_compte
  after insert on auth.users
  for each row execute function public.creer_profil();

-- ── Points du jour ─────────────────────────────────────────────────────────
create table if not exists public.points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  jour date not null,
  humeur smallint check (humeur between 1 and 5),
  energie smallint check (energie between 1 and 5),
  ambition smallint check (ambition between 1 and 5),
  esprit text check (char_length(esprit) <= 40),
  sommeil_minutes integer check (sommeil_minutes between 0 and 1440),
  cardio_repos smallint check (cardio_repos between 25 and 220),
  -- D'où viennent sommeil et cardio : saisie à la main ou montre connectée.
  source text not null default 'manuel' check (source in ('manuel', 'montre', 'mixte')),
  modifie_le timestamptz not null default now(),
  unique (user_id, jour)
);

create index if not exists points_user_jour on public.points (user_id, jour desc);

alter table public.points enable row level security;

-- Vrai si la personne connectée a donné son consentement santé.
create or replace function public.sante_consentie()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profils where id = auth.uid() and sante_consentie_le is not null);
$$;

create policy "points : lecture de soi" on public.points
  for select using (auth.uid() = user_id);
create policy "points : suppression de soi" on public.points
  for delete using (auth.uid() = user_id);
create policy "points : création de soi" on public.points
  for insert with check (
    auth.uid() = user_id
    and ((sommeil_minutes is null and cardio_repos is null) or public.sante_consentie())
  );
create policy "points : mise à jour de soi" on public.points
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and ((sommeil_minutes is null and cardio_repos is null) or public.sante_consentie())
  );

-- Retrait du consentement santé → effacement des données de santé stockées.
create or replace function public.effacer_sante_si_retrait()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.sante_consentie_le is not null and new.sante_consentie_le is null then
    update public.points set sommeil_minutes = null, cardio_repos = null, modifie_le = now()
    where user_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists au_retrait_du_consentement on public.profils;
create trigger au_retrait_du_consentement
  after update of sante_consentie_le on public.profils
  for each row execute function public.effacer_sante_si_retrait();

-- ── Suppression de compte (droit à l'effacement) ───────────────────────────
-- Appelée par la personne elle-même ; les profils et points partent en
-- cascade avec le compte.
create or replace function public.supprimer_mon_compte()
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.supprimer_mon_compte() from public, anon;
grant execute on function public.supprimer_mon_compte() to authenticated;
