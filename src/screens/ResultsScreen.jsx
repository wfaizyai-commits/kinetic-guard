import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import './ResultsScreen.css';

const TIER_CONFIG = {
  novice: {
    color: '#00FF88',
    gradient: 'linear-gradient(135deg, #00FF88, #00B8D9)',
    glow: 'rgba(0, 255, 136, 0.3)',
    icon: '🌱',
    recommendations: {
      en: [
        'Start with bodyweight movements only',
        'Focus on mobility and flexibility for first 4 weeks',
        'Low-impact cardio 2x per week',
        'Prioritize sleep and recovery',
        'Master form before adding resistance',
      ],
      ar: [
        'ابدأ بتمارين وزن الجسم فقط',
        'ركز على المرونة والحركة في أول 4 أسابيع',
        'كارديو منخفض الأثر مرتين أسبوعياً',
        'أعطِ الأولوية للنوم والتعافي',
        'أتقن الشكل قبل إضافة المقاومة',
      ]
    }
  },
  intermediate: {
    color: '#00E5FF',
    gradient: 'linear-gradient(135deg, #00E5FF, #7B61FF)',
    glow: 'rgba(0, 229, 255, 0.3)',
    icon: '⚡',
    recommendations: {
      en: [
        'Progressive resistance training 3-4x per week',
        'Include mobility work in warm-up',
        'Track workout loads and progress',
        'Add compound lifts progressively',
        'Monitor recovery between sessions',
      ],
      ar: [
        'تدريب مقاومة تدريجي 3-4 مرات أسبوعياً',
        'اشمل تمارين الحركة في الإحماء',
        'تتبع أحمال التمرين والتقدم',
        'أضف التمارين المركبة تدريجياً',
        'راقب التعافي بين الجلسات',
      ]
    }
  },
  advanced: {
    color: '#7B61FF',
    gradient: 'linear-gradient(135deg, #7B61FF, #FF4D6D)',
    glow: 'rgba(123, 97, 255, 0.35)',
    icon: '🔥',
    recommendations: {
      en: [
        'Periodized training with planned deload weeks',
        'Sport-specific conditioning protocols',
        'Advanced mobility and prehab work',
        'Heart rate variability monitoring',
        'Optimize nutrition around training',
      ],
      ar: [
        'تدريب دوري مع أسابيع تفريغ مخططة',
        'بروتوكولات تكييف خاصة بالرياضة',
        'عمل متقدم على الحركة والوقاية',
        'مراقبة تقلب معدل ضربات القلب',
        'تحسين التغذية حول التدريب',
      ]
    }
  }
};

const ScoreRing = ({ score, color, glow }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring-wrap">
      <svg className="score-ring-svg" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ filter: `drop-shadow(0 0 8px ${glow})`, transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="score-ring-center">
        <span className="score-ring-value" style={{ color }}>{score}</span>
        <span className="score-ring-label">/ 100</span>
      </div>
    </div>
  );
};

const ResultsScreen = ({ tier, safetyScore, riskFlags, onStart, onRetake }) => {
  const { t, lang } = useLanguage();
  const config = TIER_CONFIG[tier] || TIER_CONFIG.novice;
  const tierName = t.tiers[tier]?.name || tier;
  const tierDesc = t.tiers[tier]?.description || '';
  const recommendations = config.recommendations[lang] || config.recommendations.en;

  return (
    <div className="results-screen screen">
      <div className="results-screen__bg-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${config.glow} 0%, transparent 65%)` }} />

      <div className="lang-toggle-fixed">
        <LanguageToggle />
      </div>

      <div className="results-content">
        {/* Tier badge */}
        <div className="results-tier animate-scale-in">
          <p className="results-section-label">{t.results.yourTier}</p>
          <div className="results-tier__badge" style={{ background: config.gradient, boxShadow: `0 8px 40px ${config.glow}` }}>
            <span className="results-tier__icon">{config.icon}</span>
            <span className="results-tier__name">{tierName}</span>
          </div>
          <p className="results-tier__desc">{tierDesc}</p>
        </div>

        {/* Score */}
        <div className="results-score-row animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <ScoreRing score={safetyScore} color={config.color} glow={config.glow} />
          <div className="results-score-info">
            <p className="results-section-label">{t.results.safetyScore}</p>
            <p className="results-score-text" style={{ color: config.color }}>
              {safetyScore >= 80 ? (lang === 'ar' ? 'ممتاز' : 'Excellent') :
               safetyScore >= 60 ? (lang === 'ar' ? 'جيد' : 'Good') :
               (lang === 'ar' ? 'يحتاج عناية' : 'Needs Attention')}
            </p>
          </div>
        </div>

        {/* Risk flags */}
        <div className="results-section animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <p className="results-section-label">{t.results.riskProfile}</p>
          <div className="results-flags">
            {riskFlags && riskFlags.length > 0 ? (
              riskFlags.map(flag => (
                <span key={flag} className="risk-flag">
                  <span className="risk-flag__dot" />
                  {t.results.flags[flag] || flag}
                </span>
              ))
            ) : (
              <span className="risk-flag risk-flag--clear">
                <span className="risk-flag__dot risk-flag__dot--green" />
                {t.results.noFlags}
              </span>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="results-section animate-fade-up" style={{ animationDelay: '0.35s' }}>
          <p className="results-section-label">{t.results.recommendations}</p>
          <div className="results-recs">
            {recommendations.map((rec, i) => (
              <div key={i} className="rec-item" style={{ animationDelay: `${0.4 + i * 0.07}s` }}>
                <span className="rec-item__num" style={{ color: config.color }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="rec-item__text">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="results-ctas animate-fade-up" style={{ animationDelay: '0.55s' }}>
          <Button variant="primary" size="lg" fullWidth onClick={onStart}>
            {t.results.startProgram}
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={onRetake}>
            {t.results.retakeAssessment}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
