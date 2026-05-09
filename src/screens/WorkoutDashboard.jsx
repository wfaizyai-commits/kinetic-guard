import React from 'react';
import { Clock, Shield, ChevronRight, Activity } from 'lucide-react';
import './WorkoutDashboard.css';

const EXERCISES_BY_CATEGORY = {
  A: [ // Developing Athlete (13-19)
    { id: 1, name: 'Bodyweight Squat', sets: 3, reps: '10-15', equipment: 'bodyweight', target: 'Lower body & core' },
    { id: 2, name: 'Push-Up to Plank', sets: 3, reps: '10', equipment: 'bodyweight', target: 'Chest & core' },
    { id: 3, name: 'Lateral Lunge', sets: 3, reps: '10 each', equipment: 'bodyweight', target: 'Hip stability & legs' },
    { id: 4, name: 'Glute Bridge', sets: 3, reps: '12', equipment: 'bodyweight', target: 'Glutes & posterior chain' },
    { id: 5, name: 'Bird Dog', sets: 3, reps: '10 each', equipment: 'bodyweight', target: 'Core & balance' }
  ],
  B: [ // Peak Professional (20-45)
    { id: 1, name: 'Goblet Squat', sets: 3, reps: '10-12', equipment: 'kettlebell', target: 'Lower body & core' },
    { id: 2, name: 'Push-Up Hold', sets: 3, reps: '30 sec', equipment: 'bodyweight', target: 'Chest & triceps' },
    { id: 3, name: 'Single-Arm Row', sets: 3, reps: '10 each', equipment: 'band', target: 'Back & biceps' },
    { id: 4, name: 'TRX Inverted Row', sets: 3, reps: '12', equipment: 'trx', target: 'Posterior chain' },
    { id: 5, name: 'Farmers Walk', sets: 3, reps: '30 sec', equipment: 'kettlebell', target: 'Grip & core' }
  ],
  C: [ // Longevity Master (50+)
    { id: 1, name: 'Supported Squat', sets: 3, reps: '10', equipment: 'bodyweight', target: 'Leg strength & mobility' },
    { id: 2, name: 'Seated Press', sets: 3, reps: '12', equipment: 'band', target: 'Upper body & bone density' },
    { id: 3, name: 'Standing Hip Extension', sets: 3, reps: '10 each', equipment: 'band', target: 'Hip strength & balance' },
    { id: 4, name: 'Single-Leg Stand', sets: 3, reps: '30 sec', equipment: 'bodyweight', target: 'Balance training' },
    { id: 5, name: 'Grip Crush', sets: 3, reps: '15', equipment: 'kettlebell', target: 'Grip strength' }
  ]
};

const CATEGORY_LABELS = {
  A: 'A: Developing Athlete',
  B: 'B: Peak Professional',
  C: 'C: Longevity Master'
};

const EXERCISES = EXERCISES_BY_CATEGORY.B;

const EQUIPMENT_ICONS = {
  kettlebell: '🏋️',
  bodyweight: '🧍',
  band: '➰',
  trx: '🪜'
};

const EQUIPMENT_COLORS = {
  kettlebell: '#FF8C00',
  bodyweight: '#20B2AA',
  band: '#708090',
  trx: '#1A2B3C'
};

const WorkoutDashboard = ({ readinessScore, category, onExerciseSelect }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const catKey = category || 'B';
  const exercises = EXERCISES_BY_CATEGORY[catKey] || EXERCISES_BY_CATEGORY.B;
  const categoryLabel = CATEGORY_LABELS[catKey] || CATEGORY_LABELS.B;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__date">{today}</div>
        <div className="dashboard__readiness">
          <span className="dashboard__readiness-label">Readiness</span>
          <span className="dashboard__readiness-value">{readinessScore}</span>
        </div>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__category-badge">
          <Shield size={16} />
          <span>{categoryLabel}</span>
        </div>

        <div className="dashboard__rpe-buffer">
          <div className="dashboard__rpe-header">
            <Activity size={16} />
            <span>RPE Buffer</span>
          </div>
          <div className="dashboard__rpe-display">
            <span className="dashboard__rpe-value">7</span>
            <span className="dashboard__rpe-dash">—</span>
            <span className="dashboard__rpe-value">8</span>
          </div>
          <p className="dashboard__rpe-hint">Train within this range for safety</p>
        </div>

        <div className="dashboard__workout-section">
          <h2 className="dashboard__section-title">Today's Workout</h2>
          <div className="dashboard__exercise-list">
            {exercises.map((ex, idx) => (
              <button 
                key={ex.id} 
                className="dashboard__exercise-item"
                onClick={() => onExerciseSelect(ex)}
              >
                <div className="dashboard__exercise-number">{idx + 1}</div>
                <div 
                  className="dashboard__exercise-icon"
                  style={{ background: EQUIPMENT_COLORS[ex.equipment] + '20' }}
                >
                  {EQUIPMENT_ICONS[ex.equipment]}
                </div>
                <div className="dashboard__exercise-info">
                  <span className="dashboard__exercise-name">{ex.name}</span>
                  <span className="dashboard__exercise-meta">{ex.sets} sets × {ex.reps}</span>
                </div>
                <div className="dashboard__exercise-chevron">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDashboard;
