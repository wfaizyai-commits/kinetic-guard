import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

import StartScreen from './screens/StartScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReadinessScreen from './screens/ReadinessScreen';
import WorkoutDashboard from './screens/WorkoutDashboard';
import ExerciseDetail from './screens/ExerciseDetail';
import FormCheckAI from './screens/FormCheckAI';
import PostWorkoutSummary from './screens/PostWorkoutSummary';
import AuthScreen from './screens/AuthScreen';

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

// ── App ───────────────────────────────────────────────────────────────────────
function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLanguage();

  const [screen, setScreen] = useState(SCREENS.AUTH);
  const [auditResult, setAuditResult] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentExercises, setCurrentExercises] = useState([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showAgeModal, setShowAgeModal] = useState(false);
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

  // Age modal overlay — shown on top of whatever screen is active
  const ageModalOverlay = showAgeModal && (
    <AgeSetupModal lang={lang} onConfirm={handleAgeConfirm} />
  );

  switch (screen) {
    case SCREENS.AUTH:
      return (
        <>
          <AuthScreen onAuthenticated={handleAuthenticated} />
          {ageModalOverlay}
        </>
      );

    case SCREENS.START:
      return (
        <>
          <StartScreen onStart={handleStart} hasExistingAudit={hasExistingAudit} />
          {ageModalOverlay}
        </>
      );

    case SCREENS.ASSESSMENT:
      return (
        <>
          <AssessmentScreen
            onComplete={handleAssessmentComplete}
            onBack={() => setScreen(SCREENS.START)}
          />
          {ageModalOverlay}
        </>
      );

    case SCREENS.RESULTS:
      return auditResult ? (
        <>
          <ResultsScreen
            tier={auditResult.tier}
            safetyScore={auditResult.safetyScore}
            riskFlags={auditResult.riskFlags}
            onStart={handleStartProgram}
            onRetake={handleRetakeAssessment}
          />
          {ageModalOverlay}
        </>
      ) : null;

    case SCREENS.READINESS:
      return (
        <>
          <ReadinessScreen
            tier={auditResult?.tier || 'novice'}
            onProceed={handleReadinessProceed}
          />
          {ageModalOverlay}
        </>
      );

    case SCREENS.DASHBOARD:
      return (
        <>
          <WorkoutDashboard
            tier={auditResult?.tier || 'novice'}
            readinessData={readinessData}
            onStartExercise={handleStartExercise}
            onViewExercise={handleStartExercise}
          />
          {ageModalOverlay}
        </>
      );

    case SCREENS.EXERCISE:
      return currentExercise ? (
        <>
          <ExerciseDetail
            exercise={currentExercise}
            allExercises={currentExercises}
            exerciseIndex={exerciseIndex}
            onComplete={handleExerciseComplete}
            onBack={() => setScreen(SCREENS.DASHBOARD)}
            onFormCheck={handleFormCheck}
          />
          {ageModalOverlay}
        </>
      ) : null;

    case SCREENS.FORM_CHECK:
      return (
        <>
          <FormCheckAI exercise={currentExercise} onBack={handleFormCheckBack} />
          {ageModalOverlay}
        </>
      );

    case SCREENS.SUMMARY:
      return (
        <>
          <PostWorkoutSummary
            exercises={currentExercises}
            readinessScore={readinessData?.readinessScore || 70}
            onDone={handleSummaryDone}
          />
          {ageModalOverlay}
        </>
      );

    default:
      return (
        <>
          <StartScreen onStart={handleStart} hasExistingAudit={hasExistingAudit} />
          {ageModalOverlay}
        </>
      );
  }
}

function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}

export default App;
