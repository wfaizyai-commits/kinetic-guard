#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# FitGuard — Exercise Image Optimizer
#
# Double-click this file (or run it) AFTER you drop your generated images into
# public/exercises/. It resizes every image to a tidy 800x800 max so the app
# stays small and fast. Safe to run repeatedly.
#
# It does NOT rename files — names must already match the ids (bench_press.png …).
# ──────────────────────────────────────────────────────────────────────────────
cd "$(dirname "$0")/public/exercises" || { echo "Could not find public/exercises"; exit 1; }

echo "🖼  Optimizing exercise images in: $(pwd)"
echo ""

count=0
for f in *.png *.jpg *.jpeg *.webp; do
  [ -e "$f" ] || continue           # skip if no match
  case "$f" in *.md) continue;; esac # never touch docs
  # Resize longest side to 800px (preserves square), in place
  sips -Z 800 "$f" >/dev/null 2>&1 && {
    size=$(du -h "$f" | cut -f1)
    echo "  ✓ $f  →  $size"
    count=$((count+1))
  }
done

echo ""
echo "Done. Optimized $count image(s)."
echo ""
echo "Next: rebuild + sync so they show in the app:"
echo "   npm run build && npx cap sync ios"
echo ""
echo "Press any key to close…"
read -n 1 -s
