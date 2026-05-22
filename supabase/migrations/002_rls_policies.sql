-- ══════════════════════════════════════════════════════════════
--  FitGuard — Row Level Security Policies
--  Run AFTER 001_initial_schema.sql
-- ══════════════════════════════════════════════════════════════

-- ── Enable RLS on all tables ─────────────────────────────────
alter table public.profiles          enable row level security;
alter table public.assessment_results enable row level security;
alter table public.workout_sessions  enable row level security;

-- ════════════════════════════════════════════════════════════
--  profiles
-- ════════════════════════════════════════════════════════════

-- Users can read their own profile
drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile (backup — trigger already does this)
drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No delete allowed from client
-- (cascade from auth.users handles cleanup)

-- ════════════════════════════════════════════════════════════
--  assessment_results
-- ════════════════════════════════════════════════════════════

drop policy if exists "assessments: select own" on public.assessment_results;
create policy "assessments: select own"
  on public.assessment_results for select
  using (auth.uid() = user_id);

drop policy if exists "assessments: insert own" on public.assessment_results;
create policy "assessments: insert own"
  on public.assessment_results for insert
  with check (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
--  workout_sessions
-- ════════════════════════════════════════════════════════════

drop policy if exists "sessions: select own" on public.workout_sessions;
create policy "sessions: select own"
  on public.workout_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "sessions: insert own" on public.workout_sessions;
create policy "sessions: insert own"
  on public.workout_sessions for insert
  with check (auth.uid() = user_id);

-- Allow update (e.g. adding notes post-workout)
drop policy if exists "sessions: update own" on public.workout_sessions;
create policy "sessions: update own"
  on public.workout_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
