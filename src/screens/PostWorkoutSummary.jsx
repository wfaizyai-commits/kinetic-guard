import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import './PostWorkoutSummary.css';

const StatCard = ({ value, label, color = 'var(--cyan)', icon }) => (
  <div className="summary-stat">
    <span className="summary-stat__icon">{icon}</span>
    <span className="summary-stat__value" style={{ color }}>{value}</span>
    <span className="summary-stat__label">{label}</span>
  </div>
);

const PostWorkoutSummary = ({ exercises, readinessScore, onDone }) => {
  const { t, lang } = useLanguage();
  const [animate, setAnimate] = useState(false);

  const totalSets = exercises
    ? exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0)
    : 0;
  const exerciseCount = exercises ? exercises.length : 0;
  const safetyScore = Math.min(100, Math.round((readinessScore || 70) * 0.9 + 10));

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="summary-screen screen">
      <div className="lang-toggle-fixed">
        <LanguageToggle />
      </div>

      <div className="summary-content">
        {/* Trophy hero */}
        <div className={['summary-hero', animate ? 'summary-hero--animated' : ''].filter(Boolean).join(' ')}>
          <div className="summary-trophy">
            <div className="summary-trophy__glow" />
            <span className="summary-trophy__emoji">🏆</span>
          </div>
          <h1 className="summary-title">{t.summary.title}</h1>
          <p className="summary-subtitle">
            {lang === 'ar'
              ? 'أحسنت! لقد أكملت تمرينك اليومي بنجاح.'
              : 'Outstanding work. Every rep is an investment in your future self.'}
          </p>
        </div>

        {/* Stats grid */}
        <div className="summary-stats animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <StatCard
            value={safetyScore}
            label={t.summary.safetyScore}
            color="var(--green)"
            icon="🛡️"
          />
          <StatCard
            value={exerciseCount}
            label={t.summary.exercises}
            color="var(--cyan)"
            icon="💪"
          />
          <StatCard
            value={totalSets}
            label={t.summary.sets}
            color="var(--purple)"
            icon="🔁"
          />
        </div>

        {/* Progress bar celebration */}
        <div className="summary-achievement animate-fade-up" style={{ animationDelay: '0.35s' }}>
          <div className="summary-achievement__header">
            <span className="summary-achievement__label">
              {lang === 'ar' ? 'أداء السلامة' : 'Safety Performance'}
            </span>
            <span className="summary-achievement__score" style={{ color: 'var(--green)' }}>
              {safetyScore}%
            </span>
          </div>
          <div className="summary-progress-track">
            <div
              className="summary-progress-fill"
              style={{ width: animate ? `${safetyScore}%` : '0%' }}
            />
            <div
              className="summary-progress-glow"
              style={{ left: animate ? `${safetyScore}%` : '0%' }}
            />
          </div>
        </div>

        {/* Next workout preview */}
        <div className="summary-next animate-fade-up" style={{ animationDelay: '0.45s' }}>
          <p className="summary-next__label">{t.summary.nextWorkout}</p>
          <div className="summary-next__card">
            <span className="summary-next__icon">📅</span>
            <div className="summary-next__info">
              <p className="summary-next__name">
                {lang === 'ar' ? 'تمرين الغد' : "Tomorrow's Session"}
              </p>
              <p className="summary-next__meta">
                {lang === 'ar'
                  ? `${exerciseCount} تمارين · نفس المستوى`
                  : `${exerciseCount} exercises · Same tier`}
              </p>
            </div>
            <span className="summary-next__badge">
              {lang === 'ar' ? 'جاهز' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Done button */}
        <div className="summary-cta animate-fade-up" style={{ animationDelay: '0.55s' }}>
          <Button variant="primary" size="xl" fullWidth onClick={onDone}>
            {t.summary.done} 🎯
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostWorkoutSummary;
