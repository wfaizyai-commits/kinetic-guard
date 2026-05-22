import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import OptionButton from '../components/OptionButton';
import './AssessmentScreen.css';

const STEPS = ['activeHistory', 'injuryInventory', 'structuralMobility', 'dailyLoad', 'primaryDriver', 'timeCommitment'];

/* ── Big tappable number cards ── */
const ScaleInput = ({ value, onChange, labels }) => {
  const steps = [1, 2, 3, 4, 5];
  const getLabel = v => {
    if (!v) return '';
    if (v <= 2) return labels[0];
    if (v === 3) return labels[1];
    return labels[2];
  };
  return (
    <div className="scale-input">
      <div className="scale-cards">
        {steps.map(s => (
          <button
            key={s}
            type="button"
            className={`scale-card ${value === s ? 'scale-card--active' : ''}`}
            onClick={() => onChange(s)}
          >
            <span className="scale-card__num">{s}</span>
          </button>
        ))}
      </div>
      <div className="scale-legend">
        <span>{labels[0]}</span>
        <span>{labels[2]}</span>
      </div>
      {value && (
        <div className="scale-selected-label">
          <span className="scale-selected-label__dot" />
          <span>{getLabel(value)}</span>
        </div>
      )}
    </div>
  );
};

const AssessmentScreen = ({ onComplete, onBack }) => {
  const { t, isRTL } = useLanguage();
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const [answers, setAnswers] = useState({
    activeHistory: null,
    injuryFlags: [],
    mobilityFlags: [],
    dailyLoad: null,
    primaryDriver: null,
    timeCommitment: null,
  });

  const currentStepKey = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const goNext = () => {
    if (animating) return;
    if (isLastStep) { onComplete(answers); return; }
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 200);
  };

  const goBack = () => {
    if (animating) return;
    if (step === 0) { onBack(); return; }
    setAnimating(true);
    setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 200);
  };

  const canProceed = () => {
    switch (currentStepKey) {
      case 'activeHistory': return answers.activeHistory !== null;
      case 'dailyLoad': return answers.dailyLoad !== null;
      case 'primaryDriver': return answers.primaryDriver !== null;
      case 'timeCommitment': return answers.timeCommitment !== null;
      default: return true;
    }
  };

  const toggleFlag = (field, value) => {
    setAnswers(a => {
      const arr = [...(a[field] || [])];
      if (value === 'noneApply') return { ...a, [field]: arr.includes('noneApply') ? [] : ['noneApply'] };
      const withoutNone = arr.filter(x => x !== 'noneApply');
      const idx = withoutNone.indexOf(value);
      if (idx > -1) return { ...a, [field]: withoutNone.filter(x => x !== value) };
      return { ...a, [field]: [...withoutNone, value] };
    });
  };

  const q = t.assessment.questions;

  const renderStep = () => {
    switch (currentStepKey) {
      case 'activeHistory':
        return (
          <ScaleInput
            value={answers.activeHistory}
            onChange={v => setAnswers(a => ({ ...a, activeHistory: v }))}
            labels={[t.assessment.scale.gettingStarted, t.assessment.scale.buildingMomentum, t.assessment.scale.wellEstablished]}
          />
        );

      case 'injuryInventory':
        return (
          <div className="options-stack">
            <OptionButton label={t.assessment.injury.jointPain} icon="🦵"
              selected={answers.injuryFlags.includes('jointPain')}
              onClick={() => toggleFlag('injuryFlags', 'jointPain')} />
            <OptionButton label={t.assessment.injury.priorSurgery} icon="🏥"
              selected={answers.injuryFlags.includes('priorSurgery')}
              onClick={() => toggleFlag('injuryFlags', 'priorSurgery')} />
            <OptionButton label={t.assessment.injury.noneApply} icon="✅"
              selected={answers.injuryFlags.includes('noneApply')}
              onClick={() => toggleFlag('injuryFlags', 'noneApply')} />
          </div>
        );

      case 'structuralMobility':
        return (
          <div className="options-stack">
            <OptionButton label={t.assessment.mobility.canTouchToes} icon="🤸"
              selected={answers.mobilityFlags.includes('canTouchToes')}
              onClick={() => toggleFlag('mobilityFlags', 'canTouchToes')} />
            <OptionButton label={t.assessment.mobility.canFullSquat} icon="🏋️"
              selected={answers.mobilityFlags.includes('canFullSquat')}
              onClick={() => toggleFlag('mobilityFlags', 'canFullSquat')} />
            <OptionButton label={t.assessment.mobility.hasPostureIssues} icon="🪑"
              selected={answers.mobilityFlags.includes('hasPostureIssues')}
              onClick={() => toggleFlag('mobilityFlags', 'hasPostureIssues')} />
          </div>
        );

      case 'dailyLoad':
        return (
          <div className="options-stack">
            {Object.entries(t.assessment.dailyLoads).map(([key, label]) => (
              <OptionButton key={key} label={label}
                icon={key === 'sedentary' ? '🖥️' : key === 'moderate' ? '🚶' : '⚡'}
                selected={answers.dailyLoad === key}
                onClick={() => setAnswers(a => ({ ...a, dailyLoad: key }))} />
            ))}
          </div>
        );

      case 'primaryDriver':
        return (
          <div className="options-stack">
            {Object.entries(t.assessment.goals).map(([key, label]) => (
              <OptionButton key={key} label={label}
                icon={key === 'strength' ? '💪' : key === 'weightLoss' ? '⚖️' : key === 'endurance' ? '🏃' : key === 'flexibility' ? '🧘' : '🎯'}
                selected={answers.primaryDriver === key}
                onClick={() => setAnswers(a => ({ ...a, primaryDriver: key }))} />
            ))}
          </div>
        );

      case 'timeCommitment':
        return (
          <div className="time-grid">
            {Object.entries(t.assessment.timeOptions).map(([key, label]) => (
              <button key={key} type="button"
                className={`time-option ${answers.timeCommitment === key ? 'time-option--selected' : ''}`}
                onClick={() => setAnswers(a => ({ ...a, timeCommitment: key }))}>
                <span className="time-option__value">{key}</span>
                <span className="time-option__label">{isRTL ? label : (label.split('/')[1] || label)}</span>
              </button>
            ))}
          </div>
        );

      default: return null;
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="assessment-screen screen">
      <div className="lang-toggle-fixed"><LanguageToggle /></div>

      {/* Top progress bar */}
      <div className="assessment-topbar">
        <button type="button" className="assessment-back-btn" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="assessment-progress-wrap">
          <div className="assessment-progress-label">
            <span>{t.assessment.progress}</span>
            <span>{step + 1} {t.assessment.of} {STEPS.length}</span>
          </div>
          <div className="assessment-progress-bar">
            <div className="assessment-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className={`assessment-body ${animating ? 'assessment-body--animating' : ''}`}>
        <div className="assessment-card animate-scale-in">
          <div className="assessment-step-tag">
            <span className="assessment-step-tag__num">{String(step + 1).padStart(2, '0')}</span>
            <span className="assessment-step-tag__label">{q[currentStepKey].title}</span>
          </div>
          <h2 className="assessment-question-title">{q[currentStepKey].title}</h2>
          <p className="assessment-question-subtitle">{q[currentStepKey].subtitle}</p>
          <div className="assessment-step-content">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="assessment-nav">
        <Button variant="ghost" size="md" onClick={goBack}>
          {t.assessment.back}
        </Button>
        <Button variant="primary" size="md" disabled={!canProceed()} onClick={goNext}
          className="assessment-nav__next">
          {isLastStep ? t.assessment.complete : t.assessment.next}
        </Button>
      </div>
    </div>
  );
};

export default AssessmentScreen;
