#!/bin/bash
cd "$(dirname "$0")"
echo "=== FitGuard: npm run build ==="
npm run build
echo "=== FitGuard: npx cap sync ios ==="
npx cap sync ios
echo "=== Done! Opening Xcode... ==="
open ios/App/App.xcodeproj
