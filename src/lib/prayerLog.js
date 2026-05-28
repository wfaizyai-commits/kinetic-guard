/**
 * prayerLog.js — FitGuard Prayer Streak & Medal Engine
 *
 * Persists daily prayer check-offs in localStorage.
 * Calculates current streak, best streak, and earned medals.
 */

const LOG_KEY = 'fitguard_prayer_log_v1';
export const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const dateStr = (d = new Date()) => d.toISOString().slice(0, 10);

// ── Storage ───────────────────────────────────────────────────────────────────
export const loadLog = () => {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || {}; } catch { return {}; }
};
const saveLog = (log) => {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch {}
};

/** Toggle one prayer for today. Returns updated log. */
export const togglePrayer = (prayerKey) => {
  const log   = loadLog();
  const today = dateStr();
  if (!log[today]) log[today] = {};
  log[today][prayerKey] = !log[today][prayerKey];
  saveLog(log);
  return log;
};

/** Returns today's check state: { Fajr: true, Dhuhr: false, … } */
export const getTodayChecked = (log) => log[dateStr()] || {};

/** How many prayers checked today */
export const todayCount = (log) => {
  const c = getTodayChecked(log);
  return PRAYER_KEYS.filter(k => c[k]).length;
};

/** True if all 5 prayers marked for the given ISO date string */
const isFullDay = (log, ds) => {
  const d = log[ds];
  return !!d && PRAYER_KEYS.every(k => d[k]);
};

// ── Streak ────────────────────────────────────────────────────────────────────

/** Current streak: consecutive fully-completed days ending today (or yesterday) */
export const calcStreak = (log) => {
  let streak = 0;
  // If today isn't full yet, we start checking from yesterday
  const startOffset = isFullDay(log, dateStr()) ? 0 : 1;
  let d = new Date();
  d.setDate(d.getDate() - startOffset);
  while (true) {
    const ds = dateStr(d);
    if (!isFullDay(log, ds)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

/** All-time best streak */
export const calcBestStreak = (log) => {
  const dates = Object.keys(log).sort();
  if (!dates.length) return 0;
  let best = 0, run = 0;
  let prev = null;
  for (const ds of dates) {
    if (!isFullDay(log, ds)) { run = 0; prev = null; continue; }
    if (!prev) { run = 1; }
    else {
      const yesterday = new Date(prev);
      yesterday.setDate(yesterday.getDate() + 1);
      run = dateStr(yesterday) === ds ? run + 1 : 1;
    }
    if (run > best) best = run;
    prev = ds;
  }
  return best;
};

/** Total fully-completed days ever */
export const calcTotalFullDays = (log) =>
  Object.keys(log).filter(ds => isFullDay(log, ds)).length;

// ── Medals ────────────────────────────────────────────────────────────────────
export const MEDALS = [
  {
    id: 'first_day',
    icon: '🌟',
    threshold: 1,
    labelEn: 'First Step',
    labelAr: 'أول خطوة',
    descEn: 'Complete all 5 prayers in one day',
    descAr: 'أكمل الصلوات الخمس في يوم واحد',
    type: 'total',
  },
  {
    id: 'bronze',
    icon: '🥉',
    threshold: 3,
    labelEn: '3-Day Streak',
    labelAr: 'سلسلة ٣ أيام',
    descEn: '3 consecutive full days',
    descAr: '٣ أيام متواصلة كاملة',
    type: 'streak',
  },
  {
    id: 'silver',
    icon: '🥈',
    threshold: 7,
    labelEn: 'Full Week',
    labelAr: 'أسبوع كامل',
    descEn: '7 consecutive full days',
    descAr: '٧ أيام متواصلة كاملة',
    type: 'streak',
  },
  {
    id: 'fortnight',
    icon: '🏅',
    threshold: 14,
    labelEn: '2-Week Warrior',
    labelAr: 'أسبوعان متواصلان',
    descEn: '14 consecutive full days',
    descAr: '١٤ يوماً متواصلة',
    type: 'streak',
  },
  {
    id: 'gold',
    icon: '🥇',
    threshold: 30,
    labelEn: 'Full Month',
    labelAr: 'شهر كامل',
    descEn: '30 consecutive full days',
    descAr: '٣٠ يوماً متواصلة',
    type: 'streak',
  },
  {
    id: 'diamond_50',
    icon: '💫',
    threshold: 50,
    labelEn: '50-Day Legend',
    labelAr: 'أسطورة ٥٠ يوماً',
    descEn: '50 consecutive full days',
    descAr: '٥٠ يوماً متواصلة',
    type: 'streak',
  },
  {
    id: 'diamond',
    icon: '💎',
    threshold: 100,
    labelEn: '100-Day Diamond',
    labelAr: 'ألماس المئة',
    descEn: '100 consecutive full days',
    descAr: '١٠٠ يوم متواصل',
    type: 'streak',
  },
  {
    id: 'century',
    icon: '🏆',
    threshold: 365,
    labelEn: 'Full Year',
    labelAr: 'سنة كاملة',
    descEn: '365 consecutive full days',
    descAr: '٣٦٥ يوماً متواصلة',
    type: 'streak',
  },
];

/** Returns array of medals with earned: true/false */
export const getEarnedMedals = (log) => {
  const streak = calcBestStreak(log);
  const total  = calcTotalFullDays(log);
  return MEDALS.map(m => ({
    ...m,
    earned: m.type === 'streak' ? streak >= m.threshold : total >= m.threshold,
  }));
};
