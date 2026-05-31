-- 003_ai_usage.sql — usage log for AI form-check calls (rate limiting + analytics)
-- Rows are written by the `form-check` Edge Function using the service role,
-- so no INSERT policy is needed for end users (RLS denies by default).

create table if not exists public.ai_usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  kind        text not null default 'form_check',
  created_at  timestamptz not null default now()
);

create index if not exists ai_usage_user_time_idx
  on public.ai_usage (user_id, created_at desc);

alter table public.ai_usage enable row level security;

-- Users may read their own usage (e.g. to show "checks left today").
drop policy if exists "ai_usage_select_own" on public.ai_usage;
create policy "ai_usage_select_own"
  on public.ai_usage for select
  using (auth.uid() = user_id);
