FitGuard — Landing Page (deploy bundle for fitguardapp.com)
===========================================================

PREVIEW:  double-click index.html (bilingual AR/EN — EN button top-right).

DEPLOY (Vercel, easiest):
  1. Drag this whole folder into vercel.com (New Project → drop folder), OR
     vercel CLI: run "vercel" inside this folder.
  2. Add your domain fitguardapp.com in Vercel → Settings → Domains.
  vercel.json is included (clean URLs + security headers).

BEFORE / AFTER GO-LIVE (browser, ~3 min):
  • Supabase SQL: create table waitlist + anon insert policy + waitlist_count()
    (see the SQL Waleed has). Waitlist + live counter need this.
  • Plausible: add site fitguardapp.com (analytics is already wired).
  • Optional: welcome-email Edge Function + Resend key + webhook.

NOTES:
  • The Supabase key in index.html is the PUBLIC anon key (safe, RLS-protected).
  • Stat numbers are qualitative/verifiable only; Vision 2030 target is official.
