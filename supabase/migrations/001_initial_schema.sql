-- ══════════════════════════════════════════════════════════════
--  FitGuard — Initial Schema
--  Run this first in: supabase.com/dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── profiles ─────────────────────────────────────────────────
-- One row per auth.users entry; created automatically on sign-up
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  display_name    text,
  avatar_url      text,

  -- Assessment result
  tier            text check (tier in ('novice','intermediate','advanced')),
  safety_score    integer check (safety_score between 0 and 100),
  risk_flags      text[] default '{}',

  -- Preferences
  language        text default 'en' check (language in ('en','ar')),
  goal            text,
  time_commitment text,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── assessment_results ────────────────────────────────────────
-- History of every assessment a user takes
create table if not exists public.assessment_results (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,

  answers       jsonb not null,          -- raw answers object
  tier          text not null,
  safety_score  integer not null,
  risk_flags    text[] default '{}',

  created_at    timestamptz default now()
);

-- ── workout_sessions ─────────────────────────────────────────
-- One row per completed workout
create table if not exists public.workout_sessions (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.profiles(id) on delete cascade,

  tier              text not null,
  exercises         jsonb default '[]',   -- array of { name, sets, reps, completed }
  readiness_score   integer,
  duration_minutes  integer,
  notes             text,

  completed_at      timestamptz default now()
);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists idx_assessment_results_user
  on public.assessment_results(user_id, created_at desc);

create index if not exists idx_workout_sessions_user
  on public.workout_sessions(user_id, completed_at desc);

-- ── Auto-create profile on sign-up ───────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Drop + recreate trigger so re-running the script is idempotent
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Auto-update updated_at on profiles ───────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
