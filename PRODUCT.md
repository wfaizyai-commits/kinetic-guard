# FitGuard — Product Context

**register:** product

## What it is
FitGuard (formerly KineticGuard) is an Arabic-first AI **fitness safety coach** for Saudi Arabia and the Gulf. It is not a workout-logging app — it is the layer that decides *whether* and *how* you should train today, before you lift. Core loop: medical disclaimer → Safety Audit (6 questions → tier) → Daily Readiness check → adaptive workout (injury-aware substitutions) → AI form feedback. Plus prayer-time awareness, Ramadan mode, a women's track with cycle tracking, gamification, and wearable sync.

## Users
- **Primary:** Arabic-speaking men & women, 18–35, in KSA (Riyadh / Jeddah / Dammam) and the wider Gulf. Smartphone-native, gym-curious to committed, value safety and "is this right for me."
- **Returning-from-injury** users who need confidence they won't re-injure.
- **Women** who want culturally-appropriate, home-friendly programming (own theme + cycle tracker).
- Used mostly **on a phone, in a gym or at home**, often mid-session, sometimes one-handed, sometimes between prayers.

## Brand & tone
- **Safety as care, not fear.** A coach who has your back, not a drill sergeant. Warm, direct, Saudi-dialect Arabic. Confident, never clinical or alarmist.
- **Arabic-native, not translated.** RTL is first-class; English is the secondary mirror.
- **Culturally rooted & premium.** Gulf identity worn with pride, finished to Whoop/Apple-Fitness production quality.
- Primary accent: FitGuard Orange `#FF6B00`. Women's theme: violet `#B06AFF`.

## Strategic principles (what makes it ownable / hard to copy)
1. **The safety layer is the moat** — readiness + injury screening + auto-substitution is depth a Western competitor won't replicate quickly.
2. **Cultural depth is the moat a foreign team can't fake** — prayer times, Ramadan mode, dialect, women's track, and a Gulf visual identity.
3. **An ownable character/mascot** — a branded coach figure is memorable, shareable, and far harder to copy than a generic UI. This is a deliberate differentiation lever.
4. **Trust > flash.** Every screen should feel like it was made by people who understand both training science and the user's life.

## Anti-references (do NOT look like these)
- Generic Western fitness apps: MyFitnessPal, Freeletics, Fitbod (one-size-fits-all, English-first, no soul).
- "SaaS-cream" startup landing aesthetic.
- Neon-crypto-on-black, the big-number hero-metric template, identical icon+heading card grids.
- Sterile medical-app white-and-teal.

## Notable constraints
- React 19 + Vite + Capacitor (iOS + Android), single-file CSS-variable design system in `src/App.css`. No Tailwind.
- Must work in **both RTL (Cairo font) and LTR (Inter)**; dynamic Arabic text length.
- Dark theme is core to the identity.
- Two live color themes (orange default, violet women's) — any new system must support both.
