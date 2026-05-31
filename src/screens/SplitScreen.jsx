import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ExerciseImage from '../components/ExerciseImage';
import MuscleMap from '../components/MuscleMap';
import { BRO_SPLIT } from '../lib/workoutSplits';
import { applyInjuryMods, FLAG_INFO } from '../lib/injuryMods';
import { musclesFor, MUSCLE_LABELS } from '../lib/muscles';
import './SplitScreen.css';

/**
 * SplitScreen — gym-focused training split (Bro Split).
 * Day picker (Chest&Triceps, Back&Biceps, …) → exercise list with image,
 * muscle, and sets×reps, matching how the user actually trains in the gym.
 *
 * Safety layer still applies: a readiness note adjusts intensity guidance,
 * and injury risk flags swap exercises automatically via injuryMods.
 */
const SplitScreen = ({ onBack, onStartGym, riskFlags = [], readinessScore = 75 }) => {
  const { lang, isRTL } = useLanguage();
  const [dayIdx, setDayIdx] = useState(0);

  const split = BRO_SPLIT;
  const day = split.days[dayIdx];

  // Apply injury-aware substitutions to this day's exercises (safety moat).
  const namedForMods = day.exercises.map(e => ({ ...e, name: e.nameEn }));
  const { warnings } = applyInjuryMods(namedForMods, riskFlags, lang);

  // Readiness → intensity guidance (the safety layer, gym-friendly wording).
  const intensity = readinessScore >= 70
    ? { en: 'High readiness — push your working sets today.', ar: 'جاهزية عالية — اضغط في سيتاتك اليوم.', cls: 'good' }
    : readinessScore >= 45
      ? { en: 'Moderate — drop ~10% load, keep form tight.', ar: 'متوسطة — خفّف ١٠٪ تقريباً وركّز على الأداء.', cls: 'warn' }
      : { en: 'Low readiness — light technique day or rest.', ar: 'منخفضة — يوم تقنية خفيف أو راحة.', cls: 'low' };

  return (
    <div className="split-screen screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="lang-toggle-fixed"><LanguageToggle /></div>

      {/* Header */}
      <div className="split-header">
        <button type="button" className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d={isRTL ? 'M8 4l6 6-6 6' : 'M12 4L6 10l6 6'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="split-header__titles">
          <span className="split-header__name">{isRTL ? split.nameAr : split.nameEn}</span>
          <span className="split-header__sub">{isRTL ? split.descAr : split.descEn}</span>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Day picker */}
      <div className="split-days">
        {split.days.map((d, i) => (
          <button
            key={d.id}
            className={`split-day-pill ${i === dayIdx ? 'split-day-pill--active' : ''}`}
            onClick={() => setDayIdx(i)}
          >
            <span className="split-day-pill__n">{isRTL ? `يوم ${i + 1}` : `Day ${i + 1}`}</span>
            <span className="split-day-pill__t">{d.icon}</span>
          </button>
        ))}
      </div>

      <div className="split-scroll">
        {/* Day title */}
        <div className="split-day-title animate-fade-up">
          <span className="split-day-title__icon">{day.icon}</span>
          <div>
            <h1>{isRTL ? `يوم ${dayIdx + 1}: ${day.titleAr}` : `Day ${dayIdx + 1}: ${day.titleEn}`}</h1>
            <p>{day.exercises.length} {isRTL ? 'تمارين' : 'exercises'}</p>
          </div>
        </div>

        {/* Readiness intensity note (safety layer) */}
        <div className={`split-intensity split-intensity--${intensity.cls} animate-fade-up`}>
          <span className="split-intensity__dot" />
          <span>{isRTL ? intensity.ar : intensity.en}</span>
        </div>

        {/* Injury substitution note */}
        {warnings.length > 0 && (
          <div className="split-injury animate-fade-up">
            <span>⚠️</span>
            <span>
              {isRTL ? 'تم تعديل بعض التمارين لسلامتك:' : 'Some moves adjusted for your safety:'}{' '}
              {warnings.map(w => (isRTL ? FLAG_INFO[w.flag]?.labelAr : FLAG_INFO[w.flag]?.labelEn)).join('، ')}
            </span>
          </div>
        )}

        {/* Exercise cards */}
        <div className="split-ex-list">
          {day.exercises.map((ex, i) => {
            const { primary } = musclesFor(ex.img);
            const targetNames = primary
              .map(m => (isRTL ? MUSCLE_LABELS[m]?.ar : MUSCLE_LABELS[m]?.en))
              .filter(Boolean)
              .join('، ');
            return (
              <div key={i} className="split-ex-card animate-fade-up" style={{ animationDelay: `${0.04 * i}s` }}>
                <div className="split-ex-thumb">
                  <ExerciseImage img={ex.img} exerciseName={ex.nameEn} />
                </div>
                <div className="split-ex-info">
                  <span className="split-ex-name">{isRTL ? ex.nameAr : ex.nameEn}</span>
                  <span className="split-ex-sets">
                    <b>{ex.sets}</b> {isRTL ? 'مجموعات' : 'sets'} × <b>{ex.reps}</b> {isRTL ? 'تكرار' : 'reps'}
                  </span>
                  {targetNames && (
                    <span className="split-ex-target">
                      <span className="split-ex-target__dot" />
                      {isRTL ? 'العضلة المستهدفة: ' : 'Target: '}{targetNames}
                    </span>
                  )}
                </div>
                {/* Anatomically-correct muscle highlight (data-driven, always right) */}
                <div className="split-ex-muscle-map">
                  <MuscleMap img={ex.img} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA → log this day in the gym tracker */}
        <button className="split-start-btn" onClick={onStartGym}>
          {isRTL ? '🏋️ سجّل هذا التمرين في الجيم' : '🏋️ Log this in Gym Tracker'}
        </button>
      </div>
    </div>
  );
};

export default SplitScreen;
