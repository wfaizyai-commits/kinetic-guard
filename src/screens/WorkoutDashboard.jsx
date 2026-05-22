import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import './WorkoutDashboard.css';

const WORKOUTS_BY_TIER = {
  novice: {
    en: [
      { id: 1, name: 'Bodyweight Squat', sets: 3, reps: '12–15', rest: '60s', muscle: 'Legs', icon: '🦵' },
      { id: 2, name: 'Wall Push-Up', sets: 3, reps: '10–12', rest: '60s', muscle: 'Chest', icon: '💪' },
      { id: 3, name: 'Glute Bridge', sets: 3, reps: '15', rest: '45s', muscle: 'Glutes', icon: '🍑' },
      { id: 4, name: 'Dead Bug', sets: 2, reps: '8 each', rest: '60s', muscle: 'Core', icon: '🪲' },
    ],
    ar: [
      { id: 1, name: 'قرفصاء بوزن الجسم', sets: 3, reps: '12–15', rest: '60ث', muscle: 'أرجل', icon: '🦵' },
      { id: 2, name: 'تمرين الضغط على الجدار', sets: 3, reps: '10–12', rest: '60ث', muscle: 'صدر', icon: '💪' },
      { id: 3, name: 'جسر الأرداف', sets: 3, reps: '15', rest: '45ث', muscle: 'أرداف', icon: '🍑' },
      { id: 4, name: 'الدودة الميتة', sets: 2, reps: '8 لكل جانب', rest: '60ث', muscle: 'جذع', icon: '🪲' },
    ]
  },
  intermediate: {
    en: [
      { id: 1, name: 'Goblet Squat', sets: 4, reps: '10', rest: '90s', muscle: 'Legs', icon: '🦵' },
      { id: 2, name: 'Push-Up', sets: 4, reps: '12', rest: '60s', muscle: 'Chest', icon: '💪' },
      { id: 3, name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '90s', muscle: 'Hamstrings', icon: '🔥' },
      { id: 4, name: 'Dumbbell Row', sets: 3, reps: '12 each', rest: '75s', muscle: 'Back', icon: '🏋️' },
      { id: 5, name: 'Plank', sets: 3, reps: '30–45s', rest: '45s', muscle: 'Core', icon: '⚡' },
    ],
    ar: [
      { id: 1, name: 'قرفصاء الكأس', sets: 4, reps: '10', rest: '90ث', muscle: 'أرجل', icon: '🦵' },
      { id: 2, name: 'تمرين الضغط', sets: 4, reps: '12', rest: '60ث', muscle: 'صدر', icon: '💪' },
      { id: 3, name: 'رفع أرومانية', sets: 3, reps: '10', rest: '90ث', muscle: 'أوتار العرقوب', icon: '🔥' },
      { id: 4, name: 'تجديف بالدمبل', sets: 3, reps: '12 لكل جانب', rest: '75ث', muscle: 'ظهر', icon: '🏋️' },
      { id: 5, name: 'بلانك', sets: 3, reps: '30–45ث', rest: '45ث', muscle: 'جذع', icon: '⚡' },
    ]
  },
  advanced: {
    en: [
      { id: 1, name: 'Barbell Back Squat', sets: 5, reps: '5', rest: '3 min', muscle: 'Full Body', icon: '🏋️' },
      { id: 2, name: 'Bench Press', sets: 4, reps: '8', rest: '2 min', muscle: 'Chest', icon: '💪' },
      { id: 3, name: 'Deadlift', sets: 3, reps: '5', rest: '3 min', muscle: 'Full Body', icon: '🔥' },
      { id: 4, name: 'Pull-Up', sets: 4, reps: '8–10', rest: '90s', muscle: 'Back', icon: '⚡' },
      { id: 5, name: 'Overhead Press', sets: 4, reps: '8', rest: '2 min', muscle: 'Shoulders', icon: '🎯' },
    ],
    ar: [
      { id: 1, name: 'قرفصاء بالبار', sets: 5, reps: '5', rest: '3 دقائق', muscle: 'الجسم كله', icon: '🏋️' },
      { id: 2, name: 'ضغط البنش', sets: 4, reps: '8', rest: 'دقيقتان', muscle: 'صدر', icon: '💪' },
      { id: 3, name: 'رفع ميت', sets: 3, reps: '5', rest: '3 دقائق', muscle: 'الجسم كله', icon: '🔥' },
      { id: 4, name: 'سحب علوي', sets: 4, reps: '8–10', rest: '90ث', muscle: 'ظهر', icon: '⚡' },
      { id: 5, name: 'ضغط فوق الرأس', sets: 4, reps: '8', rest: 'دقيقتان', muscle: 'أكتاف', icon: '🎯' },
    ]
  }
};

const WorkoutDashboard = ({ tier, readinessData, onStartExercise, onViewExercise }) => {
  const { t, lang, isRTL } = useLanguage();
  const tierKey = (tier || 'novice').toLowerCase();
  const tierWorkouts = WORKOUTS_BY_TIER[tierKey] || WORKOUTS_BY_TIER.novice;
  const exercises = tierWorkouts[lang] || tierWorkouts.en;
  const score = readinessData?.readinessScore || 75;

  const scoreColor = score >= 70 ? 'var(--green)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';
  const tierName = t.tiers[tierKey]?.name || tierKey;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;

  const greeting = isRTL ? 'تدريب اليوم' : "Today's Training";

  return (
    <div className="dashboard-screen screen">
      <div className="lang-toggle-fixed"><LanguageToggle/></div>

      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header animate-fade-up">
          <div>
            <p className="dashboard-greeting">{greeting}</p>
            <h1 className="dashboard-title">{t.dashboard.title}</h1>
            <p className="dashboard-tier-badge">
              <span className="dashboard-tier-dot"/>
              {tierName}
            </p>
          </div>
          <div className="dashboard-readiness-ring">
            <svg viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
              <circle cx="32" cy="32" r="28" fill="none"
                stroke={scoreColor} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                transform="rotate(-90 32 32)"
                style={{ filter: `drop-shadow(0 0 5px ${scoreColor})` }}
              />
            </svg>
            <div className="dashboard-readiness-center">
              <span className="dashboard-readiness-value" style={{ color: scoreColor }}>{score}</span>
            </div>
            <p className="dashboard-readiness-label">{t.dashboard.readiness}</p>
          </div>
        </div>

        {/* Orange today banner */}
        <div className="dashboard-today-banner animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="dashboard-today-banner__text">
            <span className="dashboard-today-banner__label">{t.dashboard.todayWorkout}</span>
            <span className="dashboard-today-banner__count">
              {exercises.length} {t.dashboard.exercises}
            </span>
          </div>
          <div className="dashboard-today-banner__arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Exercise list */}
        <div>
          <p className="dashboard-section-title">
            {isRTL ? 'التمارين' : 'EXERCISES'}
          </p>
          <div className="dashboard-exercises">
            {exercises.map((ex, i) => (
              <button
                key={ex.id}
                type="button"
                className="exercise-row"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                onClick={() => onViewExercise && onViewExercise(ex, exercises)}
              >
                <span className="exercise-row__num">{i + 1}</span>
                <span className="exercise-row__icon">{ex.icon}</span>
                <div className="exercise-row__info">
                  <span className="exercise-row__name">{ex.name}</span>
                  <span className="exercise-row__meta">
                    {ex.sets} {t.exercise.sets} · {ex.reps} {t.exercise.reps} · {ex.rest} {t.exercise.rest}
                  </span>
                </div>
                <div className="exercise-row__right">
                  <span className="muscle-chip">{ex.muscle}</span>
                  <svg className="exercise-row__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start CTA */}
        <div className="dashboard-cta animate-fade-up" style={{ animationDelay: '0.35s' }}>
          <Button variant="primary" size="xl" fullWidth
            onClick={() => onStartExercise && onStartExercise(exercises[0], exercises)}>
            {t.dashboard.start}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDashboard;
