-- ══════════════════════════════════════════════════════════════
--  FitGuard — Waitlist (pre-launch landing page on fitguardapp.com)
--  Captures emails from the marketing site. Public can INSERT only.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  lang        text default 'ar' check (lang in ('ar','en')),
  source      text default 'landing',   -- which page/section
  referrer    text,                     -- optional UTM / ref
  created_at  timestamptz not null default now()
);

-- One signup per email (idempotent re-submits won't error the user).
create unique index if not exists waitlist_email_unique
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Anonymous visitors may add themselves to the waitlist (INSERT only).
drop policy if exists "waitlist: public insert" on public.waitlist;
create policy "waitlist: public insert"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- No public SELECT/UPDATE/DELETE — only you (service role / dashboard) can read.
-- View signups in the Supabase Table Editor → waitlist.
