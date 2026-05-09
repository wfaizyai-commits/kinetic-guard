import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import './StartScreen.css';

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <div className="start-screen__content">
        <div className="start-screen__logo">
          <Shield size={80} strokeWidth={1.5} />
        </div>
        
        <h1 className="start-screen__title">KineticGuard</h1>
        <p className="start-screen__tagline">The Adaptive Safety Program</p>
        
        <div className="start-screen__divider" />
        
        <p className="start-screen__description">
          Before you begin your fitness journey, we conduct a comprehensive 
          <strong> Safety Audit</strong> to understand your body's foundation 
          and design a program that protects you while building strength.
        </p>
        
        <div className="start-screen__features">
          <div className="start-screen__feature">
            <span className="start-screen__feature-icon">✓</span>
            <span>Physical Foundation Assessment</span>
          </div>
          <div className="start-screen__feature">
            <span className="start-screen__feature-icon">✓</span>
            <span>Injury Risk Identification</span>
          </div>
          <div className="start-screen__feature">
            <span className="start-screen__feature-icon">✓</span>
            <span>Personalized Tier Assignment</span>
          </div>
        </div>
        
        <div className="start-screen__cta">
          <Button onClick={onStart} icon={ArrowRight} size="large">
            Begin Safety Audit
          </Button>
        </div>
        
        <p className="start-screen__time">
          ⏱️ Takes approximately 3 minutes
        </p>
      </div>
      
      <div className="start-screen__footer">
        <p>Fitness that Protects.</p>
      </div>
    </div>
  );
};

export default StartScreen;
