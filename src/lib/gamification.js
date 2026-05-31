/**
 * gamification.js — FitGuard XP, Levels, Workout Streaks & Badges
 */

const XP_KEY     = 'fitguard_xp_v1';
const STREAK_KEY = 'fitguard_wstreak_v1';
const dateStr    = (d = new Date()) => d.toISOString().slice(0, 10);

// ── Levels ────────────────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, min: 0,     titleEn: 'Beginner',   titleAr: 'مبتدئ'   },
  { level: 2, min: 300,   titleEn: 'Active',      titleAr: 'نشيط'    },
  { level: 3, min: 800,   titleEn: 'Dedicated',   titleAr: 'ملتزم'   },
  { level: 4, min: 1800,  titleEn: 'Athlete',     titleAr: 'رياضي'   },
  { level: 5, min: 3500,  titleEn: 'Champion',    titleAr: 'بطل'     },
  { level: 6, min: 6000,  titleEn: 'Elite',       titleAr: 'نخبة'    },
  { level: 7, min: 10000, titleEn: 'Legend',      titleAr: 'أسطورة'  },
];

export const getLevel = (totalXP) => {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (totalXP >= l.min) lvl = l; }
  const next = LEVELS.find(l => l.min > totalXP);
  const progress = next
    ? ((totalXP - lvl.min) / (next.min - lvl.min)) * 100
    : 100;
  return { ...lvl, nextMin: next?.min ?? null, progress: Math.min(100, progress) };
};

// ── XP storage ────────────────────────────────────────────────────────────────
export const loadXP = () => {
  try { return JSON.parse(localStorage.getItem(XP_KEY)) || { total: 0, history: [] }; }
  catch { return { total: 0, history: [] }; }
};

const saveXP = (data) => {
  try { localStorage.setItem(XP_KEY, JSON.stringify(data)); } catch {}
};

/** Award XP. Returns { earned, newTotal, leveledUp, newLevel } */
export const awardXP = ({ completedCount, totalCount, readinessScore, streak, usedFormCheck }) => {
  const data = loadXP();
  let earned = 80; // base for any workout
  if (completedCount === totalCount) earned += 50;          // completed all exercises
  if (readinessScore >= 80)          earned += 25;          // high readiness
  if (streak >= 3)                   earned += Math.min(streak * 5, 50); // streak bonus (cap 50)
  if (usedFormCheck)                 earned += 20;          // used AI form check

  const before   = getLevel(data.total);
  data.total    += earned;
  data.history.push({ date: dateStr(), earned });
  // Keep only last 90 days
  if (data.history.length > 90) data.history = data.history.slice(-90);
  const after    = getLevel(data.total);
  saveXP(data);

  return {
    earned,
    newTotal: data.total,
    leveledUp: after.level > before.level,
    newLevel: after,
  };
};

// ── Workout streak ────────────────────────────────────────────────────────────
const loadStreakData = () => {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY)) || { days: [] }; }
  catch { return { days: [] }; }
};

const saveStreakData = (d) => {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(d)); } catch {}
};

/** Call after a workout is completed. Returns current streak. */
export const recordWorkoutDay = () => {
  const data  = loadStreakData();
  const today = dateStr();
  if (!data.days.includes(today)) {
    data.days.push(today);
    data.days.sort();
    saveStreakData(data);
  }
  return calcWorkoutStreak();
};

// ── Activity (walking / cardio) counts as an active day too ─────────────────────
// Previously only an in-app workout advanced the streak, so a 10k-step walk
// never counted. Now any active day (walk logged, or step goal met) keeps the
// streak alive and shows as "active".
const ACTIVE_KEY = 'fitguard_active_days_v1';
export const STEP_GOAL = 6000; // steps that count a day as "active"

const loadActiveDays = () => {
  try { return JSON.parse(localStorage.getItem(ACTIVE_KEY)) || { days: [] }; }
  catch { return { days: [] }; }
};
const saveActiveDays = (d) => {
  try { localStorage.setItem(ACTIVE_KEY, JSON.stringify(d)); } catch {}
};

/** Mark today active from a walk/cardio log or from meeting the step goal. */
export const recordActiveDay = (date = dateStr()) => {
  const data = loadActiveDays();
  if (!data.days.includes(date)) {
    data.days.push(date);
    data.days.sort();
    saveActiveDays(data);
    // Active days also feed the workout streak so walking keeps it alive.
    const sd = loadStreakData();
    if (!sd.days.includes(date)) { sd.days.push(date); sd.days.sort(); saveStreakData(sd); }
  }
  return calcWorkoutStreak();
};

/** True if today already counts as active (walk logged or steps ≥ goal). */
export const isTodayActive = (steps = 0) =>
  loadActiveDays().days.includes(dateStr()) || steps >= STEP_GOAL;

/** Auto-mark active when the step goal is met (call when health data loads). */
export const syncStepActivity = (steps = 0) => {
  if (steps >= STEP_GOAL) return recordActiveDay();
  return calcWorkoutStreak();
};

export const getActiveDayCount = () => loadActiveDays().days.length;

export const calcWorkoutStreak = () => {
  const { days } = loadStreakData();
  if (!days.length) return 0;
  let streak = 0;
  let d = new Date();
  // Accept today or yesterday as start
  const todayStr = dateStr(d);
  const yesterday = new Date(d); yesterday.setDate(d.getDate() - 1);
  const start = days.includes(todayStr) ? d : yesterday;
  d = new Date(start);
  while (true) {
    if (!days.includes(dateStr(d))) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

export const getTotalWorkouts = () => loadStreakData().days.length;

// ── Badges ────────────────────────────────────────────────────────────────────
export const BADGES = [
  { id: 'first_sweat',  icon: '🏃', labelEn: 'First Sweat',      labelAr: 'أول تعرق',        descEn: 'Complete your first workout',         descAr: 'أكمل أول تمرين لك',               req: d => d.totalWorkouts >= 1 },
  { id: 'trio',         icon: '🔥', labelEn: '3-Day Streak',      labelAr: 'سلسلة ٣ أيام',    descEn: '3 consecutive workout days',          descAr: '٣ أيام تمرين متواصلة',            req: d => d.streak >= 3 },
  { id: 'week_warrior', icon: '💪', labelEn: 'Week Warrior',      labelAr: 'محارب الأسبوع',   descEn: '7 consecutive workout days',          descAr: '٧ أيام متواصلة',                  req: d => d.streak >= 7 },
  { id: 'month_champ',  icon: '🏆', labelEn: 'Month Champion',    labelAr: 'بطل الشهر',       descEn: '30 consecutive workout days',         descAr: '٣٠ يوماً متواصلة',                req: d => d.streak >= 30 },
  { id: 'form_master',  icon: '🎯', labelEn: 'Form Master',       labelAr: 'سيد الأسلوب',     descEn: 'Use AI Form Check 5 times',           descAr: 'استخدم فحص الشكل ٥ مرات',        req: d => d.formChecks >= 5 },
  { id: 'centurion',    icon: '💯', labelEn: 'Centurion',         labelAr: 'المئوي',           descEn: 'Complete 100 workouts total',         descAr: 'أكمل ١٠٠ تمرين إجمالاً',         req: d => d.totalWorkouts >= 100 },
  { id: 'level_up',     icon: '⚡', labelEn: 'Level Up',          labelAr: 'ارتقاء',           descEn: 'Reach Level 2',                       descAr: 'وصل إلى المستوى الثاني',          req: d => d.xpLevel >= 2 },
  { id: 'elite',        icon: '💎', labelEn: 'Elite',             labelAr: 'النخبة',           descEn: 'Reach Level 5',                       descAr: 'وصل إلى المستوى الخامس',          req: d => d.xpLevel >= 5 },
  { id: 'readiness_90', icon: '🧘', labelEn: 'Zen Athlete',       labelAr: 'الرياضي الهادئ',  descEn: 'Score 90+ on daily readiness',        descAr: 'سجّل ٩٠+ في الجاهزية اليومية',   req: d => d.bestReadiness >= 90 },
  { id: 'full_set',     icon: '✅', labelEn: 'Full Set',          labelAr: 'مجموعة كاملة',    descEn: 'Complete all exercises 10 times',     descAr: 'أكمل جميع التمارين ١٠ مرات',     req: d => d.fullWorkouts >= 10 },
];

const BADGE_META_KEY = 'fitguard_badge_meta_v1';

const loadBadgeMeta = () => {
  try { return JSON.parse(localStorage.getItem(BADGE_META_KEY)) || {}; }
  catch { return {}; }
};
const saveBadgeMeta = (m) => {
  try { localStorage.setItem(BADGE_META_KEY, JSON.stringify(m)); } catch {}
};

/** Returns badges with earned: true/false. Also saves newly earned ones. */
export const evaluateBadges = ({ totalWorkouts, streak, formChecks, xpLevel, bestReadiness, fullWorkouts }) => {
  const meta     = loadBadgeMeta();
  const deps     = { totalWorkouts, streak, formChecks, xpLevel, bestReadiness, fullWorkouts };
  const newlyEarned = [];
  const result   = BADGES.map(b => {
    const earned = b.req(deps);
    if (earned && !meta[b.id]) {
      meta[b.id] = true;
      newlyEarned.push(b);
    }
    return { ...b, earned };
  });
  saveBadgeMeta(meta);
  return { badges: result, newlyEarned };
};

/** Increment form check counter */
export const recordFormCheck = () => {
  const key  = 'fitguard_fc_count_v1';
  const val  = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(val));
  return val;
};
export const getFormCheckCount = () =>
  parseInt(localStorage.getItem('fitguard_fc_count_v1') || '0', 10);

/** Full readiness best tracker */
export const updateBestReadiness = (score) => {
  const key  = 'fitguard_best_readiness_v1';
  const best = Math.max(parseInt(localStorage.getItem(key) || '0', 10), score);
  localStorage.setItem(key, String(best));
  return best;
};
export const getBestReadiness = () =>
  parseInt(localStorage.getItem('fitguard_best_readiness_v1') || '0', 10);

/** Full-workout counter (all exercises completed) */
export const recordFullWorkout = () => {
  const key = 'fitguard_full_workouts_v1';
  const val = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(val));
  return val;
};
export const getFullWorkouts = () =>
  parseInt(localStorage.getItem('fitguard_full_workouts_v1') || '0', 10);
