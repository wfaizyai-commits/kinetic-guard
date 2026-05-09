import React, { useState } from 'react';
import { ChevronLeft, Camera, Volume2, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import './ExerciseDetail.css';

const ExerciseDetail = ({ exercise, onBack, onFormCheck, onComplete }) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [rpe, setRpe] = useState(7);
  const [loggedSets, setLoggedSets] = useState([]);

  const totalSets = exercise?.sets || 3;

  const handleLogSet = () => {
    setLoggedSets(prev => [...prev, { set: currentSet, rpe }]);
    if (currentSet < totalSets) {
      setCurrentSet(s => s + 1);
    }
  };

  const isFormAlert = rpe > 8;

  return (
    <div className="exercise-detail">
      <div className="exercise-detail__header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        <div className="exercise-detail__progress">
          Set {currentSet} of {totalSets}
        </div>
      </div>

      <div className="exercise-detail__content">
        <div className="exercise-detail__title-section">
          <h1 className="exercise-detail__title">{exercise?.name || 'Exercise'}</h1>
          <p className="exercise-detail__subtitle">
            {exercise?.sets} sets × {exercise?.reps} • {exercise?.target}
          </p>
        </div>

        <div className="exercise-detail__video-placeholder">
          <div className="exercise-detail__video-inner">
            <span>5-second form video</span>
          </div>
        </div>

        <div className="exercise-detail__safety-cards">
          <div className="safety-card">
            <div className="safety-card__icon">
              <AlertTriangle size={18} />
            </div>
            <div className="safety-card__content">
              <h4>Technical Failure Rule</h4>
              <p>Stop 1 rep before your form breaks. Quality over quantity.</p>
            </div>
          </div>

          <div className="safety-card">
            <div className="safety-card__icon">
              <Volume2 size={18} />
            </div>
            <div className="safety-card__content">
              <h4>Talk Test</h4>
              <p>You should be able to say: "I feel strong and stable" during this exercise.</p>
            </div>
          </div>
        </div>

        <div className="exercise-detail__rpe-section">
          <div className="exercise-detail__rpe-header">
            <span>Log RPE</span>
            <span className="exercise-detail__rpe-value">{rpe}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={rpe}
            onChange={e => setRpe(+e.target.value)}
            className="exercise-detail__rpe-slider"
          />
          <div className="exercise-detail__rpe-labels">
            <span>Easy</span>
            <span className={isFormAlert ? 'text-warning' : ''}>Max Effort</span>
          </div>
          {isFormAlert && (
            <div className="exercise-detail__rpe-alert">
              <AlertTriangle size={14} />
              <span>RPE above 8 may compromise form safety</span>
            </div>
          )}
        </div>

        {loggedSets.length > 0 && (
          <div className="exercise-detail__logged-sets">
            <h4>Logged Sets</h4>
            <div className="logged-sets__list">
              {loggedSets.map((s, i) => (
                <span key={i} className="logged-set-badge">Set {s.set}: RPE {s.rpe}</span>
              ))}
            </div>
          </div>
        )}

        <div className="exercise-detail__actions">
          <Button 
            onClick={onFormCheck} 
            variant="outline" 
            icon={Camera}
            fullWidth
          >
            Form-Check AI
          </Button>
          <Button 
            onClick={handleLogSet} 
            fullWidth
            disabled={currentSet > totalSets}
          >
            {currentSet <= totalSets ? `Log Set ${currentSet}` : 'Exercise Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
