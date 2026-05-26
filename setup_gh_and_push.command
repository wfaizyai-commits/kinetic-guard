#!/bin/bash
cd "$(dirname "$0")"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  FitGuard → GitHub Push Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Install gh if not installed
if ! command -v gh &> /dev/null; then
  echo "▶ Installing GitHub CLI (gh)..."
  brew install gh
  echo ""
fi

# 2. Login via browser (OAuth — no passwords needed)
echo "▶ Logging in to GitHub (browser will open)..."
gh auth login --hostname github.com --git-protocol https --web

echo ""
echo "▶ Pushing to GitHub..."
git push origin master

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Done! Repo is live at:"
echo "  https://github.com/wfaizyai-commits/kinetic-guard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
read -p "Press Enter to close..."
