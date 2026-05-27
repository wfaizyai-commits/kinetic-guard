/**
 * prayerTimes.js — FitGuard Prayer Times
 *
 * Uses the Aladhan API (free, no key required) + browser geolocation.
 * Caches result in localStorage, refreshes once per day.
 *
 * API: https://aladhan.com/prayer-times-api
 */

const PRAYER_CACHE_KEY = 'fitguard_prayer_v1';
const ALADHAN_BASE     = 'https://api.aladhan.com/v1/timings';

// The 5 canonical prayers (in order)
export const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// ── Cache helpers ─────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10);

const loadCache = () => {
  try {
    const raw = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    // Invalidate after midnight
    if (d.date !== todayStr()) return null;
    return d;
  } catch { return null; }
};

const saveCache = (data) => {
  try { localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify({ ...data, date: todayStr() })); }
  catch { /* ignore */ }
};

// ── Geolocation ───────────────────────────────────────────────────────────────
const getLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('geolocation_unsupported')); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
      (err)       => reject(new Error(err.code === 1 ? 'location_denied' : 'location_error')),
      { timeout: 10000, maximumAge: 3600000 }  // accept cached position up to 1 hour old
    );
  });

// ── Time helpers ──────────────────────────────────────────────────────────────

/** Convert "HH:MM" string (24h) to minutes since midnight */
export const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

/** Convert minutes-since-midnight back to "HH:MM" */
export const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/** Returns the index of the next upcoming prayer (0–4), or -1 if all passed today */
export const getNextPrayerIndex = (prayers) => {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < prayers.length; i++) {
    if (prayers[i].minutes > nowMins) return i;
  }
  return -1; // all prayers passed — next is Fajr tomorrow
};

/** Returns minutes until the next prayer (positive) */
export const minutesUntilNext = (nextIdx, prayers) => {
  if (nextIdx < 0) {
    // Next is Fajr tomorrow
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    return (24 * 60 - nowMins) + prayers[0].minutes;
  }
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return prayers[nextIdx].minutes - nowMins;
};

// ── Main fetch ────────────────────────────────────────────────────────────────

/**
 * Fetches today's prayer times.
 * Returns { prayers, city, timezone, date } or throws.
 *
 * `prayers` is an array of:
 *   { key: 'Fajr', time: '04:12', minutes: 252 }
 */
export const fetchPrayerTimes = async () => {
  // 1. Return cached data if still valid
  const cached = loadCache();
  if (cached) return cached;

  // 2. Get device location
  const coords = await getLocation(); // throws if denied

  // 3. Build request — method 4 = Umm Al-Qura (most common for Gulf/Arabic users)
  const ts  = Math.floor(Date.now() / 1000);
  const url = `${ALADHAN_BASE}/${ts}?latitude=${coords.lat}&longitude=${coords.lon}&method=4`;

  const res  = await fetch(url);
  const body = await res.json();

  if (body.code !== 200) throw new Error('api_error');

  const rawTimings = body.data.timings;
  const meta       = body.data.meta;

  const prayers = PRAYER_KEYS.map((key) => ({
    key,
    time:    rawTimings[key],
    minutes: timeToMinutes(rawTimings[key]),
  }));

  const result = {
    prayers,
    city:     meta.timezone.split('/')[1]?.replace('_', ' ') || meta.timezone,
    timezone: meta.timezone,
    method:   meta.method?.name || 'Umm Al-Qura',
  };

  saveCache(result);
  return result;
};

/**
 * Clear cache (e.g. to force refresh after midnight).
 */
export const clearPrayerCache = () => {
  try { localStorage.removeItem(PRAYER_CACHE_KEY); } catch { /* ignore */ }
};
