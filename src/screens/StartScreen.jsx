import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import './StartScreen.css';

const FitGuardLogo = () => (
  <svg className="fg-logo-svg" viewBox="0 0 72 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="72" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF8C38"/>
        <stop offset="100%" stopColor="#FF3D00"/>
      </linearGradient>
      <filter id="logoGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <path d="M36 3L5 14V42C5 58 18.5 72 36 76C53.5 72 67 58 67 42V14L36 3Z"
      fill="url(#logoGrad)" fillOpacity="0.1"
      stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M36 3L5 14V42C5 58 18.5 72 36 76C53.5 72 67 58 67 42V14L36 3Z"
      fill="none" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinejoin="round"
      filter="url(#logoGlow)" opacity="0.4"/>
    <text x="36" y="52" textAnchor="middle"
      fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="26"
      fill="url(#logoGrad)">FG</text>
  </svg>
);

const StartScreen = ({ onStart, hasExistingAudit }) => {
  const { t, isRTL } = useLanguage();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`start-screen screen ${loaded ? 'is-loaded' : ''}`}>
      <div className="start-bg-slash"/>
      <div className="start-bg-glow"/>

      <div className="lang-toggle-fixed"><LanguageToggle/></div>

      <div className="start-hero">
        <div className="start-logo-wrap">
          <div className="start-logo-ring"/>
          <FitGuardLogo/>
        </div>
        <h1 className="start-wordmark">FitGuard</h1>
        <p className="start-tagline">{t.start.tagline}</p>

        <div className="start-stats">
          <div className="stat-badge">
            <span className="stat-badge__value">3</span>
            <span className="stat-badge__label">{isRTL ? 'دقائق' : 'min'}</span>
          </div>
          <div className="start-stats-div"/>
          <div className="stat-badge">
            <span className="stat-badge__value">3</span>
            <span className="stat-badge__label">{isRTL ? 'مستويات' : 'tiers'}</span>
          </div>
          <div className="start-stats-div"/>
          <div className="stat-badge">
            <span className="stat-badge__value">AI</span>
            <span className="stat-badge__label">{isRTL ? 'تحليل' : 'form'}</span>
          </div>
        </div>
      </div>

      <div className="start-features-strip">
        {t.start.features.map((f, i) => (
          <div key={i} className="start-feature-pill">
            <span className="start-feature-pill__dot"/>
            <span>{f}</span>
          </div>
        ))}
      </div>

      <div className="start-body">
        <p className="start-description">{t.start.description}</p>
      </div>

      <div className="start-cta">
        <Button variant="primary" size="xl" fullWidth onClick={() => onStart(false)}>
          {t.start.cta}
        </Button>
        <p className="start-time">{t.start.time}</p>
        {hasExistingAudit && (
          <Button variant="ghost" size="md" fullWidth onClick={() => onStart(true)}>
            {t.start.continueAudit}
          </Button>
        )}
      </div>

      <div className="start-footer">
        <p className="start-footer__text">{t.start.footer}</p>
      </div>
    </div>
  );
};

export default StartScreen;
