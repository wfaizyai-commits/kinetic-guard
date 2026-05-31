import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import ExerciseAnimation from '../components/ExerciseAnimation';
import './ExerciseDetail.css';

const SetTracker = ({ sets, completedSets, onCompleteSet }) => {
  return (
    <div className="set-tracker">
      {Array.from({ length: sets }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={['set-dot-btn', i < completedSets ? 'set-dot-btn--done' : ''].filter(Boolean).join(' ')}
          onClick={() => onCompleteSet(i + 1)}
        >
          {i < completedSets ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#00FF88" />
              <path d="M5.5 10L8.5 13L14.5 7" stroke="#08080E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="set-dot-num">{i + 1}</span>
          )}
        </button>
      ))}
    </div>
  );
};

const ExerciseDetail = ({ exercise, allExercises, exerciseIndex, onComplete, onBack }) => {
  const { t, lang } = useLanguage();
  const [completedSets, setCompletedSets] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(null);
  const [restCount, setRestCount] = useState(0);

  const handleCompleteSet = (setNum) => {
    if (setNum <= completedSets) return;
    const newCompleted = setNum;
    setCompletedSets(newCompleted);

    if (newCompleted < exercise.sets) {
      const restSeconds = parseInt(exercise.rest) || 60;
      setIsResting(true);
      setRestCount(restSeconds);
      const interval = setInterval(() => {
        setRestCount(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setRestTimer(interval);
    }
  };

  const skipRest = () => {
    if (restTimer) clearInterval(restTimer);
    setIsResting(false);
    setRestCount(0);
  };

  const allSetsComplete = completedSets >= exercise.sets;

  return (
    <div className="exercise-detail-screen screen">
      <div className="lang-toggle-fixed">
        <LanguageToggle />
      </div>

      {/* Header */}
      <div className="exercise-detail-header">
        <button type="button" className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t.exercise.back}</span>
        </button>
        <span className="exercise-detail-counter">
          {(exerciseIndex || 0) + 1} / {(allExercises || [exercise]).length}
        </span>
      </div>

      <div className="exercise-detail-content">
        {/* Title */}
        <div className="exercise-detail-hero animate-fade-up">
          <div className="exercise-detail-icon">{exercise.icon || '💪'}</div>
          <h1 className="exercise-detail-name">{exercise.name}</h1>
          <p className="exercise-detail-muscle">{exercise.muscle}</p>
        </div>

        {/* Exercise Animation */}
        <div className="exercise-anim-section animate-fade-up" style={{ animationDelay: '0.08s' }}>
          <ExerciseAnimation exerciseName={exercise.name} />
        </div>

        {/* Stats row */}
        <div className="exercise-stats animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="exercise-stat">
            <span className="exercise-stat__value">{exercise.sets}</span>
            <span className="exercise-stat__label">{t.exercise.sets}</span>
          </div>
          <div className="exercise-stat-divider" />
          <div className="exercise-stat">
            <span className="exercise-stat__value">{exercise.reps}</span>
            <span className="exercise-stat__label">{t.exercise.reps}</span>
          </div>
          <div className="exercise-stat-divider" />
          <div className="exercise-stat">
            <span className="exercise-stat__value">{exercise.rest}</span>
            <span className="exercise-stat__label">{t.exercise.rest}</span>
          </div>
        </div>

        {/* Set tracker */}
        <div className="exercise-sets-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <p className="exercise-sets-title">
            {completedSets} / {exercise.sets} {t.exercise.sets}
          </p>
          <SetTracker
            sets={exercise.sets}
            completedSets={completedSets}
            onCompleteSet={handleCompleteSet}
          />
        </div>

        {/* Rest timer overlay */}
        {isResting && (
          <div className="rest-timer animate-scale-in">
            <div className="rest-timer__ring">
              <span className="rest-timer__count">{restCount}</span>
              <span className="rest-timer__label">
                {lang === 'ar' ? 'ثانية راحة' : 'sec rest'}
              </span>
            </div>
            <button type="button" className="rest-timer__skip" onClick={skipRest}>
              {lang === 'ar' ? 'تخطي' : 'Skip Rest'}
            </button>
          </div>
        )}

        {/* Form check button */}
        <div className="exercise-detail-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
          {allSetsComplete ? (
            <Button variant="primary" size="lg" fullWidth onClick={() => onComplete && onComplete()}>
              {t.exercise.complete} ✓
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isResting}
              onClick={() => handleCompleteSet(completedSets + 1)}
            >
              {isResting
                ? (lang === 'ar' ? `راحة · ${restCount}ث` : `Rest · ${restCount}s`)
                : (lang === 'ar' ? `إتمام المجموعة ${completedSets + 1}` : `Complete Set ${completedSets + 1}`)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
