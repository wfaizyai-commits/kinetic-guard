# FitGuard — Claude Code Context

## What This App Is
FitGuard (formerly KineticGuard) is a **bilingual Arabic/English iOS fitness safety app** built with React 19 + Vite + Capacitor 8. It runs as a native iPhone app. Users acknowledge a medical safety disclaimer, complete a Safety Audit assessment, get assigned a fitness tier (Novice / Intermediate / Advanced), then follow a personalized workout program with AI form checking via camera.

## Tech Stack
- **Frontend**: React 19 + Vite (JSX), CSS custom properties (no Tailwind)
- **Native**: Capacitor 8 → iOS (Xcode), Android
- **Backend**: Supabase (PostgreSQL + Auth + RLS) + Supabase Edge Functions (Deno)
- **AI**: Claude (claude-haiku-4-5) vision — called via a **server-side Edge Function**, never directly from the app
- **Language**: Bilingual Arabic 🇸🇦 / English 🇬🇧 with RTL support
- **Build**: `npm run build && npx cap sync ios` → Xcode → iPhone

## 🔐 Security model (IMPORTANT — read before touching AI code)
- The Anthropic API key is **NEVER** in the client. Any `VITE_*` var is inlined
  into the JS bundle and is extractable from a shipped app → unbounded bill.
- `src/lib/formCheckAI.js` calls the **`form-check` Supabase Edge Function**
  (`supabase/functions/form-check/index.ts`). That function holds the key,
  authenticates the user via their Supabase JWT, rate-limits per user
  (table `ai_usage`, 40 calls / 24h), and forwards the image to Claude.
- The image is downscaled on-device (≤768px JPEG) before upload.
- **The Supabase *anon* key is fine to be public** (protected by RLS). Only the
  Anthropic key must stay server-side.

### Deploy the function
```bash
supabase functions deploy form-check
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
# SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically.
# Apply the new migration too:
supabase db push   # (or run supabase/migrations/003_ai_usage.sql)
```

## Project Structure
```
kinetic-guard/
├── src/
│   ├── App.jsx                  # Main router (screen state machine) + medical-disclaimer gate
│   ├── App.css                  # Global design tokens (--orange, --surface, etc.)
│   ├── lib/
│   │   ├── supabase.js          # Supabase client + auth helpers
│   │   ├── scoring.js           # ⭐ Single source of truth for tier/score logic
│   │   ├── formCheckAI.js       # Calls the form-check Edge Function (no API key client-side)
│   │   ├── prayerTimes.js       # Aladhan API + geolocation
│   │   ├── injuryMods.js        # Risk-flag → safe exercise substitutions
│   │   └── ...                  # gamification, notifications, sync, etc.
│   ├── components/
│   │   ├── MedicalDisclaimer.jsx # ⭐ One-time safety/liability gate
│   │   └── ...
│   └── screens/
│       ├── AssessmentScreen.jsx  # 6-question Safety Audit
│       ├── FormCheckAI.jsx       # Camera form analysis + one-time data-use consent
│       └── ...
├── supabase/
│   ├── functions/
│   │   ├── _shared/cors.ts
│   │   └── form-check/index.ts   # ⭐ AI proxy (holds Anthropic key)
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_ai_usage.sql       # ⭐ usage log for rate limiting
├── ios/App/                       # Capacitor iOS project
├── capacitor.config.ts
└── CLAUDE.md                      # ← this file
```

## Supabase Config
- **Project URL**: `https://pxhdptebzbudswrkgapf.supabase.co`
- **Project ref**: `pxhdptebzbudswrkgapf`
- **Region**: AWS ap-south-1 (Mumbai)
- **Email confirmation**: DISABLED (users sign up → immediately active) — revisit before public launch (abuse vector).
- **Tables**: `profiles`, `assessment_results`, `workout_sessions`, `ai_usage`
- **Trigger**: `handle_new_user()` auto-creates profile row on signup

## Design System
All colors/spacing are CSS custom properties in `src/App.css`:
```css
--orange: #FF6B00       /* primary accent */
--surface: #0A0A0A      /* app background */
--surface-elevated: #141414
--text-primary: #FFFFFF
--text-secondary: #A0A0A0
--border: rgba(255,255,255,0.08)
--radius-md: 12px  --radius-xl: 20px
```
**Rule**: Never use hardcoded colors. Always use CSS variables.

## Bundle ID (RESOLVED)
- Unified to **`com.wfaizy.fitguard`** across `capacitor.config.ts`, the iOS
  Xcode project (`PRODUCT_BUNDLE_IDENTIFIER`), and the Android `applicationId`.
- ⚠️ After this change, **re-select your Signing Team** in Xcode (Targets →
  App → Signing & Capabilities) so provisioning matches the new ID.
- The Android Java package dir stays `com.kineticguard.app` (that's fine —
  `applicationId` may differ from the package).

## iOS Build Commands
```bash
npm run build && npx cap sync ios     # or ./build_and_sync.command
# Then in Xcode: select Waleed_iPhone → ▶ Run
```

## Current State
### ✅ Complete
- Auth (Supabase), Safety Audit → tier, Results, Daily readiness, Dashboard
- Exercise detail + SVG animations, AI form check, post-workout summary
- Prayer times, gender tracks + cycle tracker, gym tracker, gamification, notifications
- Arabic/English bilingual + RTL
- **Medical disclaimer gate + camera/data-use consent**
- **AI form check moved server-side (Edge Function) — no key in client**
- **Single scoring source of truth (`src/lib/scoring.js`)**
- **Bundle IDs unified**

### 🏋️ Gym Training (added)
- **5-day Bro Split** in `src/lib/workoutSplits.js` (Chest&Tri, Back&Bi, Legs, Shoulders, Arms&Abs) → `src/screens/SplitScreen.jsx`, opened via the "Training Split" card on the dashboard.
- **Data-driven muscle maps** (`src/lib/muscles.js` + `src/components/MuscleMap.jsx`): each exercise declares target muscles; a body diagram glows EXACTLY those in brand orange. Anatomical correctness is guaranteed by data, never by an AI image. Auto-themes to violet in women's theme.
- **Exercise images**: `src/components/ExerciseImage.jsx` shows `/public/exercises/<id>.(webp|png|jpg)` if present, else falls back to the correct MuscleMap. Art kit + 25 ready prompts in `public/exercises/PROMPTS.md`. Optimize drops with `optimize-exercise-images.command`.
- **Walking counts**: `recordActiveDay` / `syncStepActivity` in `src/lib/gamification.js` — "Log a walk" button + auto step-goal (6000) feed the streak.

### 🔴 Pending
- **Deploy** `form-check` function + `supabase secrets set ANTHROPIC_API_KEY` + apply `003_ai_usage.sql`. (Until deployed, form check returns an error.)
- Remove now-unused `VITE_ANTHROPIC_API_KEY` from `.env.local` (no longer read by the app).
- Re-select iOS signing team for the new bundle ID.
- Optional next milestones: MediaPipe on-device pose (real-time, free), progress history charts, paywall scaffolding.
- `src/services/assessment.js` is legacy (different input shape) — verify unused, then delete.

## How to Run Locally
```bash
npm install
# .env.local needs ONLY:
#   VITE_SUPABASE_URL=https://pxhdptebzbudswrkgapf.supabase.co
#   VITE_SUPABASE_ANON_KEY=sb_publishable_...
# (No Anthropic key here anymore — it lives in the Edge Function secret.)
npm run dev   # → http://localhost:5173
```

## Key Patterns
- All screens receive props for navigation, no router library; `SCREENS` enum in `App.jsx`.
- Supabase writes are non-blocking: `.catch(() => {})`.
- `loadAudit()` / `saveAudit()` persist tier result to localStorage.
- RTL: `lang`/`isRTL` from `useLanguage()`.
- Gates stored in localStorage: `fitguard_medical_v1` (disclaimer), `fitguard_cam_consent_v1` (camera).
