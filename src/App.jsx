import React, { useState, useEffect } from 'react';
import StartScreen from './screens/StartScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReadinessScreen from './screens/ReadinessScreen';
import WorkoutDashboard from './screens/WorkoutDashboard';
import ExerciseDetail from './screens/ExerciseDetail';
import FormCheckAI from './screens/FormCheckAI';
import PostWorkoutSummary from './screens/PostWorkoutSummary';
import { calculateTier } from './services/assessment';
import storage from './services/storage';
import './App.css';

function App() {
  const [screen, setScreen] = useState('start');
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [savedResult, setSavedResult] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);

  useEffect(() => {
    const saved = storage.load();
    if (saved?.result) setSavedResult(saved.result);
  }, []);

  const handleStartAssessment = () => setScreen('assessment');
  
  const handleCompleteAssessment = (responses) => {
    const result = calculateTier(responses);
    setAssessmentResult(result);
    storage.save({ responses, result });
    setScreen('results');
  };
  
  const handleBack = () => setScreen('start');
  
  const handleRestart = () => {
    storage.clear();
    setAssessmentResult(null);
    setSavedResult(null);
    setScreen('start');
  };

  // After assessment results, go to readiness check
  const handleStartWorkout = () => {
    setScreen('readiness');
  };

  // From readiness to dashboard
  const handleReadinessComplete = (data) => {
    setReadinessData(data);
    setScreen('dashboard');
  };

  // From dashboard to exercise detail
  const handleExerciseSelect = (exercise) => {
    setCurrentExercise(exercise);
    setScreen('exercise');
  };

  // From exercise to form check AI
  const handleFormCheck = () => {
    setScreen('formcheck');
  };

  // From form check back to exercise
  const handleFormCheckComplete = () => {
    setScreen('exercise');
  };

  // From exercise back to dashboard (after all sets done)
  const handleExerciseComplete = () => {
    setScreen('summary');
  };

  // From summary to dashboard (new workout cycle)
  const handleSummaryComplete = () => {
    setScreen('dashboard');
  };

  // Show saved results if on start screen
  if (screen === 'start' && savedResult && !assessmentResult) {
    return (
      <div className="app">
        <ResultsScreen 
          result={savedResult} 
          onRestart={handleRestart}
          onStartWorkout={handleStartWorkout}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen onStart={handleStartAssessment} />
      )}
      {screen === 'assessment' && (
        <AssessmentScreen 
          onComplete={handleCompleteAssessment} 
          onBack={handleBack} 
        />
      )}
      {screen === 'results' && assessmentResult && (
        <ResultsScreen 
          result={assessmentResult} 
          onRestart={handleRestart}
          onStartWorkout={handleStartWorkout}
        />
      )}
      {screen === 'readiness' && (
        <ReadinessScreen 
          onComplete={handleReadinessComplete}
          category={assessmentResult?.tier?.name === 'Novice' ? 'A: Developing Foundation' : assessmentResult?.tier?.name === 'Advanced' ? 'C: Longevity Master' : 'B: Peak Professional'}
        />
      )}
      {screen === 'dashboard' && (
        <WorkoutDashboard
          readinessScore={readinessData ? Math.round(((readinessData.sleep / 10) * 40 + (10 - readinessData.stress / 10) * 35 + (10 - readinessData.soreness / 10) * 25)) : 78}
          category={assessmentResult?.tier?.name === 'Novice' ? 'A' : assessmentResult?.tier?.name === 'Advanced' ? 'C' : 'B'}
          onExerciseSelect={handleExerciseSelect}
        />
      )}
      {screen === 'exercise' && currentExercise && (
        <ExerciseDetail
          exercise={currentExercise}
          onBack={() => setScreen('dashboard')}
          onFormCheck={handleFormCheck}
          onComplete={handleExerciseComplete}
        />
      )}
      {screen === 'formcheck' && (
        <FormCheckAI
          exercise={currentExercise}
          onBack={handleFormCheckComplete}
        />
      )}
      {screen === 'summary' && (
        <PostWorkoutSummary
          results={{
            safetyScore: 95,
            exercisesCompleted: 5,
            totalSets: 15,
            category: assessmentResult?.tier?.name === 'Novice' ? 'A: Developing Foundation' : assessmentResult?.tier?.name === 'Advanced' ? 'C: Longevity Master' : 'B: Peak Professional'
          }}
          onComplete={handleSummaryComplete}
        />
      )}
    </div>
  );
}

export default App;
