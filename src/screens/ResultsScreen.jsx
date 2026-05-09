import React from 'react';
import { Shield, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import Button from '../components/Button';
import { TIER_DESCRIPTIONS, COLORS } from '../constants/brand';
import './ResultsScreen.css';

const ResultsScreen = ({ result, onRestart, onStartWorkout }) => {
  const { tier, score, riskFlags, recommendations } = result;
  const tierInfo = TIER_DESCRIPTIONS[tier];

  return (
    <div className="results-screen">
      <div className="results-screen__content">
        <div className="results-screen__badge" style={{ background: tierInfo.color }}>
          <Shield size={48} strokeWidth={1.5} />
        </div>
        
        <h1 className="results-screen__tier">{tierInfo.title}</h1>
        <p className="results-screen__subtitle">Your Safety Tier Has Been Assigned</p>
        
        <div className="results-screen__divider" />
        
        <div className="results-screen__score-card">
          <span className="results-screen__score-label">Assessment Score</span>
          <span className="results-screen__score-value">{score}</span>
        </div>

        <div className="results-screen__description">
          <p>{tierInfo.description}</p>
        </div>

        {riskFlags.length > 0 && (
          <div className="results-screen__risks">
            <h3 className="results-screen__risks-title">
              <AlertTriangle size={18} />
              Risk Factors Identified
            </h3>
            <div className="results-screen__risks-list">
              {riskFlags.map((flag, index) => (
                <div key={index} className="results-screen__risk-item">
                  <span className="results-screen__risk-icon">⚠️</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="results-screen__recommendations">
          <h3 className="results-screen__rec-title">Your Personalized Recommendations</h3>
          <div className="results-screen__rec-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="results-screen__rec-item">
                <CheckCircle size={18} className="results-screen__rec-check" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="results-screen__footer">
        <Button 
          onClick={onStartWorkout} 
          icon={ArrowRight}
          size="large"
          fullWidth
        >
          Start Today's Workout
        </Button>
        <Button 
          onClick={onRestart} 
          variant="ghost" 
          size="large"
          fullWidth
        >
          Start New Assessment
        </Button>
      </div>
    </div>
  );
};

export default ResultsScreen;
