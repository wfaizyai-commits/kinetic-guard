import React from 'react';
import { Shield, Award, TrendingUp, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import './PostWorkoutSummary.css';

const PostWorkoutSummary = ({ results, onComplete }) => {
  const { safetyScore, exercisesCompleted, totalSets, category } = results;

  const getSafetyRating = () => {
    if (safetyScore >= 90) return { label: 'Excellent', color: '#20B2AA' };
    if (safetyScore >= 75) return { label: 'Good', color: '#FF8C00' };
    return { label: 'Needs Review', color: '#E74C3C' };
  };

  const rating = getSafetyRating();
  const nextMilestone = 3;

  return (
    <div className="summary">
      <div className="summary__content">
        <div className="summary__badge">
          <Shield size={48} strokeWidth={1.5} />
        </div>

        <h1 className="summary__title">Workout Complete</h1>
        <p className="summary__subtitle">Great work on your safety-focused session</p>

        <div className="summary__divider" />

        <div className="summary__score-card">
          <div className="summary__score-circle" style={{ borderColor: rating.color }}>
            <span className="summary__score-value">{safetyScore}</span>
            <span className="summary__score-max">%</span>
          </div>
          <span className="summary__score-label" style={{ color: rating.color }}>
            {rating.label} Safety Compliance
          </span>
        </div>

        <div className="summary__stats">
          <div className="summary__stat">
            <span className="summary__stat-value">{exercisesCompleted || 5}</span>
            <span className="summary__stat-label">Exercises</span>
          </div>
          <div className="summary__stat">
            <span className="summary__stat-value">{totalSets || 15}</span>
            <span className="summary__stat-label">Total Sets</span>
          </div>
          <div className="summary__stat">
            <span className="summary__stat-value">{rating.label === 'Excellent' ? '✓' : '~'}</span>
            <span className="summary__stat-label">Technical Mastery</span>
          </div>
        </div>

        <div className="summary__highlights">
          <h3 className="summary__highlights-title">
            <Award size={18} />
            Today's Achievements
          </h3>
          <ul className="summary__highlights-list">
            <li>Maintained RPE within 7-8 buffer on all sets</li>
            <li>Passed Technical Failure check on Goblet Squat</li>
            <li>Talk Test passed throughout session</li>
          </ul>
        </div>

        <div className="summary__progression">
          <div className="summary__progression-header">
            <TrendingUp size={18} />
            <span>Technical Milestone Progress</span>
          </div>
          <p className="summary__progression-text">
            You are <strong>{nextMilestone} sessions</strong> away from your next Technical Milestone.
          </p>
          <div className="summary__progression-bar">
            <div className="summary__progression-fill" style={{ width: '70%' }} />
          </div>
        </div>

        <div className="summary__category">
          Category {category || 'B: Peak Professional'}
        </div>
      </div>

      <div className="summary__footer">
        <Button onClick={onComplete} icon={ChevronRight} fullWidth>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PostWorkoutSummary;
