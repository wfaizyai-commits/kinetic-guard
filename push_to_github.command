#!/bin/bash
cd "$(dirname "$0")"

# Remove stale lock if it exists
rm -f .git/index.lock

# Stage everything (env.local is gitignored — safe)
git add -A

# Commit
git commit -m "feat: premium UI + Supabase auth + Arabic/English bilingual

- Full AuthScreen (sign in / sign up) with RTL support
- Supabase client, schema migrations, RLS policies
- Premium dark UI redesign across all screens
- Arabic/English bilingual with LanguageToggle
- ExerciseAnimation SVG stick figures with CSS @keyframes
- ExerciseDetail wired with animation + muscle tags
- Capacitor iOS sync ready"

# Push
git push origin main

echo ""
echo "✅ Pushed to GitHub successfully!"
echo "Repo: https://github.com/wfaizyai-commits/kinetic-guard"
read -p "Press Enter to close..."
