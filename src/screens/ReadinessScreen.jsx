import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import './ReadinessScreen.css';

const SliderMetric = ({ label, value, onChange, lowLabel, highLabel, color = 'var(--cyan)', icon }) => {
  return (
    <div className="readiness-metric">
      <div className="readiness-metric__header">
        <span className="readiness-metric__icon">{icon}</span>
        <span className="readiness-metric__label">{label}</span>
        <span className="readiness-metric__value" style={{ color }}>{value}</span>
      </div>
      <div className="readiness-metric__slider-wrap">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="readiness-slider"
          style={{ '--slider-color': color, '--slider-pct': `${((value - 1) / 9) * 100}%` }}
        />
        <div className="readiness-metric__range-labels">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );
};

const ReadinessScreen = ({ tier, onProceed }) => {
  const { t } = useLanguage();
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(4);
  const [soreness, setSoreness] = useState(3);

  const readinessScore = Math.round(
    ((sleep / 10) * 40) +
    (((10 - stress) / 10) * 35) +
    (((10 - soreness) / 10) * 25)
  );

  const scoreColor =
    readinessScore >= 70 ? 'var(--green)' :
    readinessScore >= 45 ? 'var(--warning)' :
    'var(--danger)';

  const scoreLabel =
    readinessScore >= 70 ? (t.readiness.proceed) :
    readinessScore >= 45 ? '⚠️ Proceed carefully' :
    '🛑 Consider rest day';

  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="readiness-screen screen">
      <div className="lang-toggle-fixed">
        <LanguageToggle />
      </div>

      <div className="readiness-content">
        <div className="readiness-hero animate-fade-up">
          <div className="readiness-score-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={scoreColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
                style={{ transition: 'all 0.5s ease', filter: `drop-shadow(0 0 6px ${scoreColor})` }}
              />
            </svg>
            <div className="readiness-score-center">
              <span className="readiness-score-value" style={{ color: scoreColor }}>{readinessScore}</span>
              <span className="readiness-score-label">{t.readiness.readinessScore}</span>
            </div>
          </div>
          <div className="readiness-hero-text">
            <h1 className="readiness-title">{t.readiness.title}</h1>
            <p className="readiness-subtitle">{t.readiness.subtitle}</p>
          </div>
        </div>

        <div className="readiness-metrics animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <SliderMetric
            label={t.readiness.sleep}
            value={sleep}
            onChange={setSleep}
            lowLabel={t.readiness.poor}
            highLabel={t.readiness.excellent}
            color="var(--cyan)"
            icon="😴"
          />
          <SliderMetric
            label={t.readiness.stress}
            value={stress}
            onChange={setStress}
            lowLabel={t.readiness.low}
            highLabel={t.readiness.high}
            color="var(--warning)"
            icon="🧠"
          />
          <SliderMetric
            label={t.readiness.soreness}
            value={soreness}
            onChange={setSoreness}
            lowLabel={t.readiness.none}
            highLabel={t.readiness.severe}
            color="var(--purple)"
            icon="💪"
          />
        </div>

        <div className="readiness-action animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onProceed({ sleep, stress, soreness, readinessScore })}
          >
            {t.readiness.proceed}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadinessScreen;
