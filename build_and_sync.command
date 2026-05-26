#!/bin/bash
# FitGuard — Build, Sync to iOS, and open Xcode
# Double-click this file in Finder to run.

cd "$(dirname "$0")"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  FitGuard — Build + Sync to iOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Build
echo "▶ Building (npm run build)..."
npm run build
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Build failed. Fix errors above and re-run."
  read -p "Press Enter to close..."
  exit 1
fi
echo "✅ Build complete."
echo ""

# 2. Sync to iOS
echo "▶ Syncing to Xcode (npx cap sync ios)..."
npx cap sync ios
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Cap sync failed. See errors above."
  read -p "Press Enter to close..."
  exit 1
fi
echo "✅ Sync complete."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Ready!"
echo "  1. Select Waleed_iPhone in Xcode"
echo "  2. Press ▶ Run"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 3. Open Xcode workspace (not .xcodeproj)
open ios/App/App.xcworkspace 2>/dev/null || open ios/App/App.xcodeproj

read -p "Press Enter to close this window..."
