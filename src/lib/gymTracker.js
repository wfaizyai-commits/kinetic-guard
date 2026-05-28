/**
 * gymTracker.js — FitGuard Gym Workout Tracker
 * Stores sessions, exercises, sets/reps/weights in localStorage.
 * Provides progressive overload suggestions and volume calculations.
 */

const KEY     = 'fitguard_gym_v2';
const dateStr = (d = new Date()) => d.toISOString().slice(0, 10);
const uid     = () => Math.random().toString(36).slice(2, 10);

// ── Preset exercise library ───────────────────────────────────────────────────
export const PRESET_EXERCISES = [
  // Chest
  { id: 'bench',   nameEn: 'Bench Press',        nameAr: 'ضغط البنش',           muscleEn: 'Chest',       muscleAr: 'صدر',          icon: '💪' },
  { id: 'incline', nameEn: 'Incline Press',       nameAr: 'ضغط مائل',            muscleEn: 'Chest',       muscleAr: 'صدر',          icon: '💪' },
  { id: 'fly',     nameEn: 'Cable Fly',           nameAr: 'تمرين الفراشة',       muscleEn: 'Chest',       muscleAr: 'صدر',          icon: '🦋' },
  // Back
  { id: 'deadlift',nameEn: 'Deadlift',            nameAr: 'رفع ميت',             muscleEn: 'Back',        muscleAr: 'ظهر',          icon: '🏋️' },
  { id: 'pullup',  nameEn: 'Pull-Up',             nameAr: 'سحب علوي',            muscleEn: 'Back',        muscleAr: 'ظهر',          icon: '⚡' },
  { id: 'row',     nameEn: 'Barbell Row',         nameAr: 'تجديف بالبار',        muscleEn: 'Back',        muscleAr: 'ظهر',          icon: '🏋️' },
  { id: 'latdown', nameEn: 'Lat Pulldown',        nameAr: 'سحب أمامي',           muscleEn: 'Back',        muscleAr: 'ظهر',          icon: '🎯' },
  // Legs
  { id: 'squat',   nameEn: 'Squat',               nameAr: 'قرفصاء',              muscleEn: 'Legs',        muscleAr: 'أرجل',         icon: '🦵' },
  { id: 'legpress',nameEn: 'Leg Press',           nameAr: 'ضغط الأرجل',          muscleEn: 'Legs',        muscleAr: 'أرجل',         icon: '🦵' },
  { id: 'rdl',     nameEn: 'Romanian Deadlift',   nameAr: 'رفع ميت روماني',      muscleEn: 'Hamstrings',  muscleAr: 'أوتار العرقوب', icon: '🔥' },
  { id: 'curl_leg',nameEn: 'Leg Curl',            nameAr: 'لف الساق',            muscleEn: 'Hamstrings',  muscleAr: 'أوتار العرقوب', icon: '🔥' },
  { id: 'calf',    nameEn: 'Calf Raise',          nameAr: 'رفع الكعب',           muscleEn: 'Calves',      muscleAr: 'بطة الساق',    icon: '🦶' },
  // Shoulders
  { id: 'ohp',     nameEn: 'Overhead Press',      nameAr: 'ضغط علوي',            muscleEn: 'Shoulders',   muscleAr: 'أكتاف',        icon: '🎯' },
  { id: 'lateral', nameEn: 'Lateral Raise',       nameAr: 'رفع جانبي',           muscleEn: 'Shoulders',   muscleAr: 'أكتاف',        icon: '🎯' },
  { id: 'front',   nameEn: 'Front Raise',         nameAr: 'رفع أمامي',           muscleEn: 'Shoulders',   muscleAr: 'أكتاف',        icon: '🎯' },
  // Arms
  { id: 'curl',    nameEn: 'Barbell Curl',        nameAr: 'لف بالبار',           muscleEn: 'Biceps',      muscleAr: 'باي سبس',      icon: '💪' },
  { id: 'hammer',  nameEn: 'Hammer Curl',         nameAr: 'لف المطرقة',          muscleEn: 'Biceps',      muscleAr: 'باي سبس',      icon: '🔨' },
  { id: 'tricep',  nameEn: 'Tricep Pushdown',     nameAr: 'تمرين التراي سبس',    muscleEn: 'Triceps',     muscleAr: 'تراي سبس',     icon: '💪' },
  { id: 'skull',   nameEn: 'Skull Crusher',       nameAr: 'سحق الجمجمة',         muscleEn: 'Triceps',     muscleAr: 'تراي سبس',     icon: '💪' },
  // Core
  { id: 'plank',   nameEn: 'Plank',               nameAr: 'بلانك',               muscleEn: 'Core',        muscleAr: 'جذع',          icon: '⚡' },
  { id: 'crunch',  nameEn: 'Cable Crunch',        nameAr: 'كرانش بالكابل',       muscleEn: 'Core',        muscleAr: 'جذع',          icon: '🔥' },
  // Cardio
  { id: 'treadmill',nameEn: 'Treadmill',          nameAr: 'سير كهربائي',         muscleEn: 'Cardio',      muscleAr: 'كارديو',       icon: '🏃' },
  { id: 'bike',    nameEn: 'Stationary Bike',     nameAr: 'دراجة ثابتة',         muscleEn: 'Cardio',      muscleAr: 'كارديو',       icon: '🚴' },
];

// ── Storage ───────────────────────────────────────────────────────────────────
export const loadGym = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { sessions: [], customExercises: [] }; }
  catch { return { sessions: [], customExercises: [] }; }
};

const saveGym = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
};

// ── Sessions ──────────────────────────────────────────────────────────────────
export const saveSession = (session) => {
  const data = loadGym();
  const idx  = data.sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) data.sessions[idx] = session;
  else data.sessions.push(session);
  // Keep last 200 sessions
  if (data.sessions.length > 200) data.sessions = data.sessions.slice(-200);
  saveGym(data);
};

export const createSession = () => ({
  id:         uid(),
  date:       dateStr(),
  startTime:  Date.now(),
  endTime:    null,
  exercises:  [],
  totalVolume: 0,
  xpEarned:   0,
});

export const finishSession = (session) => {
  const done = {
    ...session,
    endTime: Date.now(),
    totalVolume: calcVolume(session.exercises),
  };
  saveSession(done);
  return done;
};

// ── Exercise helpers ──────────────────────────────────────────────────────────
export const addExerciseToSession = (session, exercise) => ({
  ...session,
  exercises: [
    ...session.exercises,
    { ...exercise, sessionExId: uid(), sets: [{ weight: '', reps: '', done: false }] },
  ],
});

export const updateSet = (session, exIdx, setIdx, field, value) => {
  const exercises = session.exercises.map((ex, ei) => {
    if (ei !== exIdx) return ex;
    const sets = ex.sets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s);
    return { ...ex, sets };
  });
  return { ...session, exercises };
};

export const addSet = (session, exIdx) => {
  const exercises = session.exercises.map((ex, ei) => {
    if (ei !== exIdx) return ex;
    const last = ex.sets[ex.sets.length - 1] || { weight: '', reps: '' };
    return { ...ex, sets: [...ex.sets, { weight: last.weight, reps: last.reps, done: false }] };
  });
  return { ...session, exercises };
};

export const removeSet = (session, exIdx, setIdx) => {
  const exercises = session.exercises.map((ex, ei) => {
    if (ei !== exIdx) return ex;
    const sets = ex.sets.filter((_, si) => si !== setIdx);
    return { ...ex, sets: sets.length ? sets : [{ weight: '', reps: '', done: false }] };
  });
  return { ...session, exercises };
};

export const removeExercise = (session, exIdx) => ({
  ...session,
  exercises: session.exercises.filter((_, ei) => ei !== exIdx),
});

// ── Volume ────────────────────────────────────────────────────────────────────
export const calcVolume = (exercises) =>
  exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) =>
      s + (set.done ? (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0) : 0)
    , 0)
  , 0);

// ── Progressive overload ──────────────────────────────────────────────────────
/**
 * Finds the last session where this exercise was performed.
 * Returns { sets, suggestion } where suggestion is the next weight to try.
 */
export const getLastPerformance = (exerciseId) => {
  const { sessions } = loadGym();
  for (let i = sessions.length - 1; i >= 0; i--) {
    const ex = sessions[i].exercises.find(e => e.id === exerciseId);
    if (!ex) continue;
    const doneSets = ex.sets.filter(s => s.done && s.weight && s.reps);
    if (!doneSets.length) continue;
    const lastWeight  = parseFloat(doneSets[doneSets.length - 1].weight) || 0;
    const lastReps    = parseInt(doneSets[doneSets.length - 1].reps)    || 0;
    const allMaxReps  = doneSets.every(s => parseInt(s.reps) >= 8);
    // Suggest +2.5kg if they hit ≥8 reps on all sets
    const suggestion  = allMaxReps ? lastWeight + 2.5 : lastWeight;
    return {
      date:       sessions[i].date,
      sets:       doneSets,
      lastWeight,
      lastReps,
      suggestion,
      shouldIncrease: allMaxReps,
    };
  }
  return null;
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const getStats = () => {
  const { sessions } = loadGym();
  const total   = sessions.length;
  const thisWeek = (() => {
    const mon = new Date();
    mon.setDate(mon.getDate() - mon.getDay() + 1);
    mon.setHours(0, 0, 0, 0);
    return sessions.filter(s => new Date(s.date) >= mon).length;
  })();
  const totalVol = sessions.reduce((a, s) => a + (s.totalVolume || 0), 0);
  const last     = sessions[sessions.length - 1] || null;
  return { total, thisWeek, totalVol, last };
};

// ── History for one exercise (for progress chart) ─────────────────────────────
export const getExerciseHistory = (exerciseId) => {
  const { sessions } = loadGym();
  return sessions
    .filter(s => s.exercises.some(e => e.id === exerciseId))
    .map(s => {
      const ex   = s.exercises.find(e => e.id === exerciseId);
      const done = ex.sets.filter(s => s.done && s.weight);
      const maxW = Math.max(...done.map(s => parseFloat(s.weight) || 0));
      return { date: s.date, maxWeight: maxW, sets: done.length };
    })
    .filter(e => e.maxWeight > 0);
};

// ── Custom exercises ──────────────────────────────────────────────────────────
export const addCustomExercise = (ex) => {
  const data = loadGym();
  data.customExercises.push({ ...ex, id: uid(), custom: true });
  saveGym(data);
};

export const getAllExercises = () => {
  const { customExercises } = loadGym();
  return [...PRESET_EXERCISES, ...customExercises];
};
