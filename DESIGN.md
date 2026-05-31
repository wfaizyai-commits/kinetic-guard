# FitGuard — Design System (current state, pre-enhancement)

Captured from `src/App.css` so enhancements extend rather than fight the existing system.

## Color (current)
Dark theme, near-black surfaces, single orange accent.
- `--bg #0A0A0A` · `--surface #141414` · `--surface-elevated #1C1C1C` · `--surface-hover #222`
- `--border rgba(255,255,255,.08)`
- Accent `--orange #FF6B00`, `--orange-bright #FF8C38`, dim/glow variants
- Semantic: `--green #00FF88` · `--danger #FF4D6D` · `--warning #FFB800`
- Text: primary `#FFF`, secondary 65%, muted 35%
- **Women's theme** (`.female-theme`): violet `#B06AFF`, violet-tinted backgrounds `#0D0818`/`#160F24`, rounder radii.

### Known issues to fix in the enhancement
- Pure `#0A0A0A` / `#FFFFFF` — not tinted toward brand hue (shared design law: never pure black/white).
- `--green #00FF88` is a harsh, slightly "toxic" green; high chroma.
- `.gradient-text` uses `background-clip:text` (an absolute ban) — should become solid.
- Heavy orange glows everywhere dilute emphasis.

## Typography (current)
- Heading: Montserrat 700–900 · Body: Inter · Arabic: Cairo
- Two display weights are very heavy (900). Scale is ad hoc, not a tokenized ramp.

## Radius & elevation
- Radii 8 / 12 / 16 / 24 / full. Shadows: card + elevated + colored orange glow.

## Motion (current — already rich)
Custom keyframes: check-bounce, xp-glow-pulse, fire-flicker, screen-enter, card stagger, ripple, level-burst, num-pop. Some use bounce/elastic easing (shared law prefers ease-out, no bounce) — keep the personality ones (check, fire, level) as intentional delight, retune generic transitions to ease-out.

## Character system (current)
`src/components/ExerciseAnimation.jsx`: SVG stick-figure, stroked line limbs + joint dots, white spine / dim limbs / orange active muscle, 3-frame CSS crossfade per exercise. Functional and anatomy-aware but generic (any app could ship it). **This is the #1 enhancement target for ownability.**

## Components
Buttons (primary/ghost/secondary), OptionButton, ProgressBar, score rings (SVG), activity rings, weekly bar chart, tab bars. Consistent enough; needs a tokenized elevation + state vocabulary.
