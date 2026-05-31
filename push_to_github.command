#!/bin/bash
# FitGuard — Push to GitHub
# Double-click this file in Finder to push.

cd "$(dirname "$0")"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  FitGuard — Push to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Stage all changes and commit
echo "▶ Clearing any stale git lock files..."
find .git -name "*.lock" -delete 2>/dev/null; true

echo "▶ Resetting any previous failed commit..."
git reset HEAD~1 2>/dev/null; true

echo "▶ Staging source files (NOT this script)..."
git add \
  ios/App/App.xcodeproj/project.pbxproj \
  "ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved" \
  ios/App/App/App.entitlements \
  ios/App/App/AppDelegate.swift \
  "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png" \
  ios/App/App/Base.lproj/Main.storyboard \
  ios/App/App/CustomBridgeViewController.swift \
  ios/App/App/HealthKitPlugin.swift \
  ios/App/App/Info.plist \
  ios/App/CapApp-SPM/Package.swift \
  package-lock.json \
  package.json \
  src/App.jsx \
  src/i18n/translations.js \
  src/lib/healthKit.js \
  src/lib/notifications.js \
  src/lib/prayerTimes.js \
  src/lib/formCheckAI.js \
  src/screens/WorkoutDashboard.css \
  src/screens/WorkoutDashboard.jsx \
  src/screens/FormCheckAI.css \
  src/screens/FormCheckAI.jsx \
  src/components/ExerciseAnimation.jsx \
  src/components/ExerciseAnimation.css

git commit -m "feat: gym-poster animations, 4 new exercises, category filter

- Completely redesign exercise animations: gym-poster style filled limbs,
  dark clothing + orange active-muscle highlight (matches reference poster)
- 3-frame crossfade engine: all 9 exercises fade through 3 key positions
- Add 4 new exercise animations: Lunge, Jumping Jack, Bicycle Crunch,
  Mountain Climber (each with 3 anatomically correct frames)
- Add category filter chips to Workout tab: All / Strength / Cardio / Core
- Expand WORKOUTS_BY_TIER: novice (6 ex), intermediate (7), advanced (7)
- Add category field to all exercises (EN + AR)"

# Build remote URL with PAT in memory only (never committed)
PAT="YOUR_PAT_HERE"
git remote set-url origin "https://wfaizyai-commits:${PAT}@github.com/wfaizyai-commits/kinetic-guard.git"
unset PAT

echo "▶ Pushing to GitHub (master)..."
git push origin master

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Push successful!"
  echo "   https://github.com/wfaizyai-commits/kinetic-guard"
else
  echo ""
  echo "❌ Push failed. Check your internet connection or token."
fi

# Remove PAT from remote URL after push (security)
git remote set-url origin https://github.com/wfaizyai-commits/kinetic-guard.git

echo ""
read -p "Press Enter to close..."
