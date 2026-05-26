/**
 * useAuth.js — React hook for authentication state in FitGuard
 *
 * Provides: user, loading, signIn, signUp, signOut
 * Automatically syncs with Supabase onAuthStateChange.
 *
 * Usage:
 *   const { user, loading, signIn, signOut } = useAuth();
 */

import { useState, useEffect, useCallback } from 'react';
import { authSignIn, authSignUp, authSignOut, getCurrentUser, onAuthChange } from '../lib/auth';

const useAuth = () => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);  // true until first session check resolves
  const [error, setError]     = useState(null);

  // ── Boot: resolve existing session ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    getCurrentUser().then(({ user: u }) => {
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    });

    // Subscribe to subsequent auth state changes
    const unsubscribe = onAuthChange((u) => {
      if (!cancelled) setUser(u);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleSignIn = useCallback(async (email, password) => {
    setError(null);
    const { user: u, error: err } = await authSignIn(email, password);
    if (err) { setError(err); return { success: false, error: err }; }
    setUser(u);
    return { success: true, error: null };
  }, []);

  const handleSignUp = useCallback(async (email, password, displayName) => {
    setError(null);
    const { user: u, error: err } = await authSignUp(email, password, displayName);
    if (err) { setError(err); return { success: false, error: err }; }
    setUser(u);
    return { success: true, error: null };
  }, []);

  const handleSignOut = useCallback(async () => {
    setError(null);
    const { error: err } = await authSignOut();
    if (err) { setError(err); return { success: false, error: err }; }
    setUser(null);
    return { success: true, error: null };
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn:  handleSignIn,
    signUp:  handleSignUp,
    signOut: handleSignOut,
    clearError: () => setError(null),
  };
};

export default useAuth;
