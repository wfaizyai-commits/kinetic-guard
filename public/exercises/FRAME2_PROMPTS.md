# FitGuard — Frame 2 (animation) prompts

Lyfta-style "the rep moves" comes from TWO frames per exercise that the app
crossfades. You already have **frame 1** (e.g. `bench_press.png`). For each
exercise, generate the **opposite end of the rep** and save it as
**`<id>_2.png`** (same folder, `public/exercises/`).

> Optional + incremental: any exercise without a `_2` just stays a static image.
> Do them in any order. Generate `_2` from the SAME prompt you used, only the
> position phrase changes (below). Keep the identical man/style/glow/background.

**Tip for consistency:** in Magnific, drag your existing frame-1 image in as a
reference (or reuse the exact frame-1 prompt) and only swap the position line.

| id | Frame 1 (have) | Frame 2 to generate → `<id>_2.png` |
|---|---|---|
| `bench_press` | top, arms extended | **bottom: barbell lowered to chest, elbows bent** |
| `incline_press` | top, dumbbells extended up | **bottom: dumbbells lowered to upper-chest level** |
| `chest_fly` | arms open wide at sides | **closed: handles together in front of chest** |
| `tricep_pushdown` | bar pushed down, arms straight | **top: forearms up ~90°, bar at chest height** |
| `overhead_ext` | dumbbell raised overhead, arms straight | **bottom: dumbbell lowered behind the head, elbows bent** |
| `skull_crusher` | arms extended up over chest | **bottom: EZ-bar lowered toward the forehead** |
| `deadlift` | standing tall, bar at hips | **bottom: hip-hinged, bar at mid-shin** |
| `lat_pulldown` | bar pulled to upper chest | **top: arms extended up, bar high** |
| `barbell_row` | bar pulled to waist | **bottom: arms extended, bar hanging down** |
| `seated_row` | handle pulled to torso | **start: arms extended forward** |
| `barbell_curl` | barbell curled up to shoulders | **bottom: arms extended, bar at thighs** |
| `hammer_curl` | dumbbells curled up | **bottom: arms extended down at sides** |
| `squat` | standing tall | **bottom: deep squat** |
| `leg_press` | legs extended (pushed out) | **bottom: knees bent toward chest** |
| `rdl` | standing tall, bar at hips | **bottom: hip-hinged, bar at mid-shin** |
| `leg_curl` | legs curled in (pad up) | **start: legs extended straight** |
| `leg_ext` | legs extended straight out | **start: knees bent, pad down** |
| `calf_raise` | up on toes (raised) | **bottom: heels down, flat** |
| `overhead_press` | bar pressed overhead | **bottom: bar at shoulder height** |
| `lateral_raise` | arms raised out to shoulder height | **bottom: arms down at sides** |
| `front_raise` | arms raised forward to shoulder height | **bottom: arms down in front of thighs** |
| `rear_delt_fly` | arms opened out to sides | **start: arms hanging together below chest** |
| `shrug` | shoulders shrugged up | **bottom: shoulders relaxed down** |
| `cable_crunch` | crunched down | **start: torso upright, rope behind head** |
| `leg_raise` | legs raised up | **bottom: legs hanging straight down** |

Filenames must match exactly: `bench_press_2.png`, `squat_2.png`, etc.
