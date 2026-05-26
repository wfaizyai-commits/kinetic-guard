import React, { useState, useEffect } from 'react';
import './App.css';
import { LanguageProvider } from './i18n/LanguageContext';

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

// ── App ───────────────────────────────────────────────────────────────────────
function AppInner() {
  const { user, loading: authLoading } = useAuth();

  const [screen, setScreen] = useState(SCREENS.AUTH);
  const [auditResult, setAuditResult] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentExercises, setCurrentExercises] = useState([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
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
    } else {
      setScreen(SCREENS.AUTH);
    }
  }, [user, authLoading]);

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

  switch (screen) {
    case SCREENS.AUTH:
      return (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      );

    case SCREENS.START:
      return (
        <StartScreen
          onStart={handleStart}
          hasExistingAudit={hasExistingAudit}
        />
      );

    case SCREENS.ASSESSMENT:
      return (
        <AssessmentScreen
          onComplete={handleAssessmentComplete}
          onBack={() => setScreen(SCREENS.START)}
        />
      );

    case SCREENS.RESULTS:
      return auditResult ? (
        <ResultsScreen
          tier={auditResult.tier}
          safetyScore={auditResult.safetyScore}
          riskFlags={auditResult.riskFlags}
          onStart={handleStartProgram}
          onRetake={handleRetakeAssessment}
        />
      ) : null;

    case SCREENS.READINESS:
      return (
        <ReadinessScreen
          tier={auditResult?.tier || 'novice'}
          onProceed={handleReadinessProceed}
        />
      );

    case SCREENS.DASHBOARD:
      return (
        <WorkoutDashboard
          tier={auditResult?.tier || 'novice'}
          readinessData={readinessData}
          onStartExercise={handleStartExercise}
          onViewExercise={handleStartExercise}
        />
      );

    case SCREENS.EXERCISE:
      return currentExercise ? (
        <ExerciseDetail
          exercise={currentExercise}
          allExercises={currentExercises}
          exerciseIndex={exerciseIndex}
          onComplete={handleExerciseComplete}
          onBack={() => setScreen(SCREENS.DASHBOARD)}
          onFormCheck={handleFormCheck}
        />
      ) : null;

    case SCREENS.FORM_CHECK:
      return (
        <FormCheckAI
          exercise={currentExercise}
          onBack={handleFormCheckBack}
        />
      );

    case SCREENS.SUMMARY:
      return (
        <PostWorkoutSummary
          exercises={currentExercises}
          readinessScore={readinessData?.readinessScore || 70}
          onDone={handleSummaryDone}
        />
      );

    default:
      return <StartScreen onStart={handleStart} hasExistingAudit={hasExistingAudit} />;
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
