import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import './ReadinessScreen.css';

const ReadinessScreen = ({ onComplete, category = 'B: Peak Professional' }) => {
  const [values, setValues] = useState({ sleep: 7, stress: 5, soreness: 4 });

  const update = (key, val) => setValues(prev => ({ ...prev, [key]: val }));

  const readinessScore = Math.round(((values.sleep / 10) * 40 + (10 - values.stress / 10) * 35 + (10 - values.soreness / 10) * 25));

  const getVolumeMessage = () => {
    if (readinessScore >= 80) return "Good to go. Full workout scheduled.";
    if (readinessScore >= 60) return "Moderate session. We've adjusted volume by -20%.";
    return "Active Recovery recommended. Mobility work only.";
  };

  const getReadinessLabel = () => {
    if (readinessScore >= 80) return { text: 'Ready to Train', color: '#20B2AA' };
    if (readinessScore >= 60) return { text: 'Moderate Readiness', color: '#FF8C00' };
    return { text: 'Recovery Day', color: '#1A2B3C' };
  };

  const label = getReadinessLabel();

  return (
    <div className="readiness">
      <div className="readiness__header">
        <span className="readiness__label">Daily Readiness Check</span>
      </div>

      <div className="readiness__content">
        <h1 className="readiness__title">How are you feeling today?</h1>
        <p className="readiness__subtitle">Your responses adjust today's workout to keep you safe.</p>

        <div className="readiness__sliders">
          <div className="slider-item">
            <div className="slider-item__header">
              <span className="slider-item__label">Sleep Quality</span>
              <span className="slider-item__value">{values.sleep}/10</span>
            </div>
            <input
              type="range" min="1" max="10"
              value={values.sleep}
              onChange={e => update('sleep', +e.target.value)}
              className="slider-item__input"
            />
            <div className="slider-item__hints">
              <span>Restless</span><span>Restful</span>
            </div>
          </div>

          <div className="slider-item">
            <div className="slider-item__header">
              <span className="slider-item__label">Stress Level</span>
              <span className="slider-item__value">{values.stress}/10</span>
            </div>
            <input
              type="range" min="1" max="10"
              value={values.stress}
              onChange={e => update('stress', +e.target.value)}
              className="slider-item__input"
            />
            <div className="slider-item__hints">
              <span>Calm</span><span>High Stress</span>
            </div>
          </div>

          <div className="slider-item">
            <div className="slider-item__header">
              <span className="slider-item__label">Muscle Soreness</span>
              <span className="slider-item__value">{values.soreness}/10</span>
            </div>
            <input
              type="range" min="1" max="10"
              value={values.soreness}
              onChange={e => update('soreness', +e.target.value)}
              className="slider-item__input"
            />
            <div className="slider-item__hints">
              <span>No soreness</span><span>Very sore</span>
            </div>
          </div>
        </div>

        <div className="readiness__score-card">
          <div className="readiness__score-circle" style={{ borderColor: label.color }}>
            <span className="readiness__score-value">{readinessScore}</span>
            <span className="readiness__score-max">/100</span>
          </div>
          <span className="readiness__score-label" style={{ color: label.color }}>{label.text}</span>
          <p className="readiness__volume-msg">{getVolumeMessage()}</p>
        </div>

        <div className="readiness__category">
          <span className="readiness__category-label">Category {category}</span>
        </div>
      </div>

      <div className="readiness__footer">
        <Button onClick={() => onComplete(values)} icon={ChevronRight}>
          Start Today's Workout
        </Button>
      </div>
    </div>
  );
};

export default ReadinessScreen;
