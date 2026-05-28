import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { GenderProvider, useGender } from './i18n/GenderContext';

import StartScreen from './screens/StartScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReadinessScreen from './screens/ReadinessScreen';
import WorkoutDashboard from './screens/WorkoutDashboard';
import ExerciseDetail from './screens/ExerciseDetail';
import FormCheckAI from './screens/FormCheckAI';
import PostWorkoutSummary from './screens/PostWorkoutSummary';
import AuthScreen from './screens/AuthScreen';
import PeriodTrackerScreen from './screens/PeriodTrackerScreen';
import GymTrackerScreen from './screens/GymTrackerScreen';

import useAuth from './hooks/useAuth';
import { syncProfileTier, syncAssessmentResult, syncWorkoutSession, hydrateRemoteFromLocal } from './lib/sync';
import {
  setupNotifications,
  loadNotifProfile,
  saveNotifProfile,
  rescheduleNotifications,
} from './lib/notifications';

// ── Storage helpers ──────────────────────────────────────────────────────────
const AUDIT_KEY = 'fitguard_audit_v1';

const saveAudit = (data) => {
  try { localStorage.setItem(AUDIT_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
};

const loadAudit = () => {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
};

const clearAudit = () => {
  try { localStorage.removeItem(AUDIT_KEY); } catch (e) { /* ignore */ }
};

// ── Scoring ──────────────────────────────────────────────────────────────────
const computeTierAndScore = (answers) => {
  let score = 60;
  const flags = [];

  // Active history (1-5 scale)
  if (answers.activeHistory >= 4) score += 15;
  else if (answers.activeHistory >= 3) score += 8;
  else score -= 5;

  // Injury flags
  if (answers.injuryFlags?.includes('jointPain')) { score -= 12; flags.push('joint_pain'); }
  if (answers.injuryFlags?.includes('priorSurgery')) { score -= 10; flags.push('prior_surgery'); }

  // Mobility
  if (answers.mobilityFlags?.includes('canTouchToes')) score += 5;
  if (answers.mobilityFlags?.includes('canFullSquat')) score += 5;
  if (answers.mobilityFlags?.includes('hasPostureIssues')) { score -= 8; flags.push('posture_issues'); }
  if (!answers.mobilityFlags?.includes('canTouchToes') && !answers.mobilityFlags?.includes('canFullSquat')) {
    flags.push('limited_mobility');
  }

  // Daily load
  if (answers.dailyLoad === 'demanding') score += 8;
  else if (answers.dailyLoad === 'sedentary') { score -= 5; flags.push('sedentary_lifestyle'); }

  score = Math.max(10, Math.min(100, score));

  let tier;
  if (score >= 75) tier = 'advanced';
  else if (score >= 50) tier = 'intermediate';
  else tier = 'novice';

  return { tier, safetyScore: score, riskFlags: flags };
};

// ── Screens enum ─────────────────────────────────────────────────────────────
const SCREENS = {
  AUTH: 'auth',
  START: 'start',
  ASSESSMENT: 'assessment',
  RESULTS: 'results',
  READINESS: 'readiness',
  DASHBOARD: 'dashboard',
  EXERCISE: 'exercise',
  FORM_CHECK: 'form_check',
  SUMMARY: 'summary',
  PERIOD_TRACKER: 'period_tracker',
  GYM_TRACKER: 'gym_tracker',
};

// ── Age Setup Modal ───────────────────────────────────────────────────────────
function AgeSetupModal({ onConfirm, lang }) {
  const isAR = lang === 'ar';
  const [age, setAge] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(age, 10);
    if (parsed >= 10 && parsed <= 100) onConfirm(parsed);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 24px',
        width: '100%', maxWidth: '360px',
        textAlign: isAR ? 'right' : 'left',
        direction: isAR ? 'rtl' : 'ltr',
      }}>
        <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '16px' }}>🎯</div>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 900,
          color: 'var(--text-primary)', marginBottom: '10px', textAlign: 'center',
        }}>
          {isAR ? 'خصّص تجربتك' : 'Personalise Your Tips'}
        </h2>
        <p style={{
          fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6,
          marginBottom: '24px', textAlign: 'center',
        }}>
          {isAR
            ? 'أدخل عمرك لنرسل لك نصائح صحية مناسبة لك مرتين يومياً'
            : 'Enter your age so we can send you personalised health tips twice a day'}
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            ref={inputRef}
            type="number"
            min="10" max="100"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder={isAR ? 'عمرك (مثال: 28)' : 'Your age (e.g. 28)'}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              fontSize: '18px',
              color: 'var(--text-primary)',
              textAlign: 'center',
              outline: 'none',
              width: '100%',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
            }}
          />
          <button
            type="submit"
            disabled={!age || parseInt(age) < 10 || parseInt(age) > 100}
            style={{
              background: 'var(--orange)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              opacity: (!age || parseInt(age) < 10 || parseInt(age) > 100) ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {isAR ? 'تأكيد ←' : 'Confirm →'}
          </button>
        </form>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
          {isAR ? '🔒 بياناتك تُحفظ على جهازك فقط' : '🔒 Stored locally on your device only'}
        </p>
      </div>
    </div>
  );
}

// ── Gender Setup Modal ────────────────────────────────────────────────────────
function GenderSetupModal({ onConfirm, lang }) {
  const isAR = lang === 'ar';

  const cards = [
    {
      key: 'male',
      icon: '💪',
      label: isAR ? 'ذكر' : 'Male',
      sub:   isAR ? 'تمارين القوة وبناء الجسم' : 'Strength & muscle building',
      color: '#FF6B00',
      bg:    'rgba(255,107,0,0.12)',
    },
    {
      key: 'female',
      icon: '🌸',
      label: isAR ? 'أنثى' : 'Female',
      sub:   isAR ? 'تمارين مخصصة + متتبع الدورة' : 'Women\'s program + cycle tracker',
      color: '#B06AFF',
      bg:    'rgba(176,106,255,0.12)',
    },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 24px 28px',
        width: '100%', maxWidth: '380px',
        textAlign: 'center',
        direction: isAR ? 'rtl' : 'ltr',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏋️</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {isAR ? 'اختر برنامجك' : 'Choose Your Program'}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          {isAR ? 'سنخصص تجربتك بالكامل بناءً على اختيارك' : "We'll personalise your entire experience based on this"}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          {cards.map(c => (
            <button key={c.key} onClick={() => onConfirm(c.key)} style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              padding: '24px 12px',
              background: c.bg,
              border: `2px solid ${c.color}`,
              borderRadius: 'var(--radius-xl)',
              cursor: 'pointer',
              transition: 'transform 0.15s, opacity 0.15s',
            }}>
              <span style={{ fontSize: '36px' }}>{c.icon}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 900, color: c.color }}>
                {c.label}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {c.sub}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const { gender, setGender } = useGender();

  const [screen, setScreen] = useState(SCREENS.AUTH);
  const [auditResult, setAuditResult] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentExercises, setCurrentExercises] = useState([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const hasExistingAudit = !!loadAudit();

  // Sync screen state whenever auth resolves or user changes
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      const saved = loadAudit();
      if (saved) setAuditResult(saved);
      // Push any locally-saved audit to Supabase now that we have a user
      hydrateRemoteFromLocal(user.id, loadAudit());
      setScreen(prev => prev === SCREENS.AUTH ? SCREENS.START : prev);

      // Gender: ask once on first login
      const savedGender = localStorage.getItem('fitguard_gender_v1');
      if (!savedGender) setShowGenderModal(true);

      // Notifications: ask for age on first login, otherwise refresh schedule
      const profile = loadNotifProfile();
      if (!profile.age) {
        setShowAgeModal(true);
      } else {
        // Silently refresh the 14-day schedule (no permission dialog if already granted)
        setupNotifications({ lang: profile.lang || lang, age: profile.age }).catch(() => {});
      }
    } else {
      setScreen(SCREENS.AUTH);
    }
  }, [user, authLoading]);

  // Apply female-theme to <body> so background + scrollbar also get the purple tint
  useEffect(() => {
    if (gender === 'female') {
      document.body.classList.add('female-theme');
      document.documentElement.classList.add('female-theme');
    } else {
      document.body.classList.remove('female-theme');
      document.documentElement.classList.remove('female-theme');
    }
  }, [gender]);

  // Re-schedule when user switches language
  const langRef = useRef(lang);
  useEffect(() => {
    if (langRef.current === lang) return; // skip initial mount
    langRef.current = lang;
    const profile = loadNotifProfile();
    if (user && profile.age) {
      rescheduleNotifications({ lang, age: profile.age }).catch(() => {});
    }
  }, [lang, user]);

  const handleAgeConfirm = (age) => {
    const profile = loadNotifProfile();
    saveNotifProfile({ ...profile, age, lang });
    setShowAgeModal(false);
    setupNotifications({ lang, age }).catch(() => {});
  };

  // Show nothing while checking session
  if (authLoading) return null;

  const handleAuthenticated = (authUser) => {
    // useAuth + useEffect above handle this automatically,
    // but AuthScreen still calls this prop — keep it as a no-op guard.
    if (authUser) setScreen(SCREENS.START);
  };

  const handleStart = (continueExisting) => {
    if (continueExisting) {
      const saved = loadAudit();
      if (saved) {
        setAuditResult(saved);
        setScreen(SCREENS.READINESS);
        return;
      }
    }
    clearAudit();
    setAuditResult(null);
    setScreen(SCREENS.ASSESSMENT);
  };

  const handleAssessmentComplete = async (answers) => {
    const result = computeTierAndScore(answers);
    saveAudit(result);
    setAuditResult(result);
    setScreen(SCREENS.RESULTS);

    // Persist to Supabase in the background (non-blocking)
    if (user) {
      syncProfileTier(user.id, result);
      syncAssessmentResult(user.id, answers, result);
    }
  };

  const handleStartProgram = () => {
    setScreen(SCREENS.READINESS);
  };

  const handleRetakeAssessment = () => {
    clearAudit();
    setAuditResult(null);
    setScreen(SCREENS.ASSESSMENT);
  };

  const handleReadinessProceed = (data) => {
    setReadinessData(data);
    setCompletedExercises([]);
    setScreen(SCREENS.DASHBOARD);
  };

  const handleStartExercise = (exercise, exercises) => {
    const idx = exercises.indexOf(exercise);
    setCurrentExercise(exercise);
    setCurrentExercises(exercises);
    setExerciseIndex(idx >= 0 ? idx : 0);
    setScreen(SCREENS.EXERCISE);
  };

  const handleExerciseComplete = () => {
    const nextIndex = exerciseIndex + 1;
    setCompletedExercises(prev => [...prev, currentExercise]);
    if (nextIndex < currentExercises.length) {
      setCurrentExercise(currentExercises[nextIndex]);
      setExerciseIndex(nextIndex);
    } else {
      setScreen(SCREENS.SUMMARY);
    }
  };

  const handleFormCheck = () => {
    setScreen(SCREENS.FORM_CHECK);
  };

  const handleFormCheckBack = () => {
    setScreen(SCREENS.EXERCISE);
  };

  const handleSummaryDone = () => {
    // Save workout session to Supabase (non-blocking)
    if (user) {
      syncWorkoutSession(user.id, {
        tier:               auditResult?.tier || 'novice',
        completedExercises,
        readinessData,
      });
    }
    setCompletedExercises([]);
    setReadinessData(null);
    setScreen(SCREENS.DASHBOARD);
  };

  const handleGenderConfirm = (g) => {
    setGender(g);
    setShowGenderModal(false);
  };

  const handleChangeGender = () => {
    setShowGenderModal(true);
  };

  // Modal overlays
  const ageModalOverlay    = showAgeModal    && <AgeSetupModal    lang={lang} onConfirm={handleAgeConfirm} />;
  const genderModalOverlay = showGenderModal && <GenderSetupModal lang={lang} onConfirm={handleGenderConfirm} />;

  // Root class — applies female-theme CSS variable overrides
  const rootClass = gender === 'female' ? 'female-theme' : '';

  switch (screen) {
    case SCREENS.AUTH:
      return (
        <div className={rootClass}>
          <AuthScreen onAuthenticated={handleAuthenticated} />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );

    case SCREENS.START:
      return (
        <div className={rootClass}>
          <StartScreen onStart={handleStart} hasExistingAudit={hasExistingAudit} />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );

    case SCREENS.ASSESSMENT:
      return (
        <div className={rootClass}>
          <AssessmentScreen
            onComplete={handleAssessmentComplete}
            onBack={() => setScreen(SCREENS.START)}
          />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );

    case SCREENS.RESULTS:
      return auditResult ? (
        <div className={rootClass}>
          <ResultsScreen
            tier={auditResult.tier}
            safetyScore={auditResult.safetyScore}
            riskFlags={auditResult.riskFlags}
            onStart={handleStartProgram}
            onRetake={handleRetakeAssessment}
          />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      ) : null;

    case SCREENS.READINESS:
      return (
        <div className={rootClass}>
          <ReadinessScreen
            tier={auditResult?.tier || 'novice'}
            onProceed={handleReadinessProceed}
          />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );

    case SCREENS.DASHBOARD:
      return (
        <div className={rootClass}>
          <WorkoutDashboard
            tier={auditResult?.tier || 'novice'}
            riskFlags={auditResult?.riskFlags || []}
            readinessData={readinessData}
            onStartExercise={handleStartExercise}
            onViewExercise={handleStartExercise}
            onOpenCycleTracker={() => setScreen(SCREENS.PERIOD_TRACKER)}
            onChangeGender={handleChangeGender}
            onOpenGymTracker={() => setScreen(SCREENS.GYM_TRACKER)}
          />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );

    case SCREENS.PERIOD_TRACKER:
      return (
        <div className={rootClass}>
          <PeriodTrackerScreen onBack={() => setScreen(SCREENS.DASHBOARD)} />
        </div>
      );

    case SCREENS.GYM_TRACKER:
      return (
        <div className={rootClass}>
          <GymTrackerScreen onBack={() => setScreen(SCREENS.DASHBOARD)} />
        </div>
      );

    case SCREENS.EXERCISE:
      return currentExercise ? (
        <div className={rootClass}>
          <ExerciseDetail
            exercise={currentExercise}
            allExercises={currentExercises}
            exerciseIndex={exerciseIndex}
            onComplete={handleExerciseComplete}
            onBack={() => setScreen(SCREENS.DASHBOARD)}
            onFormCheck={handleFormCheck}
          />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      ) : null;

    case SCREENS.FORM_CHECK:
      return (
        <div className={rootClass}>
          <FormCheckAI exercise={currentExercise} onBack={handleFormCheckBack} />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );

    case SCREENS.SUMMARY:
      return (
        <div className={rootClass}>
          <PostWorkoutSummary
            exercises={currentExercises}
            readinessScore={readinessData?.readinessScore || 70}
            onDone={handleSummaryDone}
          />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );

    default:
      return (
        <div className={rootClass}>
          <StartScreen onStart={handleStart} hasExistingAudit={hasExistingAudit} />
          {ageModalOverlay}
          {genderModalOverlay}
        </div>
      );
  }
}

function App() {
  return (
    <LanguageProvider>
      <GenderProvider>
        <AppInner />
      </GenderProvider>
    </LanguageProvider>
  );
}

export default App;
