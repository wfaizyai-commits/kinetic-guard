import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import { signIn, signUp } from '../lib/supabase';
import './AuthScreen.css';

const FitGuardLogo = () => (
  <svg width="52" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 2L4 12V30C4 43.3 13.6 55.7 26 58C38.4 55.7 48 43.3 48 30V12L26 2Z"
      fill="url(#auth-shield-grad)" stroke="none"/>
    <text x="26" y="38" textAnchor="middle" fontSize="18" fontWeight="900"
      fontFamily="Montserrat,sans-serif" fill="#fff" letterSpacing="1">FG</text>
    <defs>
      <linearGradient id="auth-shield-grad" x1="26" y1="2" x2="26" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF8C38"/>
        <stop offset="100%" stopColor="#FF3D00"/>
      </linearGradient>
    </defs>
  </svg>
);

const AuthScreen = ({ onAuthenticated }) => {
  const { t, isRTL } = useLanguage();
  const a = t.auth;

  const [mode, setMode]           = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [showPass, setShowPass]   = useState(false);

  const isSignUp = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(a.errorRequired); return;
    }
    if (password.length < 6) {
      setError(a.errorPassShort); return;
    }
    if (isSignUp && !name.trim()) {
      setError(a.errorNameRequired); return;
    }

    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await signUp(email.trim(), password, name.trim());
      } else {
        result = await signIn(email.trim(), password);
      }

      if (result.error) {
        setError(mapError(result.error.message, a));
      } else {
        onAuthenticated(result.data?.user || result.data?.session?.user);
      }
    } catch (err) {
      setError(a.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const mapError = (msg, a) => {
    const m = msg?.toLowerCase() || '';
    if (m.includes('invalid login') || m.includes('invalid credentials')) return a.errorInvalidCreds;
    if (m.includes('email not confirmed')) return a.errorEmailNotConfirmed;
    if (m.includes('already registered') || m.includes('user already')) return a.errorAlreadyRegistered;
    if (m.includes('rate limit')) return a.errorRateLimit;
    return a.errorGeneric;
  };

  return (
    <div className="auth-screen screen">
      <div className="lang-toggle-fixed"><LanguageToggle /></div>

      {/* Background glow */}
      <div className="auth-bg-glow" />

      <div className="auth-content">
        {/* Logo + heading */}
        <div className="auth-hero animate-fade-up">
          <div className="auth-logo-wrap">
            <FitGuardLogo />
          </div>
          <h1 className="auth-title">FitGuard</h1>
          <p className="auth-subtitle">{isSignUp ? a.subtitleSignUp : a.subtitleSignIn}</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <button
            type="button"
            className={`auth-tab ${!isSignUp ? 'auth-tab--active' : ''}`}
            onClick={() => { setMode('signin'); setError(''); }}
          >
            {a.tabSignIn}
          </button>
          <button
            type="button"
            className={`auth-tab ${isSignUp ? 'auth-tab--active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            {a.tabSignUp}
          </button>
        </div>

        {/* Form */}
        <form className="auth-form animate-fade-up" style={{ animationDelay: '0.1s' }} onSubmit={handleSubmit}>

          {isSignUp && (
            <div className="auth-field">
              <label className="auth-label">{a.labelName}</label>
              <input
                className="auth-input"
                type="text"
                placeholder={a.placeholderName}
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">{a.labelEmail}</label>
            <input
              className="auth-input"
              type="email"
              placeholder={a.placeholderEmail}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete={isSignUp ? 'email' : 'username'}
              dir="ltr"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">{a.labelPassword}</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input auth-input--pass"
                type={showPass ? 'text' : 'password'}
                placeholder={a.placeholderPassword}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                dir="ltr"
              />
              <button
                type="button"
                className="auth-pass-toggle"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {isSignUp && (
              <p className="auth-hint">{a.passwordHint}</p>
            )}
          </div>

          {error && (
            <div className="auth-error animate-scale-in">
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
            className="auth-submit-btn"
          >
            {isSignUp ? a.btnSignUp : a.btnSignIn}
          </Button>

        </form>

        {/* Divider */}
        <div className="auth-divider animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <span className="auth-divider__line" />
          <span className="auth-divider__text">{a.orContinueWith}</span>
          <span className="auth-divider__line" />
        </div>

        {/* Apple Sign In placeholder — wired in Phase 2 with Capacitor plugin */}
        <div className="auth-social animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <button type="button" className="auth-apple-btn" disabled>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span>{a.appleSignIn}</span>
          </button>
        </div>

        {/* Terms */}
        <p className="auth-terms animate-fade-up" style={{ animationDelay: '0.25s' }}>
          {a.terms}
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
