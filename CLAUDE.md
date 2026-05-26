# FitGuard — Claude Code Context

## What This App Is
FitGuard (formerly KineticGuard) is a **bilingual Arabic/English iOS fitness safety app** built with React 18 + Vite + Capacitor 5. It runs as a native iPhone app. Users complete a Safety Audit assessment, get assigned a fitness tier (Novice / Intermediate / Advanced), then follow a personalized workout program with real-time AI form checking via camera.

## Tech Stack
- **Frontend**: React 18 + Vite (JSX), CSS custom properties (no Tailwind)
- **Native**: Capacitor 5 → iOS (Xcode), Android
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Language**: Bilingual Arabic 🇸🇦 / English 🇬🇧 with RTL support
- **Build**: `npm run build && npx cap sync ios` → Xcode → iPhone

## Project Structure
```
kinetic-guard/
├── src/
│   ├── App.jsx                  # Main router (screen state machine)
│   ├── App.css                  # Global design tokens (--orange, --surface, etc.)
│   ├── lib/
│   │   └── supabase.js          # Supabase client + auth helpers
│   ├── i18n/
│   │   ├── translations.js      # All EN + AR strings
│   │   └── LanguageContext.jsx  # useLanguage() hook
│   ├── components/
│   │   ├── Button.jsx/css
│   │   ├── OptionButton.jsx/css
│   │   ├── ProgressBar.jsx/css
│   │   ├── LanguageToggle.jsx/css
│   │   └── ExerciseAnimation.jsx/css   # SVG stick figure @keyframes animations
│   └── screens/
│       ├── AuthScreen.jsx/css          # Sign In / Sign Up (Supabase auth)
│       ├── StartScreen.jsx/css
│       ├── AssessmentScreen.jsx/css    # 6-question Safety Audit
│       ├── ResultsScreen.jsx/css       # Tier + safety score
│       ├── ReadinessScreen.jsx/css     # Daily check (sleep/stress/soreness)
│       ├── WorkoutDashboard.jsx/css
│       ├── ExerciseDetail.jsx/css      # Exercise + animation + form check
│       ├── FormCheckAI.jsx/css         # Camera-based AI form analysis
│       └── PostWorkoutSummary.jsx/css
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql      # profiles, assessment_results, workout_sessions
│       └── 002_rls_policies.sql        # RLS: users own their data
├── ios/App/                            # Capacitor iOS project
├── .env.local                          # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (gitignored)
├── capacitor.config.ts
└── CLAUDE.md                           # ← this file
```

## Supabase Config
- **Project URL**: `https://pxhdptebzbudswrkgapf.supabase.co`
- **Project ref**: `pxhdptebzbudswrkgapf`
- **Region**: AWS ap-south-1 (Mumbai)
- **Anon key**: in `.env.local` as `VITE_SUPABASE_ANON_KEY`
- **Email confirmation**: DISABLED (users sign up → immediately active)
- **Tables**: `profiles`, `assessment_results`, `workout_sessions`
- **Trigger**: `handle_new_user()` auto-creates profile row on signup

## Design System
All colors/spacing are CSS custom properties in `src/App.css`:
```css
--orange: #FF6B00       /* primary accent */
--surface: #0A0A0A      /* app background */
--surface-elevated: #141414
--surface-hover: #1A1A1A
--text-primary: #FFFFFF
--text-secondary: #A0A0A0
--text-muted: #606060
--border: rgba(255,255,255,0.08)
--danger: #FF4D6D
--radius-md: 12px
--radius-xl: 20px
--radius-full: 999px
--font-heading: 'Montserrat', sans-serif
--font-body: 'Inter', sans-serif
```
**Rule**: Never use hardcoded colors. Always use CSS variables.

## iOS Build Commands
```bash
# Build + sync to Xcode
npm run build && npx cap sync ios

# Or double-click the script:
./build_and_sync.command

# Then in Xcode: select Waleed_iPhone → ▶ Run
```

## Bundle ID Issue (known)
- `capacitor.config.ts` has `com.fitguard.app`
- Xcode project still shows `com.kineticguard.app`
- Not causing build failures yet — fix before App Store submission

## Current State (as of May 2026)
### ✅ Complete
- Full auth flow (sign in / sign up) with Supabase
- Safety Audit assessment (6 questions → tier assignment)
- Results screen with risk flags
- Daily readiness check
- Workout dashboard
- Exercise detail with SVG animations
- Camera-based AI form check screen (FormCheckAI)
- Post-workout summary
- Arabic/English bilingual with RTL support
- Supabase schema + RLS policies (deployed)
- App deployed to Waleed's iPhone successfully

### 🔴 Pending
- **Task #7**: Wire up real camera + full workout flow end-to-end
  - `@capacitor/camera` plugin installed but FormCheckAI uses browser `getUserMedia`
  - Need to use `CameraPreview` or native camera for iOS
- **Task #8**: Push latest changes to GitHub (auth incomplete — see below)
- Bundle ID fix in Xcode project

## GitHub
- **Repo**: https://github.com/wfaizyai-commits/kinetic-guard
- **Branch**: `master`
- **Auth method**: HTTPS (requires GitHub PAT)

## Key Patterns
- All screens receive props for navigation, no router library
- `SCREENS` enum in `App.jsx` controls current screen
- Supabase writes are non-blocking: `.catch(() => {})`
- `loadAudit()` / `saveAudit()` persist tier result to localStorage
- RTL: `isRTL` from `useLanguage()`, `dir="rtl"` on root when Arabic
- Animations: CSS `@keyframes` on SVG groups in `ExerciseAnimation.jsx`

## How to Run Locally
```bash
npm install
# Create .env.local with:
# VITE_SUPABASE_URL=https://pxhdptebzbudswrkgapf.supabase.co
# VITE_SUPABASE_ANON_KEY=sb_publishable_T8V39HVugJIhJfeXqubSqg_6HQ8Oqj5
npm run dev
# → http://localhost:5173
```

## Next Session Prompt (copy this)
```
Continue building FitGuard (see CLAUDE.md for full context).

Next task: Wire up the real camera flow for AI Form Check on iOS.
- Replace browser getUserMedia in FormCheckAI.jsx with @capacitor/camera or CameraPreview
- The plugin is already installed (see package.json)
- Test on Waleed_iPhone via Xcode
- Keep existing UI/CSS, only replace the camera capture logic
- Bilingual strings are in src/i18n/translations.js (formCheck key)

After camera works: push everything to GitHub (master branch, HTTPS auth with PAT).
```
