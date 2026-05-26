/**
 * auth.js — Higher-level auth helpers for FitGuard
 * Wraps supabase.js with error normalisation, session utilities,
 * and convenience methods used by useAuth and AuthModal.
 */

import { supabase, signIn, signUp, signOut, getSession, upsertProfile } from './supabase';

// ── Error message normalisation ───────────────────────────────────────────────

export const normaliseAuthError = (rawMessage = '') => {
  const m = rawMessage.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('invalid email or password'))
    return 'Incorrect email or password.';
  if (m.includes('email not confirmed'))
    return 'Please confirm your email before signing in.';
  if (m.includes('already registered') || m.includes('user already exists'))
    return 'This email is already registered. Try signing in.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a moment and try again.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Check your connection and try again.';
  if (m.includes('password') && m.includes('short'))
    return 'Password must be at least 6 characters.';
  return 'Something went wrong. Please try again.';
};

// ── Auth actions (re-exported with error normalisation) ───────────────────────

export const authSignIn = async (email, password) => {
  const { data, error } = await signIn(email.trim(), password);
  if (error) return { user: null, error: normaliseAuthError(error.message) };
  const user = data?.user ?? data?.session?.user ?? null;
  return { user, error: null };
};

export const authSignUp = async (email, password, displayName) => {
  const { data, error } = await signUp(email.trim(), password, displayName.trim());
  if (error) return { user: null, error: normaliseAuthError(error.message) };
  const user = data?.user ?? data?.session?.user ?? null;

  // Auto-upsert display_name on signup (non-blocking)
  if (user?.id && displayName.trim()) {
    upsertProfile(user.id, { display_name: displayName.trim() }).catch(() => {});
  }

  return { user, error: null };
};

export const authSignOut = async () => {
  const { error } = await signOut();
  return { error: error ? normaliseAuthError(error.message) : null };
};

// ── Session helpers ───────────────────────────────────────────────────────────

export const getCurrentUser = async () => {
  const { session, error } = await getSession();
  return { user: session?.user ?? null, error };
};

/** Subscribe to auth state changes. Returns the unsubscribe function. */
export const onAuthChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => callback(session?.user ?? null)
  );
  return () => subscription.unsubscribe();
};

// ── Validation helpers ────────────────────────────────────────────────────────

export const validateAuthFields = ({ email, password, name, isSignUp }) => {
  if (!email.trim() || !password.trim()) return 'Email and password are required.';
  if (!/\S+@\S+\.\S+/.test(email.trim())) return 'Please enter a valid email address.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (isSignUp && !name.trim()) return 'Please enter your name.';
  return null; // no error
};
