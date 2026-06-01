# FitGuard — Exercise Frames (Start + End) per Day

Each exercise = **2 images** that the app crossfades so the rep *moves* (Lyfta-style).
- **Frame 1 = START** → save as `<id>.png`   (Day 1 already done)
- **Frame 2 = END**   → save as `<id>_2.png`

Generate frame 2 with the SAME base style/man as frame 1 — only the position changes.
**Tip:** in Magnific, drag your frame-1 image in as a reference, then paste the END prompt.

**Base style (every prompt):**
> Flat modern vector fitness illustration, clean cel-shading. A clean-shaven Middle-Eastern man, NO beard, NO glasses, short black hair, simple minimal flat face, athletic build, dark grey sleeveless tank top, dark grey shorts, black sneakers. The WORKING MUSCLE glows bright orange #FF6B00 like a heatmap; rest of body stays grey. Full body, accurate gym equipment in light grey line-art, dark charcoal near-black background, no text, no logo, centered, square.

---

## DAY 1 — Chest & Triceps

| Exercise | START image | END image (`_2`) | END pose to generate |
|---|---|---|---|
| Bench Press | `bench_press.png` | `bench_press_2.png` | barbell lowered to chest, elbows bent down |
| Incline Press | `incline_press.png` | `incline_press_2.png` | dumbbells lowered to upper-chest level |
| Chest Fly | `chest_fly.png` | `chest_fly_2.png` | handles brought together in front of chest |
| Tricep Pushdown | `tricep_pushdown.png` | `tricep_pushdown_2.png` | forearms up ~90°, bar at chest height |
| Overhead Extension | `overhead_ext.png` | `overhead_ext_2.png` | dumbbell lowered behind head, elbows bent |
| Skull Crushers | `skull_crusher.png` | `skull_crusher_2.png` | EZ-bar lowered toward the forehead |

---

## DAY 2 — Back & Biceps

| Exercise | START image | END image (`_2`) | START pose | END pose |
|---|---|---|---|---|
| Deadlift | `deadlift.png` | `deadlift_2.png` | standing tall, bar at hips | hip-hinged, bar at mid-shin |
| Lat Pulldown | `lat_pulldown.png` | `lat_pulldown_2.png` | arms extended up, bar high | bar pulled to upper chest |
| Barbell Row | `barbell_row.png` | `barbell_row_2.png` | arms extended, bar hanging | bar pulled to waist |
| Seated Cable Row | `seated_row.png` | `seated_row_2.png` | arms extended forward | handle pulled to torso |
| Barbell Curl | `barbell_curl.png` | `barbell_curl_2.png` | arms extended, bar at thighs | barbell curled to shoulders |
| Hammer Curl | `hammer_curl.png` | `hammer_curl_2.png` | arms extended down at sides | dumbbells curled up |

---

## DAY 3 — Legs

| Exercise | START image | END image (`_2`) | START pose | END pose |
|---|---|---|---|---|
| Barbell Squat | `squat.png` | `squat_2.png` | standing tall | deep squat |
| Leg Press | `leg_press.png` | `leg_press_2.png` | knees bent toward chest | legs extended (pushed out) |
| Romanian Deadlift | `rdl.png` | `rdl_2.png` | standing tall, bar at hips | hip-hinged, bar at mid-shin |
| Leg Curl | `leg_curl.png` | `leg_curl_2.png` | legs extended straight | legs curled in (pad up) |
| Leg Extension | `leg_ext.png` | `leg_ext_2.png` | knees bent, pad down | legs extended straight out |
| Calf Raise | `calf_raise.png` | `calf_raise_2.png` | heels down, flat | up on toes (raised) |

---

## DAY 4 — Shoulders

| Exercise | START image | END image (`_2`) | START pose | END pose |
|---|---|---|---|---|
| Overhead Press | `overhead_press.png` | `overhead_press_2.png` | bar at shoulder height | bar pressed overhead |
| Lateral Raise | `lateral_raise.png` | `lateral_raise_2.png` | arms down at sides | arms raised out to shoulder height |
| Front Raise | `front_raise.png` | `front_raise_2.png` | arms down in front of thighs | arms raised forward to shoulder height |
| Rear Delt Fly | `rear_delt_fly.png` | `rear_delt_fly_2.png` | arms hanging together below chest | arms opened out to sides |
| Barbell Shrug | `shrug.png` | `shrug_2.png` | shoulders relaxed down | shoulders shrugged up |

---

## DAY 5 — Arms & Abs (2 NEW + 4 reuse Day 1/2)

| Exercise | START image | END image (`_2`) | START pose | END pose |
|---|---|---|---|---|
| Cable Crunch | `cable_crunch.png` | `cable_crunch_2.png` | torso upright, rope behind head | crunched down |
| Hanging Leg Raise | `leg_raise.png` | `leg_raise_2.png` | legs hanging straight down | legs raised up |
| *(Barbell Curl)* | reuse `barbell_curl` | reuse `barbell_curl_2` | — | — |
| *(Tricep Pushdown)* | reuse `tricep_pushdown` | reuse `tricep_pushdown_2` | — | — |
| *(Hammer Curl)* | reuse `hammer_curl` | reuse `hammer_curl_2` | — | — |
| *(Overhead Extension)* | reuse `overhead_ext` | reuse `overhead_ext_2` | — | — |

---

### Totals
- **Frame 1 (START):** 25 unique — Day 1 done (6), 19 to go.
- **Frame 2 (END):** 25 unique — optional, add anytime to animate.
- Filenames must match exactly. Any exercise missing `_2` just stays static (fine).
