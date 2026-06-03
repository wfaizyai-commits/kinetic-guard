-- ══════════════════════════════════════════════════════════════
--  FitGuard — Waitlist public count (for the landing-page scarcity bar)
--  Returns ONLY the integer count — never exposes any rows.
--  Run AFTER the waitlist table exists.
-- ══════════════════════════════════════════════════════════════

create or replace function public.waitlist_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::int from public.waitlist;
$$;

-- Visitors (anon) may call the count function, but cannot read rows.
grant execute on function public.waitlist_count() to anon;
