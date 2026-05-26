/**
 * AuthModal.jsx — Overlay auth form for FitGuard
 *
 * Shown as a bottom-sheet / modal when the user attempts an action
 * that requires authentication (e.g. saving progress) but is not yet
 * signed in. Distinct from AuthScreen (which is a full-page gate).
 *
 * Props:
 *   onAuthenticated(user)  — called on successful sign-in or sign-up
 *   onDismiss()            — called when the user taps the backdrop or "Skip"
 *   reason                 — optional string shown above the form e.g. "Save your results"
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import Button from '../Button';
import { authSignIn, authSignUp, validateAuthFields } from '../../lib/auth';
import './AuthModal.css';

const AuthModal = ({ onAuthenticated, onDismiss, reason }) => {
  const { t, isRTL } = useLanguage();
  const a = t.auth;

  const [mode, setMode]         = useState('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);
  const [visible, setVisible]   = useState(false);

  const isSignUp = mode === 'signup';

  // Animate in
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 280);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateAuthFields({ email, password, name, isSignUp });
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await authSignUp(email, password, name);
      } else {
        result = await authSignIn(email, password);
      }

      if (result.error) {
        setError(result.error);
      } else {
        setVisible(false);
        setTimeout(() => onAuthenticated?.(result.user), 200);
      }
    } catch {
      setError(a.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`auth-modal-backdrop ${visible ? 'auth-modal-backdrop--visible' : ''}`}
      onMouseDown={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className={`auth-modal ${visible ? 'auth-modal--visible' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
        role="dialog"
        aria-modal="true"
        aria-label={isSignUp ? a.tabSignUp : a.tabSignIn}
      >
        {/* Drag handle */}
        <div className="auth-modal__handle" />

        {/* Header */}
        <div className="auth-modal__header">
          <div>
            {reason && <p className="auth-modal__reason">{reason}</p>}
            <h2 className="auth-modal__title">
              {isSignUp ? a.tabSignUp : a.tabSignIn}
            </h2>
          </div>
          <button
            type="button"
            className="auth-modal__close"
            onClick={dismiss}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-modal__tabs">
          <button
            type="button"
            className={`auth-modal__tab ${!isSignUp ? 'auth-modal__tab--active' : ''}`}
            onClick={() => { setMode('signin'); setError(''); }}
          >
            {a.tabSignIn}
          </button>
          <button
            type="button"
            className={`auth-modal__tab ${isSignUp ? 'auth-modal__tab--active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            {a.tabSignUp}
          </button>
        </div>

        {/* Form */}
        <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>

          {isSignUp && (
            <div className="auth-modal__field">
              <label className="auth-modal__label">{a.labelName}</label>
              <input
                className="auth-modal__input"
                type="text"
                placeholder={a.placeholderName}
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          )}

          <div className="auth-modal__field">
            <label className="auth-modal__label">{a.labelEmail}</label>
            <input
              className="auth-modal__input"
              type="email"
              placeholder={a.placeholderEmail}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete={isSignUp ? 'email' : 'username'}
              dir="ltr"
            />
          </div>

          <div className="auth-modal__field">
            <label className="auth-modal__label">{a.labelPassword}</label>
            <div className="auth-modal__input-wrap">
              <input
                className="auth-modal__input auth-modal__input--pass"
                type={showPass ? 'text' : 'password'}
                placeholder={a.placeholderPassword}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                dir="ltr"
              />
              <button
                type="button"
                className="auth-modal__pass-toggle"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-modal__error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {isSignUp ? a.btnSignUp : a.btnSignIn}
          </Button>

        </form>

        {/* Skip link */}
        <button type="button" className="auth-modal__skip" onClick={dismiss}>
          {isRTL ? 'تخطي' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
