import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useGender, getCyclePhase } from '../i18n/GenderContext';
import './PeriodTrackerScreen.css';

// ── Phase config ──────────────────────────────────────────────────────────────
const PHASES = {
  menstrual:  { color: '#FF6B8A', bg: 'rgba(255,107,138,0.12)', icon: '🌙', days: '1–5'  },
  follicular: { color: '#FFB347', bg: 'rgba(255,179,71,0.12)',  icon: '🌱', days: '6–13' },
  ovulation:  { color: '#FF6B00', bg: 'rgba(255,107,0,0.15)',   icon: '⚡', days: '14–16'},
  luteal:     { color: '#B06AFF', bg: 'rgba(176,106,255,0.12)', icon: '🍂', days: '17–28'},
};

const WORKOUT_RECS = {
  en: {
    menstrual:  { title: 'Rest & Gentle Movement',       body: 'Light yoga, walking, or stretching. Listen to your body — rest is training too.',   intensity: 'Low' },
    follicular: { title: 'Build Up Your Strength',       body: 'Energy is rising. Great time to increase weights, try new moves, and push harder.',  intensity: 'Medium–High' },
    ovulation:  { title: 'Peak Performance Day',         body: 'You\'re at your strongest. Go for new personal records — power and speed are at max!', intensity: 'Max' },
    luteal:     { title: 'Moderate & Mindful Training',  body: 'Focus on form over weight. Moderate cardio and bodyweight work feel best now.',       intensity: 'Moderate' },
  },
  ar: {
    menstrual:  { title: 'راحة وحركة خفيفة',         body: 'يوغا خفيفة أو مشي أو إطالة. استمعي لجسمك — الراحة جزء من التدريب.',              intensity: 'منخفضة'        },
    follicular: { title: 'ابدئي البناء التدريجي',    body: 'طاقتك في ازدياد. وقت ممتاز لزيادة الأوزان وتجربة تمارين جديدة.',                  intensity: 'متوسطة–عالية' },
    ovulation:  { title: 'يوم الذروة — أقصى أداء',   body: 'أنتِ في أفضل حالاتك. اسعي لأرقام قياسية جديدة — القوة والسرعة في أعلاها!',       intensity: 'قصوى'          },
    luteal:     { title: 'تدريب معتدل ومتوازن',      body: 'ركزي على الأسلوب الصحيح بدل الأوزان. الكارديو المعتدل وتمارين الجسم مناسبة الآن.',intensity: 'معتدلة'        },
  },
};

const PHASE_NAMES = {
  en: { menstrual: 'Menstrual', follicular: 'Follicular', ovulation: 'Ovulation', luteal: 'Luteal' },
  ar: { menstrual: 'الدورة',   follicular: 'الجريبية',   ovulation: 'الإباضة',   luteal: 'الطور الأصفر' },
};

// ── Cycle Ring SVG ────────────────────────────────────────────────────────────
const CycleRing = ({ dayOfCycle = 1, cycleLength = 28 }) => {
  const cx = 150, cy = 150, R = 108;
  const dots = Array.from({ length: cycleLength }, (_, i) => {
    const day = i + 1;
    const angle = ((i / cycleLength) * 2 * Math.PI) - (Math.PI / 2);
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    const phase =
      day <= 5  ? 'menstrual'  :
      day <= 13 ? 'follicular' :
      day <= 16 ? 'ovulation'  : 'luteal';
    const isToday = day === dayOfCycle;
    const isPast  = day < dayOfCycle;
    return { day, x, y, phase, isToday, isPast };
  });

  const currentPhase = dots[dayOfCycle - 1]?.phase || 'menstrual';
  const phaseColor   = PHASES[currentPhase]?.color || '#FF6B8A';

  return (
    <svg viewBox="0 0 300 300" className="cycle-ring">
      {/* Phase arc segments (background) */}
      {dots.map(({ x, y, phase, isToday, isPast }) => (
        <circle
          key={`dot-${phase}-${x}-${y}`}
          cx={x} cy={y}
          r={isToday ? 8 : 5}
          fill={isPast || isToday ? PHASES[phase].color : 'rgba(255,255,255,0.1)'}
          opacity={isToday ? 1 : isPast ? 0.7 : 0.35}
          style={isToday ? { filter: `drop-shadow(0 0 6px ${PHASES[phase].color})` } : {}}
        />
      ))}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={72} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Phase icon */}
      <text x={cx} y={cy - 18} textAnchor="middle" fontSize="28" dominantBaseline="middle">
        {PHASES[currentPhase]?.icon}
      </text>

      {/* Day number */}
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="32" fontWeight="900" fill="white" dominantBaseline="middle"
        style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {dayOfCycle}
      </text>

      {/* "Day" label */}
      <text x={cx} y={cy + 34} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.45)"
        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        DAY
      </text>
    </svg>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const PeriodTrackerScreen = ({ onBack }) => {
  const { lang } = useLanguage();
  const { cycleData, setCycleData } = useGender();
  const isAR = lang === 'ar';

  const [showSetup, setShowSetup] = useState(!cycleData);
  const [inputDate, setInputDate] = useState('');
  const [cycleLen, setCycleLen] = useState(28);
  const [periodLen, setPeriodLen] = useState(5);

  const phaseInfo = cycleData
    ? getCyclePhase(cycleData.lastPeriodDate, cycleData.cycleLength, cycleData.periodLength)
    : null;

  const dayOfCycle = phaseInfo?.day || 1;
  const currentPhase = phaseInfo?.phase || 'menstrual';
  const phaseCfg    = PHASES[currentPhase];
  const rec         = WORKOUT_RECS[isAR ? 'ar' : 'en'][currentPhase];
  const phaseName   = PHASE_NAMES[isAR ? 'ar' : 'en'][currentPhase];

  const handleSave = () => {
    if (!inputDate) return;
    setCycleData({ lastPeriodDate: inputDate, cycleLength: cycleLen, periodLength: periodLen });
    setShowSetup(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`period-screen ${isAR ? 'rtl' : ''}`}>
      {/* Header */}
      <div className="period-header">
        <button className="period-back-btn" onClick={onBack}>
          {isAR ? '→' : '←'}
        </button>
        <h1 className="period-title">
          {isAR ? 'متتبع الدورة الشهرية' : 'Cycle Tracker'}
        </h1>
        <button className="period-edit-btn" onClick={() => setShowSetup(true)}>
          {isAR ? 'تعديل' : 'Edit'}
        </button>
      </div>

      {showSetup ? (
        /* ── Setup Modal ── */
        <div className="period-setup">
          <div className="period-setup__icon">🌸</div>
          <h2 className="period-setup__title">
            {isAR ? 'متى بدأت آخر دورة؟' : 'When did your last period start?'}
          </h2>
          <p className="period-setup__sub">
            {isAR ? 'هنستخدم ده عشان نحدد أفضل تمارين ليكِ كل يوم' : 'We\'ll use this to recommend the best workout for each day of your cycle'}
          </p>

          <div className="period-setup__field">
            <label>{isAR ? 'تاريخ بداية آخر دورة' : 'First day of last period'}</label>
            <input
              type="date"
              max={today}
              value={inputDate}
              onChange={e => setInputDate(e.target.value)}
              className="period-setup__input"
            />
          </div>

          <div className="period-setup__row">
            <div className="period-setup__field period-setup__field--half">
              <label>{isAR ? 'طول الدورة (أيام)' : 'Cycle length (days)'}</label>
              <select value={cycleLen} onChange={e => setCycleLen(+e.target.value)} className="period-setup__input">
                {[21,22,23,24,25,26,27,28,29,30,31,32,33,34,35].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="period-setup__field period-setup__field--half">
              <label>{isAR ? 'مدة النزيف (أيام)' : 'Period length (days)'}</label>
              <select value={periodLen} onChange={e => setPeriodLen(+e.target.value)} className="period-setup__input">
                {[2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="period-setup__btn"
            disabled={!inputDate}
            onClick={handleSave}
          >
            {isAR ? 'حفظ وبدء المتابعة ✓' : 'Save & Start Tracking ✓'}
          </button>

          <p className="period-setup__privacy">
            🔒 {isAR ? 'بياناتك تُحفظ على جهازك فقط' : 'Stored privately on your device only'}
          </p>
        </div>
      ) : (
        /* ── Tracker View ── */
        <div className="period-content">
          {/* Phase badge */}
          <div className="period-phase-badge" style={{ background: phaseCfg.bg, borderColor: phaseCfg.color }}>
            <span className="period-phase-icon">{phaseCfg.icon}</span>
            <span className="period-phase-name" style={{ color: phaseCfg.color }}>{phaseName}</span>
            <span className="period-phase-days" style={{ color: phaseCfg.color }}>
              {isAR ? `اليوم ${dayOfCycle}` : `Day ${dayOfCycle}`}
            </span>
          </div>

          {/* Cycle Ring */}
          <div className="period-ring-wrap">
            <CycleRing dayOfCycle={dayOfCycle} cycleLength={cycleData?.cycleLength || 28} />
          </div>

          {/* Workout Recommendation */}
          <div className="period-rec-card" style={{ borderColor: phaseCfg.color, background: phaseCfg.bg }}>
            <div className="period-rec-card__header">
              <span className="period-rec-card__label">
                {isAR ? 'توصية التمرين اليوم' : "Today's Workout Recommendation"}
              </span>
              <span className="period-rec-card__intensity" style={{ color: phaseCfg.color, background: phaseCfg.bg }}>
                {isAR ? 'شدة:' : 'Intensity:'} {rec.intensity}
              </span>
            </div>
            <div className="period-rec-card__title">{rec.title}</div>
            <div className="period-rec-card__body">{rec.body}</div>
          </div>

          {/* Phase Guide */}
          <div className="period-guide">
            <div className="period-guide__title">
              {isAR ? 'دليل المراحل' : 'Phase Guide'}
            </div>
            {Object.entries(PHASES).map(([key, cfg]) => (
              <div
                key={key}
                className={`period-guide__row ${key === currentPhase ? 'period-guide__row--active' : ''}`}
                style={key === currentPhase ? { borderColor: cfg.color, background: cfg.bg } : {}}
              >
                <span className="period-guide__dot" style={{ background: cfg.color }} />
                <div className="period-guide__info">
                  <span className="period-guide__phase-name" style={{ color: key === currentPhase ? cfg.color : 'var(--text-primary)' }}>
                    {cfg.icon} {PHASE_NAMES[isAR ? 'ar' : 'en'][key]}
                    <span className="period-guide__phase-days"> ({isAR ? 'يوم' : 'Day'} {cfg.days})</span>
                  </span>
                  <span className="period-guide__rec-short">
                    {WORKOUT_RECS[isAR ? 'ar' : 'en'][key].title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodTrackerScreen;
