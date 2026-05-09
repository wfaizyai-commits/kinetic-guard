import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import OptionButton from '../components/OptionButton';
import './AssessmentScreen.css';

const TOTAL_QUESTIONS = 6;

const AssessmentScreen = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [responses, setResponses] = useState({
    activeHistory: null,
    injuryInventory: {
      hasJointPain: false,
      hasPriorSurgery: false,
      jointsAffected: []
    },
    structuralMobility: {
      canTouchToes: true,
      canFullSquat: true,
      hasPostureIssues: false
    },
    dailyLoad: null,
    primaryDriver: null,
    timeCommitment: null
  });

  const updateResponse = (section, data) => {
    setResponses(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return responses.activeHistory !== null;
      case 1: return true; // Injury is optional (doesn't block)
      case 2: return true; // Mobility is optional (doesn't block)
      case 3: return responses.dailyLoad !== null;
      case 4: return responses.primaryDriver !== null;
      case 5: return responses.timeCommitment !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_QUESTIONS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <QuestionCard 
            title="Active History" 
            subtitle="How consistent have you been with physical activity over the last 12 months?"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <OptionButton
                key={num}
                selected={responses.activeHistory === num}
                onClick={() => updateResponse('activeHistory', num)}
                icon={num <= 3 ? '🔰' : num <= 6 ? '⚡' : '🏆'}
              >
                {num}/10 — {num <= 3 ? 'Getting Started' : num <= 6 ? 'Building Momentum' : 'Well Established'}
              </OptionButton>
            ))}
          </QuestionCard>
        );

      case 1:
        return (
          <QuestionCard 
            title="Injury Inventory" 
            subtitle="Do you have any joint pain or past surgeries we should work around?"
            warning="This information helps us design exercises that protect your joints and prior injuries."
          >
            <div className="assessment-section">
              <h4 className="assessment-section__title">Joint Pain</h4>
              <OptionButton
                selected={responses.injuryInventory.hasJointPain === true}
                onClick={() => updateResponse('injuryInventory', { ...responses.injuryInventory, hasJointPain: true })}
                icon="⚠️"
              >
                Yes, I have joint pain
              </OptionButton>
              <OptionButton
                selected={responses.injuryInventory.hasJointPain === false}
                onClick={() => updateResponse('injuryInventory', { ...responses.injuryInventory, hasJointPain: false })}
                icon="✓"
              >
                No joint pain
              </OptionButton>
            </div>

            <div className="assessment-section">
              <h4 className="assessment-section__title">Prior Surgeries</h4>
              <OptionButton
                selected={responses.injuryInventory.hasPriorSurgery === true}
                onClick={() => updateResponse('injuryInventory', { ...responses.injuryInventory, hasPriorSurgery: true })}
                icon="🏥"
              >
                Yes, I have had surgeries
              </OptionButton>
              <OptionButton
                selected={responses.injuryInventory.hasPriorSurgery === false}
                onClick={() => updateResponse('injuryInventory', { ...responses.injuryInventory, hasPriorSurgery: false })}
                icon="✓"
              >
                No prior surgeries
              </OptionButton>
            </div>
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard 
            title="Structural Mobility" 
            subtitle="Can you perform these basic movements without difficulty?"
          >
            <div className="assessment-section">
              <h4 className="assessment-section__title">Toe Touch Test</h4>
              <p className="assessment-section__desc">Can you comfortably touch your toes?</p>
              <OptionButton
                selected={responses.structuralMobility.canTouchToes === true}
                onClick={() => updateResponse('structuralMobility', { ...responses.structuralMobility, canTouchToes: true })}
                icon="✓"
              >
                Yes, I can touch my toes
              </OptionButton>
              <OptionButton
                selected={responses.structuralMobility.canTouchToes === false}
                onClick={() => updateResponse('structuralMobility', { ...responses.structuralMobility, canTouchToes: false })}
                icon="✗"
              >
                No, I cannot touch my toes
              </OptionButton>
            </div>

            <div className="assessment-section">
              <h4 className="assessment-section__title">Bodyweight Squat</h4>
              <p className="assessment-section__desc">Can you perform a full bodyweight squat without your heels lifting?</p>
              <OptionButton
                selected={responses.structuralMobility.canFullSquat === true}
                onClick={() => updateResponse('structuralMobility', { ...responses.structuralMobility, canFullSquat: true })}
                icon="✓"
              >
                Yes, I can squat properly
              </OptionButton>
              <OptionButton
                selected={responses.structuralMobility.canFullSquat === false}
                onClick={() => updateResponse('structuralMobility', { ...responses.structuralMobility, canFullSquat: false })}
                icon="✗"
              >
                No, I have difficulty squatting
              </OptionButton>
            </div>
          </QuestionCard>
        );

      case 3:
        return (
          <QuestionCard 
            title="Daily Load" 
            subtitle="Is your daily life primarily sedentary or physically demanding?"
          >
            <OptionButton
              selected={responses.dailyLoad === 'sedentary'}
              onClick={() => updateResponse('dailyLoad', 'sedentary')}
              icon="🪑"
            >
              Sedentary — Mostly sitting (desk-based work)
            </OptionButton>
            <OptionButton
              selected={responses.dailyLoad === 'moderate'}
              onClick={() => updateResponse('dailyLoad', 'moderate')}
              icon="🏃"
            >
              Moderate — Mix of sitting and moving
            </OptionButton>
            <OptionButton
              selected={responses.dailyLoad === 'demanding'}
              onClick={() => updateResponse('dailyLoad', 'demanding')}
              icon="💪"
            >
              Physically Demanding — On my feet all day
            </OptionButton>
          </QuestionCard>
        );

      case 4:
        return (
          <QuestionCard 
            title="Primary Goal" 
            subtitle="What is your primary fitness goal?"
          >
            <OptionButton
              selected={responses.primaryDriver === 'bone_density'}
              onClick={() => updateResponse('primaryDriver', 'bone_density')}
              icon="🦴"
            >
              Bone Density — Build stronger bones
            </OptionButton>
            <OptionButton
              selected={responses.primaryDriver === 'muscle_hypertrophy'}
              onClick={() => updateResponse('primaryDriver', 'muscle_hypertrophy')}
              icon="💪"
            >
              Muscle Hypertrophy — Build muscle mass
            </OptionButton>
            <OptionButton
              selected={responses.primaryDriver === 'cardiovascular'}
              onClick={() => updateResponse('primaryDriver', 'cardiovascular')}
              icon="❤️"
            >
              Cardiovascular Health — Improve heart health
            </OptionButton>
            <OptionButton
              selected={responses.primaryDriver === 'flexibility'}
              onClick={() => updateResponse('primaryDriver', 'flexibility')}
              icon="🧘"
            >
              Flexibility — Improve mobility and range
            </OptionButton>
          </QuestionCard>
        );

      case 5:
        return (
          <QuestionCard 
            title="Time Commitment" 
            subtitle="How many 30-minute sessions can you realistically dedicate per week?"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <OptionButton
                key={num}
                selected={responses.timeCommitment === num}
                onClick={() => updateResponse('timeCommitment', num)}
                icon={num >= 4 ? '🔥' : '⏱️'}
              >
                {num} {num === 1 ? 'session' : 'sessions'} per week ({num * 30} minutes)
              </OptionButton>
            ))}
          </QuestionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="assessment-screen">
      <div className="assessment-screen__header">
        <button className="assessment-screen__back" onClick={handleBack}>
          <ChevronLeft size={24} />
        </button>
        <ProgressBar current={currentStep + 1} total={TOTAL_QUESTIONS} />
      </div>

      <div className="assessment-screen__content">
        {renderStep()}
      </div>

      <div className="assessment-screen__footer">
        <Button 
          onClick={handleNext} 
          disabled={!canProceed()}
          icon={currentStep === TOTAL_QUESTIONS - 1 ? null : ChevronRight}
          size="large"
          fullWidth
        >
          {currentStep === TOTAL_QUESTIONS - 1 ? 'Complete Assessment' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default AssessmentScreen;
