#!/bin/bash
cd "$(dirname "$0")"
git push origin master
echo ""
echo "✅ Pushed to GitHub!"
echo "Repo: https://github.com/wfaizyai-commits/kinetic-guard"
read -p "Press Enter to close..."
