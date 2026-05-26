/**
 * sync.js — Data synchronisation helpers for FitGuard
 * Queues writes to Supabase and handles offline/failure gracefully.
 * All methods are fire-and-forget (non-blocking) by default.
 */

import { upsertProfile, saveAssessmentResult, saveWorkoutSession, getProfile } from './supabase';

// ── Profile sync ──────────────────────────────────────────────────────────────

/**
 * Sync the user's tier + safety score to their Supabase profile.
 * Non-blocking — errors are silently swallowed (data is also in localStorage).
 */
export const syncProfileTier = (userId, auditResult) => {
  if (!userId || !auditResult) return;
  upsertProfile(userId, {
    tier:         auditResult.tier,
    safety_score: auditResult.safetyScore,
    risk_flags:   auditResult.riskFlags ?? [],
  }).catch(() => {});
};

/**
 * Sync display name and any additional profile fields.
 */
export const syncProfileMeta = (userId, meta = {}) => {
  if (!userId) return;
  upsertProfile(userId, meta).catch(() => {});
};

/**
 * Load the remote profile (awaitable). Returns null on failure.
 */
export const loadRemoteProfile = async (userId) => {
  if (!userId) return null;
  try {
    const { data, error } = await getProfile(userId);
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
};

// ── Assessment sync ───────────────────────────────────────────────────────────

/**
 * Save assessment answers + result to Supabase.
 * Non-blocking.
 */
export const syncAssessmentResult = (userId, answers, result) => {
  if (!userId) return;
  saveAssessmentResult(userId, answers, result).catch(() => {});
};

// ── Workout session sync ──────────────────────────────────────────────────────

/**
 * Save a completed workout session to Supabase.
 * Non-blocking.
 *
 * @param {string}   userId
 * @param {object}   opts
 * @param {string}   opts.tier
 * @param {object[]} opts.completedExercises   — array of exercise objects
 * @param {object}   opts.readinessData        — from ReadinessScreen
 * @param {number}   [opts.durationMinutes]
 */
export const syncWorkoutSession = (userId, { tier, completedExercises, readinessData, durationMinutes }) => {
  if (!userId || !completedExercises?.length) return;

  saveWorkoutSession(userId, {
    tier,
    exercises:        completedExercises.map(ex => ({ name: ex.name, sets: ex.sets, reps: ex.reps })),
    readiness_score:  readinessData?.readinessScore ?? null,
    duration_minutes: durationMinutes ?? null,
  }).catch(() => {});
};

// ── Local-to-remote hydration ─────────────────────────────────────────────────

/**
 * On sign-in: if we have a local audit result saved before the user was
 * authenticated, push it to Supabase now so data isn't lost.
 */
export const hydrateRemoteFromLocal = (userId, localAuditResult) => {
  if (!userId || !localAuditResult) return;
  syncProfileTier(userId, localAuditResult);
};
