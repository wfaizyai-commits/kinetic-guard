# FitGuard — Exercise Art Kit

Drop illustrated exercise images here and they appear in the app automatically.
No code change needed — `ExerciseImage.jsx` looks for a file matching each
exercise's `img` id and falls back to the animated Muscle Blueprint if missing.

## File rules
- **Filename = the `img` id** from `src/lib/workoutSplits.js` (list below).
- **Format:** `.webp` preferred (smallest), `.png` or `.jpg` also work.
- **Size:** square, 800×800 px. Keep each file under ~150 KB.
- **Safe area:** subject centered; the app shows it in a square card.

Example: `bench_press.webp`

## ✅ APPROVED LOCKED STYLE (Magnific / Freepik — verified May 2026)

The signature look: a **grey figure on a dark charcoal background**, with the
**actively worked muscle glowing in FitGuard orange #FF6B00** like a muscle-
activation heatmap. Clean-shaven, no glasses, simple flat face. This is the
"muscle blueprint" direction — auto-consistent (no face to keep matching) and
it drops straight onto the app's dark UI.

**BASE STYLE — prepend to every prompt, then add the per-exercise action:**
```
Flat modern vector fitness illustration, clean cel-shading. A clean-shaven
Middle-Eastern man, NO beard, NO glasses, short black hair, simple minimal flat
face with very few features, athletic build, wearing a dark grey sleeveless tank
top, dark grey shorts and black sneakers. The actively working muscles GLOW in
bright orange #FF6B00 like a muscle-activation heatmap, while the rest of the
body stays grey. Side view, full body, accurate gym equipment in light grey
line-art. Dark charcoal near-black background. No text, no logo, centered with
margin, square composition. He is performing: ⟨EXERCISE + WHICH MUSCLE GLOWS⟩
```

**Settings used:** model = Auto · aspect = 1:1 · 4 variations · pick the cleanest
side-view, download, rename to the `id`.

**Then add the per-exercise action (name which muscle glows).** One image per id:

### Day 1 — Chest & Triceps
- `bench_press` — lying on a flat bench pressing a loaded barbell
- `incline_press` — on an incline bench pressing two dumbbells
- `chest_fly` — seated on a pec-deck machine, arms bringing handles together in front
- `tricep_pushdown` — standing at a cable machine pushing a straight bar down
- `overhead_ext` — standing, both hands holding one dumbbell overhead behind the head
- `skull_crusher` — lying on a flat bench lowering an EZ-bar to the forehead

### Day 2 — Back & Biceps
- `deadlift` — standing, lifting a loaded barbell from the floor, flat back
- `lat_pulldown` — seated at a lat-pulldown machine pulling the bar to upper chest
- `barbell_row` — bent over, rowing a barbell to the waist
- `seated_row` — seated cable row, pulling a handle to the torso
- `barbell_curl` — standing, curling a barbell
- `hammer_curl` — standing, curling two dumbbells with a neutral (hammer) grip

### Day 3 — Legs
- `squat` — barbell back squat, mid depth, barbell on upper back
- `leg_press` — seated on a 45-degree leg-press machine
- `rdl` — Romanian deadlift, slight knee bend, barbell at mid-shin
- `leg_curl` — lying or seated leg-curl machine
- `leg_ext` — seated leg-extension machine
- `calf_raise` — standing calf raise on a machine or step

### Day 4 — Shoulders
- `overhead_press` — standing, pressing a barbell overhead
- `lateral_raise` — standing, raising two dumbbells out to the sides
- `front_raise` — standing, raising a dumbbell to the front
- `rear_delt_fly` — bent over, raising two dumbbells out to the sides (rear delts)
- `shrug` — standing, shrugging a heavy barbell

### Day 5 — Arms & Abs
- `barbell_curl` — (reuse Day 2 image)
- `tricep_pushdown` — (reuse Day 1 image)
- `hammer_curl` — (reuse Day 2 image)
- `overhead_ext` — (reuse Day 1 image)
- `cable_crunch` — kneeling at a cable machine, crunching down
- `leg_raise` — hanging from a pull-up bar, raising straight legs

## Total unique images to make: 26
(Day 5 reuses four from earlier days, so you only generate 26 files.)

## Quick checklist
- [ ] Generate all 26 with the SAME character + base style
- [ ] Export square, name each exactly as the id (e.g. `bench_press.webp`)
- [ ] Drop them in this folder
- [ ] `npm run build && npx cap sync ios` → they appear automatically
