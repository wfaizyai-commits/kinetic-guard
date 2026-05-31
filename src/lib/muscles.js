/**
 * muscles.js — Source of truth for which muscles each exercise targets.
 *
 * The MuscleMap component glows EXACTLY these muscles, so anatomical
 * correctness is guaranteed by data — never left to an AI image.
 *
 * Muscle keys (also used as the highlightable regions in MuscleMap.jsx):
 *   front view: chest, abs, biceps, forearms, quads, delts (shoulders)
 *   back view:  traps, lats, midBack, triceps, glutes, hamstrings, calves, rearDelts
 */

export const MUSCLE_LABELS = {
  chest:      { en: 'Chest',        ar: 'الصدر' },
  triceps:    { en: 'Triceps',      ar: 'الترايسبس' },
  biceps:     { en: 'Biceps',       ar: 'البايسبس' },
  forearms:   { en: 'Forearms',     ar: 'الساعد' },
  delts:      { en: 'Shoulders',    ar: 'الأكتاف' },
  rearDelts:  { en: 'Rear Delts',   ar: 'الأكتاف الخلفية' },
  traps:      { en: 'Traps',        ar: 'الترابيس' },
  lats:       { en: 'Lats',         ar: 'الظهر العريض' },
  midBack:    { en: 'Mid Back',     ar: 'وسط الظهر' },
  abs:        { en: 'Abs / Core',   ar: 'البطن' },
  quads:      { en: 'Quads',        ar: 'الفخذ الأمامي' },
  hamstrings: { en: 'Hamstrings',   ar: 'خلفية الفخذ' },
  glutes:     { en: 'Glutes',       ar: 'المؤخرة' },
  calves:     { en: 'Calves',       ar: 'السمانة' },
};

// Which view each muscle is shown on (for the compact single-view map).
export const MUSCLE_VIEW = {
  chest: 'front', abs: 'front', biceps: 'front', forearms: 'front', delts: 'front', quads: 'front',
  triceps: 'back', traps: 'back', lats: 'back', midBack: 'back', rearDelts: 'back',
  glutes: 'back', hamstrings: 'back', calves: 'back',
};

// Exercise img id → { primary: [...], secondary: [...] }
// primary muscles glow brightest; secondary glow dimmer.
export const EXERCISE_MUSCLES = {
  // Chest & Triceps
  bench_press:     { primary: ['chest'],            secondary: ['triceps', 'delts'] },
  incline_press:   { primary: ['chest'],            secondary: ['delts', 'triceps'] },
  chest_fly:       { primary: ['chest'],            secondary: [] },
  tricep_pushdown: { primary: ['triceps'],          secondary: [] },
  overhead_ext:    { primary: ['triceps'],          secondary: [] },
  skull_crusher:   { primary: ['triceps'],          secondary: [] },
  // Back & Biceps
  deadlift:        { primary: ['lats', 'midBack'],  secondary: ['hamstrings', 'glutes', 'traps'] },
  lat_pulldown:    { primary: ['lats'],             secondary: ['biceps'] },
  barbell_row:     { primary: ['lats', 'midBack'],  secondary: ['biceps'] },
  seated_row:      { primary: ['midBack', 'lats'],  secondary: ['biceps'] },
  barbell_curl:    { primary: ['biceps'],           secondary: ['forearms'] },
  hammer_curl:     { primary: ['biceps', 'forearms'], secondary: [] },
  // Legs
  squat:           { primary: ['quads', 'glutes'],  secondary: ['hamstrings'] },
  leg_press:       { primary: ['quads'],            secondary: ['glutes'] },
  rdl:             { primary: ['hamstrings', 'glutes'], secondary: ['lats'] },
  leg_curl:        { primary: ['hamstrings'],       secondary: [] },
  leg_ext:         { primary: ['quads'],            secondary: [] },
  calf_raise:      { primary: ['calves'],           secondary: [] },
  // Shoulders
  overhead_press:  { primary: ['delts'],            secondary: ['triceps', 'traps'] },
  lateral_raise:   { primary: ['delts'],            secondary: [] },
  front_raise:     { primary: ['delts'],            secondary: [] },
  rear_delt_fly:   { primary: ['rearDelts', 'midBack'], secondary: [] },
  shrug:           { primary: ['traps'],            secondary: [] },
  // Arms & Abs
  cable_crunch:    { primary: ['abs'],              secondary: [] },
  leg_raise:       { primary: ['abs'],              secondary: [] },
};

/** All target muscles (primary first) for an exercise img id. */
export const musclesFor = (imgId) => {
  const m = EXERCISE_MUSCLES[imgId];
  if (!m) return { primary: [], secondary: [] };
  return m;
};

/** Decide which body view best shows an exercise's primary muscles. */
export const viewFor = (imgId) => {
  const { primary } = musclesFor(imgId);
  if (!primary.length) return 'front';
  return MUSCLE_VIEW[primary[0]] || 'front';
};
