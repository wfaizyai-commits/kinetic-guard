import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import {
  awardXP, recordWorkoutDay, calcWorkoutStreak, getLevel,
  loadXP, recordFullWorkout, getFullWorkouts,
  getTotalWorkouts, getFormCheckCount, getBestReadiness,
  evaluateBadges,
} from '../lib/gamification';
import { launchConfetti } from '../lib/confetti';
import { useCountUp } from '../lib/countUp';
import './PostWorkoutSummary.css';

const StatCard = ({ value, label, color = 'var(--cyan)', icon }) => (
  <div className="summary-stat">
    <span className="summary-stat__icon">{icon}</span>
    <span className="summary-stat__value" style={{ color }}>{value}</span>
    <span className="summary-stat__label">{label}</span>
  </div>
);

const PostWorkoutSummary = ({ exercises, readinessScore, totalExercises, onDone }) => {
  const { t, lang } = useLanguage();
  const isAR = lang === 'ar';
  const [animate, setAnimate]         = useState(false);
  const [xpResult, setXpResult]       = useState(null);
  const [newBadges, setNewBadges]     = useState([]);
  const [showBadge, setShowBadge]     = useState(null);

  const totalSets     = exercises ? exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0) : 0;
  const exerciseCount = exercises ? exercises.length : 0;
  const allDone       = totalExercises ? exerciseCount >= totalExercises : true;
  const safetyScore   = Math.min(100, Math.round((readinessScore || 70) * 0.9 + 10));

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // ── Award XP once on mount ─────────────────────────────────────────────
  useEffect(() => {
    const streak = calcWorkoutStreak();
    if (allDone) recordFullWorkout();
    recordWorkoutDay();
    const newStreak    = calcWorkoutStreak();
    const result       = awardXP({
      completedCount:  exerciseCount,
      totalCount:      totalExercises || exerciseCount,
      readinessScore:  readinessScore || 70,
      streak:          newStreak,
      usedFormCheck:   false,
    });
    setXpResult({ ...result, streak: newStreak });

    // Badge evaluation
    const xpData = loadXP();
    const { newlyEarned } = evaluateBadges({
      totalWorkouts: getTotalWorkouts(),
      streak:        newStreak,
      formChecks:    getFormCheckCount(),
      xpLevel:       getLevel(xpData.total).level,
      bestReadiness: getBestReadiness(),
      fullWorkouts:  getFullWorkouts(),
    });
    if (newlyEarned.length) {
      setNewBadges(newlyEarned);
      setTimeout(() => {
        setShowBadge(newlyEarned[0]);
        launchConfetti();
      }, 800);
    } else if (allDone) {
      // Confetti even without new badge when all exercises done
      setTimeout(() => launchConfetti(), 600);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Count-up animations for stats
  const animSafety  = useCountUp(safetyScore,   900, animate);
  const animEx      = useCountUp(exerciseCount,  600, animate);
  const animSets    = useCountUp(totalSets,       700, animate);

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
            value={animSafety}
            label={t.summary.safetyScore}
            color="var(--green)"
            icon="🛡️"
          />
          <StatCard
            value={animEx}
            label={t.summary.exercises}
            color="var(--cyan)"
            icon="💪"
          />
          <StatCard
            value={animSets}
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

        {/* ── XP earned card ── */}
        {xpResult && (
          <div className="summary-xp-card animate-fade-up" style={{ animationDelay: '0.42s' }}>
            <div className="summary-xp-earned">
              <span className="summary-xp-plus">+{xpResult.earned}</span>
              <span className="summary-xp-label">{isAR ? 'نقطة خبرة' : 'XP earned'}</span>
            </div>
            <div className="summary-xp-right">
              <div className="summary-xp-level">
                <span className="summary-xp-lvl-num">Lv.{xpResult.newLevel.level}</span>
                <span className="summary-xp-lvl-title">
                  {isAR ? xpResult.newLevel.titleAr : xpResult.newLevel.titleEn}
                </span>
              </div>
              <div className="summary-xp-bar">
                <div
                  className="summary-xp-bar-fill"
                  style={{ width: animate ? `${xpResult.newLevel.progress}%` : '0%' }}
                />
              </div>
              {xpResult.streak > 1 && (
                <span className="summary-xp-streak">
                  🔥 {xpResult.streak}{isAR ? ' يوم متواصل' : '-day streak'}
                </span>
              )}
            </div>
            {xpResult.leveledUp && (
              <div className="summary-levelup-badge animate-scale-in">
                {isAR ? '🎉 ارتقيت مستوى!' : '🎉 Level Up!'}
              </div>
            )}
          </div>
        )}

        {/* ── New badge popup ── */}
        {showBadge && (
          <div className="summary-badge-popup animate-scale-in" style={{ animationDelay: '0s' }}>
            <span style={{ fontSize: 36 }}>{showBadge.icon}</span>
            <div>
              <p className="summary-badge-popup__title">
                {isAR ? '🏅 وسام جديد!' : '🏅 New Badge!'}
              </p>
              <p className="summary-badge-popup__name">
                {isAR ? showBadge.labelAr : showBadge.labelEn}
              </p>
            </div>
          </div>
        )}

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
