/**
 * healthKit.js — FitGuard HealthKit Bridge
 *
 * Uses a custom native Swift plugin (ios/App/App/HealthKitPlugin.swift)
 * registered via Capacitor's registerPlugin — no npm package required.
 *
 * Platform support:
 *   iOS  → Apple HealthKit (Apple Watch + iPhone sensors)
 *   Web  → silent no-op, dashboard falls back to localStorage data
 *
 * One-time Xcode setup (done once, never again):
 *   App target → Signing & Capabilities → + Capability → HealthKit
 */

import { registerPlugin, Capacitor } from '@capacitor/core';

// ── Register the native Swift plugin ────────────────────────────────────────
// On web this resolves to null (the fallback object below).
const HealthKit = registerPlugin('HealthKit', {
  web: () => ({
    authorize:        async () => ({ granted: false }),
    readTodayData:    async () => ({ steps: 0, calories: 0, activeMinutes: 0 }),
    readWeekWorkouts: async () => ({ workouts: [0,0,0,0,0,0,0] }),
  }),
});

// ── Cache ────────────────────────────────────────────────────────────────────
const HK_CACHE_KEY = 'fitguard_hk_v1';
const todayStr     = () => new Date().toISOString().slice(0, 10);

const saveHKCache = (data) => {
  try {
    localStorage.setItem(HK_CACHE_KEY, JSON.stringify({
      ...data,
      date:      todayStr(),
      fetchedAt: Date.now(),
    }));
  } catch { /* ignore */ }
};

/** Returns cached data if < 5 min old and same calendar day, else null. */
export const loadHKCache = () => {
  try {
    const raw = localStorage.getItem(HK_CACHE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (d.date !== todayStr()) return null;
    if (Date.now() - d.fetchedAt > 5 * 60_000) return null;
    return d;
  } catch { return null; }
};

export const clearHKCache = () => {
  try { localStorage.removeItem(HK_CACHE_KEY); } catch { /* ignore */ }
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Main entry point. Call on Dashboard mount.
 *
 * 1. Returns fresh cache if available (< 5 min).
 * 2. Requests HealthKit permission (silent after first approval).
 * 3. Reads today's data + this week's workouts in parallel.
 * 4. Returns null on web (dashboard keeps localStorage fallback).
 *
 * @returns {{ steps, calories, activeMinutes, heartRate?, weekWorkouts } | null}
 */
export const initHealthKit = async () => {
  if (!Capacitor.isNativePlatform()) return null;

  const cached = loadHKCache();
  if (cached) return cached;

  try {
    // Request HealthKit authorization — shows iOS permission sheet on first call
    const { granted } = await HealthKit.authorize();
    if (!granted) return null;

    // Read today's metrics and weekly workouts in parallel
    const [today, week] = await Promise.all([
      HealthKit.readTodayData(),
      HealthKit.readWeekWorkouts(),
    ]);

    const data = {
      steps:         today.steps         ?? 0,
      calories:      today.calories      ?? 0,
      activeMinutes: today.activeMinutes ?? 0,
      heartRate:     today.heartRate     ?? null,
      weekWorkouts:  week.workouts       ?? [0,0,0,0,0,0,0],
    };

    saveHKCache(data);
    return data;

  } catch (e) {
    console.warn('[HealthKit] initHealthKit failed:', e?.message ?? e);
    return null;
  }
};

/**
 * Force a fresh HealthKit read (clears 5-min cache first).
 */
export const refreshHealthKit = async () => {
  clearHKCache();
  return initHealthKit();
};

/** True only on a real iOS device. */
export const isHealthKitAvailable = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
