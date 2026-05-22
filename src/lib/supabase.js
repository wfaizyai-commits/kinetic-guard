import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('[FitGuard] Missing Supabase env vars — check .env.local');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Capacitor — no URL-based redirects
  },
});

// ── Auth helpers ─────────────────────────────────────────────────────────────

export const signUp = async (email, password, displayName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session || null, error };
};

// ── Profile helpers ──────────────────────────────────────────────────────────

export const upsertProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() })
    .select()
    .single();
  return { data, error };
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// ── Workout session helpers ──────────────────────────────────────────────────

export const saveWorkoutSession = async (userId, sessionData) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      ...sessionData,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data, error };
};

export const getWorkoutHistory = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

// ── Assessment helpers ───────────────────────────────────────────────────────

export const saveAssessmentResult = async (userId, answers, result) => {
  const { data, error } = await supabase
    .from('assessment_results')
    .insert({
      user_id: userId,
      answers,
      tier: result.tier,
      safety_score: result.safetyScore,
      risk_flags: result.riskFlags,
    })
    .select()
    .single();
  return { data, error };
};
