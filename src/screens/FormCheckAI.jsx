import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import './FormCheckAI.css';

const FormCheckAI = ({ exercise, onBack, onResult }) => {
  const [phase, setPhase] = useState('instructions'); // instructions, recording, analyzing, result

  const handleStartRecording = () => {
    setPhase('recording');
    setTimeout(() => {
      setPhase('analyzing');
      setTimeout(() => {
        setPhase('result');
      }, 2000);
    }, 3000);
  };

  const getResult = () => {
    // Mock result based on exercise
    if (exercise?.equipment === 'kettlebell') {
      return {
        status: 'success',
        message: 'Safety Green Light',
        detail: 'Your form looks strong and stable. Great depth on the squat!'
      };
    }
    return {
      status: 'warning',
      message: 'Form Alert',
      detail: 'Keep your chest up during the movement. Avoid rounding your lower back.'
    };
  };

  if (phase === 'result') {
    const result = getResult();
    return (
      <div className="form-check">
        <div className="form-check__result">
          <div className={`form-check__result-icon ${result.status}`}>
            {result.status === 'success' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
          </div>
          <h2 className="form-check__result-title">{result.message}</h2>
          <p className="form-check__result-detail">{result.detail}</p>
          <Button onClick={onBack}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-check">
      <div className="form-check__header">
        <button className="form-check__close" onClick={onBack}>
          <X size={24} />
        </button>
        <span className="form-check__title">Form-Check AI</span>
      </div>

      <div className="form-check__content">
        {phase === 'instructions' && (
          <>
            <h2 className="form-check__heading">Position yourself 5 feet from phone</h2>
            <p className="form-check__subheading">Perform 3 reps at controlled pace</p>

            <div className="form-check__skeleton-demo">
              <div className="skeleton-figure">
                <div className="skeleton-head" />
                <div className="skeleton-torso" />
                <div className="skeleton-arm" />
                <div className="skeleton-arm" />
                <div className="skeleton-leg" />
                <div className="skeleton-leg" />
              </div>
            </div>

            <div className="form-check__instructions">
              <div className="form-check__instruction-item">
                <span className="form-check__instruction-num">1</span>
                <span>Position your phone on a stable surface facing you</span>
              </div>
              <div className="form-check__instruction-item">
                <span className="form-check__instruction-num">2</span>
                <span>Stand 5 feet (1.5m) away from the camera</span>
              </div>
              <div className="form-check__instruction-item">
                <span className="form-check__instruction-num">3</span>
                <span>Perform 3 controlled reps of {exercise?.name || 'the exercise'}</span>
              </div>
            </div>

            <Button onClick={handleStartRecording} fullWidth>
              Start Recording
            </Button>
          </>
        )}

        {phase === 'recording' && (
          <div className="form-check__recording">
            <div className="form-check__camera-frame">
              <div className="form-check__skeleton-overlay">
                <div className="skeleton-figure">
                  <div className="skeleton-head" />
                  <div className="skeleton-torso" />
                  <div className="skeleton-arm" />
                  <div className="skeleton-arm" />
                  <div className="skeleton-leg" />
                  <div className="skeleton-leg" />
                </div>
              </div>
              <div className="form-check__recording-indicator">
                <span className="recording-dot" />
                Recording...
              </div>
            </div>
            <p className="form-check__recording-hint">Perform 3 slow, controlled reps</p>
          </div>
        )}

        {phase === 'analyzing' && (
          <div className="form-check__analyzing">
            <div className="form-check__analyzing-spinner" />
            <h2 className="form-check__analyzing-title">Analyzing Form...</h2>
            <p className="form-check__analyzing-subtitle">Checking movement quality and safety markers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCheckAI;
