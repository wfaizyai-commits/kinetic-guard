import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  loadGym, createSession, saveSession, finishSession,
  addExerciseToSession, updateSet, addSet, removeSet, removeExercise,
  calcVolume, getLastPerformance, getStats, getAllExercises,
  addCustomExercise, getExerciseHistory, PRESET_EXERCISES,
} from '../lib/gymTracker';
import { awardXP, recordWorkoutDay, calcWorkoutStreak } from '../lib/gamification';
import ScanExercise from '../components/ScanExercise';
import './GymTrackerScreen.css';

// ── Timer hook ────────────────────────────────────────────────────────────────
const useTimer = (startTime) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// ── Exercise picker modal ─────────────────────────────────────────────────────
const ExercisePicker = ({ onSelect, onClose, isRTL }) => {
  const [search, setSearch]       = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('');

  const all = getAllExercises();
  const filtered = search
    ? all.filter(e =>
        e.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        e.nameAr.includes(search) ||
        e.muscleEn.toLowerCase().includes(search.toLowerCase()) ||
        e.muscleAr?.includes(search)
      )
    : all;

  const MUSCLE_GROUPS = [...new Set(PRESET_EXERCISES.map(e => e.muscleEn))];

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const ex = {
      nameEn: customName, nameAr: customName,
      muscleEn: customMuscle || 'Other', muscleAr: customMuscle || 'أخرى', icon: '💪',
    };
    addCustomExercise(ex);
    onSelect({ ...ex, id: customName.toLowerCase().replace(/\s/g, '_') });
  };

  return (
    <div className="gym-picker-overlay" onClick={onClose}>
      <div className="gym-picker-sheet" onClick={e => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="gym-picker-header">
          <h3>{isRTL ? 'اختر تمرين' : 'Select Exercise'}</h3>
          <button className="gym-picker-close" onClick={onClose}>✕</button>
        </div>

        <input
          className="gym-picker-search"
          placeholder={isRTL ? 'ابحث عن تمرين...' : 'Search exercise...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />

        <div className="gym-picker-list">
          {filtered.map(ex => (
            <button key={ex.id} className="gym-picker-item" onClick={() => onSelect(ex)}>
              <span className="gym-picker-item__icon">{ex.icon}</span>
              <div className="gym-picker-item__info">
                <span className="gym-picker-item__name">{isRTL ? ex.nameAr : ex.nameEn}</span>
                <span className="gym-picker-item__muscle">{isRTL ? ex.muscleAr : ex.muscleEn}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Add custom */}
        <div className="gym-picker-custom">
          <button
            className="gym-picker-custom-toggle"
            onClick={() => setShowCustom(v => !v)}
          >
            {isRTL ? '+ أضف تمرين مخصص' : '+ Add custom exercise'}
          </button>
          {showCustom && (
            <div className="gym-picker-custom-form">
              <input
                className="gym-picker-search"
                placeholder={isRTL ? 'اسم التمرين' : 'Exercise name'}
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
              <input
                className="gym-picker-search"
                placeholder={isRTL ? 'المجموعة العضلية' : 'Muscle group'}
                value={customMuscle}
                onChange={e => setCustomMuscle(e.target.value)}
                style={{ marginTop: 8 }}
              />
              <button
                className="gym-add-set-btn"
                style={{ marginTop: 10, width: '100%' }}
                onClick={handleAddCustom}
                disabled={!customName.trim()}
              >
                {isRTL ? 'إضافة' : 'Add'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const GymTrackerScreen = ({ onBack }) => {
  const { lang, isRTL } = useLanguage();
  const [view, setView]         = useState('home'); // 'home' | 'active' | 'history' | 'finish'
  const [session, setSession]   = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showScan, setShowScan]     = useState(false);
  const [finishData, setFinishData] = useState(null);
  const [expandedEx, setExpandedEx] = useState(null);
  const timer = useTimer(session?.startTime);
  const stats = getStats();
  const { sessions } = loadGym();

  const startSession = () => {
    const s = createSession();
    setSession(s);
    setView('active');
  };

  const handleSelectExercise = (ex) => {
    const last = getLastPerformance(ex.id);
    // Pre-fill weight from last session if available
    let startWeight = '';
    if (last) startWeight = String(last.suggestion);
    // Cardio scans pre-fill the read numbers (duration as "reps", distance/cal in note)
    const firstSet = ex.cardio
      ? {
          weight: ex.cardio.distanceKm != null ? String(ex.cardio.distanceKm) : '',
          reps: ex.cardio.durationMin != null ? String(ex.cardio.durationMin) : '',
          done: true,
          cardio: ex.cardio,
        }
      : { weight: startWeight, reps: '', done: false };
    const withDefault = {
      ...ex,
      sets: [firstSet],
      lastPerf: last,
    };
    setSession(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...withDefault, sessionExId: Math.random().toString(36).slice(2) }],
    }));
    setShowPicker(false);
    setShowScan(false);
    setExpandedEx(session?.exercises.length); // auto-expand new exercise
  };

  // Scan flow can start from the home screen too — create a session first if needed.
  const handleScanAdd = (ex) => {
    if (!session) {
      const s = createSession();
      const firstSet = ex.cardio
        ? { weight: ex.cardio.distanceKm != null ? String(ex.cardio.distanceKm) : '',
            reps: ex.cardio.durationMin != null ? String(ex.cardio.durationMin) : '', done: true, cardio: ex.cardio }
        : { weight: '', reps: '', done: false };
      s.exercises = [{ ...ex, sets: [firstSet], sessionExId: Math.random().toString(36).slice(2) }];
      setSession(s);
      setShowScan(false);
      setView('active');
      setExpandedEx(0);
      return;
    }
    handleSelectExercise(ex);
  };

  const handleSetChange = (exIdx, setIdx, field, value) => {
    setSession(prev => updateSet(prev, exIdx, setIdx, field, value));
  };

  const toggleSetDone = (exIdx, setIdx) => {
    setSession(prev => {
      const ex   = prev.exercises[exIdx];
      const set  = ex.sets[setIdx];
      return updateSet(prev, exIdx, setIdx, 'done', !set.done);
    });
  };

  const handleAddSet = (exIdx) => {
    setSession(prev => addSet(prev, exIdx));
  };

  const handleRemoveSet = (exIdx, setIdx) => {
    setSession(prev => removeSet(prev, exIdx, setIdx));
  };

  const handleRemoveExercise = (exIdx) => {
    setSession(prev => removeExercise(prev, exIdx));
  };

  const handleFinish = () => {
    if (!session) return;
    const done    = finishSession(session);
    const streak  = calcWorkoutStreak();
    recordWorkoutDay();
    const xpRes   = awardXP({
      completedCount:  done.exercises.length,
      totalCount:      done.exercises.length,
      readinessScore:  75,
      streak,
      usedFormCheck:   false,
    });
    setFinishData({ session: done, xpResult: xpRes, streak });
    setView('finish');
  };

  const doneSetsCount = session
    ? session.exercises.reduce((t, ex) => t + ex.sets.filter(s => s.done).length, 0)
    : 0;
  const volume = session ? calcVolume(session.exercises) : 0;

  // ── FINISH VIEW ──────────────────────────────────────────────────────────────
  if (view === 'finish' && finishData) {
    const { session: done, xpResult, streak } = finishData;
    const dur = done.endTime && done.startTime
      ? Math.floor((done.endTime - done.startTime) / 60000)
      : 0;
    return (
      <div className="gym-screen screen" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="gym-finish-content">
          <div className="gym-finish-hero">
            <span className="gym-finish-trophy">🏆</span>
            <h1 className="gym-finish-title">{isRTL ? 'تمرين رائع!' : 'Great Session!'}</h1>
            <p className="gym-finish-sub">
              {isRTL ? 'سجّل التطبيق تمرينك بنجاح' : 'Your workout has been logged'}
            </p>
          </div>

          <div className="gym-finish-stats">
            <div className="gym-finish-stat">
              <span className="gym-finish-stat__val">{done.exercises.length}</span>
              <span className="gym-finish-stat__lbl">{isRTL ? 'تمارين' : 'Exercises'}</span>
            </div>
            <div className="gym-finish-stat">
              <span className="gym-finish-stat__val">{doneSetsCount || done.exercises.reduce((t,e)=>t+e.sets.filter(s=>s.done).length,0)}</span>
              <span className="gym-finish-stat__lbl">{isRTL ? 'سيتات' : 'Sets'}</span>
            </div>
            <div className="gym-finish-stat">
              <span className="gym-finish-stat__val">{dur}</span>
              <span className="gym-finish-stat__lbl">{isRTL ? 'دقيقة' : 'Min'}</span>
            </div>
            <div className="gym-finish-stat">
              <span className="gym-finish-stat__val">{Math.round(done.totalVolume)}</span>
              <span className="gym-finish-stat__lbl">{isRTL ? 'حجم كغ' : 'Vol kg'}</span>
            </div>
          </div>

          {/* XP earned */}
          <div className="gym-finish-xp">
            <span className="gym-finish-xp__plus">+{xpResult.earned}</span>
            <div>
              <p className="gym-finish-xp__label">{isRTL ? 'نقطة خبرة' : 'XP earned'}</p>
              <p className="gym-finish-xp__level">
                Lv.{xpResult.newLevel.level} — {isRTL ? xpResult.newLevel.titleAr : xpResult.newLevel.titleEn}
              </p>
            </div>
            {streak > 1 && (
              <span className="gym-finish-streak">🔥 {streak}{isRTL ? ' يوم' : 'd'}</span>
            )}
          </div>

          {xpResult.leveledUp && (
            <div className="gym-finish-levelup animate-scale-in">
              {isRTL ? '🎉 ارتقيت مستوى!' : '🎉 Level Up!'}
            </div>
          )}

          <button className="gym-finish-btn" onClick={() => { setSession(null); setView('home'); }}>
            {isRTL ? 'تمام 💪' : 'Done 💪'}
          </button>
        </div>
      </div>
    );
  }

  // ── ACTIVE SESSION VIEW ───────────────────────────────────────────────────────
  if (view === 'active' && session) {
    return (
      <div className="gym-screen screen" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Active header */}
        <div className="gym-active-header">
          <button className="gym-back-btn" onClick={() => { saveSession(session); setView('home'); }}>
            {isRTL ? '→' : '←'}
          </button>
          <div className="gym-timer-pill">
            <span className="gym-timer-dot" />
            <span className="gym-timer-text">{timer}</span>
          </div>
          <div className="gym-active-vol">
            <span className="gym-active-vol__num">{Math.round(volume)}</span>
            <span className="gym-active-vol__lbl">kg</span>
          </div>
        </div>

        <div className="gym-active-content">
          {session.exercises.length === 0 && (
            <div className="gym-empty-session">
              <span style={{ fontSize: 48 }}>🏋️</span>
              <p>{isRTL ? 'أضف أول تمرين لك' : 'Add your first exercise'}</p>
            </div>
          )}

          {session.exercises.map((ex, exIdx) => {
            const isExpanded = expandedEx === exIdx;
            const doneSets   = ex.sets.filter(s => s.done).length;
            return (
              <div key={ex.sessionExId} className="gym-exercise-card animate-fade-up">
                {/* Exercise header */}
                <div
                  className="gym-ex-header"
                  onClick={() => setExpandedEx(isExpanded ? null : exIdx)}
                >
                  <span className="gym-ex-icon">{ex.icon}</span>
                  <div className="gym-ex-info">
                    <span className="gym-ex-name">{isRTL ? ex.nameAr : ex.nameEn}</span>
                    <span className="gym-ex-muscle">{isRTL ? ex.muscleAr : ex.muscleEn}</span>
                  </div>
                  <div className="gym-ex-meta">
                    <span className="gym-ex-done-count">{doneSets}/{ex.sets.length}</span>
                    <span className="gym-ex-chevron">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Last performance hint */}
                {isExpanded && ex.lastPerf && (
                  <div className="gym-last-perf">
                    <span>📅 {isRTL ? 'آخر مرة:' : 'Last time:'}</span>
                    <span>{ex.lastPerf.lastWeight}kg × {ex.lastPerf.lastReps} reps</span>
                    {ex.lastPerf.shouldIncrease && (
                      <span className="gym-suggest-badge">
                        {isRTL ? `⬆️ جرب ${ex.lastPerf.suggestion}kg` : `⬆️ Try ${ex.lastPerf.suggestion}kg`}
                      </span>
                    )}
                  </div>
                )}

                {/* Sets table */}
                {isExpanded && (
                  <>
                    <div className="gym-sets-table">
                      <div className="gym-sets-header">
                        <span>{isRTL ? 'سيت' : 'Set'}</span>
                        <span>{isRTL ? 'وزن (كغ)' : 'Weight (kg)'}</span>
                        <span>{isRTL ? 'تكرار' : 'Reps'}</span>
                        <span>✓</span>
                      </div>
                      {ex.sets.map((set, setIdx) => (
                        <div key={setIdx} className={`gym-set-row ${set.done ? 'gym-set-row--done' : ''}`}>
                          <span className="gym-set-num">{setIdx + 1}</span>
                          <input
                            className="gym-set-input"
                            type="number"
                            inputMode="decimal"
                            placeholder="—"
                            value={set.weight}
                            onChange={e => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                          />
                          <input
                            className="gym-set-input"
                            type="number"
                            inputMode="numeric"
                            placeholder="—"
                            value={set.reps}
                            onChange={e => handleSetChange(exIdx, setIdx, 'reps', e.target.value)}
                          />
                          <button
                            className={`gym-set-done-btn ${set.done ? 'gym-set-done-btn--done anim-check-bounce' : ''}`}
                            onClick={() => toggleSetDone(exIdx, setIdx)}
                          >
                            {set.done ? '✓' : '○'}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="gym-ex-actions">
                      <button className="gym-add-set-btn" onClick={() => handleAddSet(exIdx)}>
                        {isRTL ? '+ سيت' : '+ Set'}
                      </button>
                      <button className="gym-remove-ex-btn" onClick={() => handleRemoveExercise(exIdx)}>
                        {isRTL ? '🗑 حذف' : '🗑 Remove'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Add exercise buttons — manual + AI scan */}
          <div className="gym-add-row">
            <button className="gym-add-ex-btn" onClick={() => setShowPicker(true)}>
              <span>+</span>
              <span>{isRTL ? 'إضافة تمرين' : 'Add Exercise'}</span>
            </button>
            <button className="gym-scan-btn" onClick={() => setShowScan(true)}>
              <span>📸</span>
              <span>{isRTL ? 'مسح بالذكاء' : 'AI Scan'}</span>
            </button>
          </div>

          {/* Finish button */}
          {session.exercises.length > 0 && (
            <button className="gym-finish-session-btn" onClick={handleFinish}>
              {isRTL ? 'إنهاء التمرين 🏁' : 'Finish Workout 🏁'}
            </button>
          )}
        </div>

        {showPicker && (
          <ExercisePicker
            onSelect={handleSelectExercise}
            onClose={() => setShowPicker(false)}
            isRTL={isRTL}
          />
        )}
        {showScan && (
          <ScanExercise lang={lang} onAdd={handleScanAdd} onClose={() => setShowScan(false)} />
        )}
      </div>
    );
  }

  // ── HISTORY VIEW ──────────────────────────────────────────────────────────────
  if (view === 'history') {
    const sorted = [...sessions].reverse();
    return (
      <div className="gym-screen screen" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="gym-header">
          <button className="gym-back-btn" onClick={() => setView('home')}>{isRTL ? '→' : '←'}</button>
          <h1 className="gym-title">{isRTL ? 'السجل' : 'History'}</h1>
          <div style={{ width: 36 }} />
        </div>
        <div className="gym-scroll-content">
          {sorted.length === 0 && (
            <div className="gym-empty-session">
              <span style={{ fontSize: 48 }}>📋</span>
              <p>{isRTL ? 'لا يوجد تمارين مسجلة بعد' : 'No sessions logged yet'}</p>
            </div>
          )}
          {sorted.map(s => {
            const dur = s.endTime && s.startTime ? Math.floor((s.endTime - s.startTime) / 60000) : 0;
            return (
              <div key={s.id} className="gym-history-card animate-fade-up">
                <div className="gym-history-date">{s.date}</div>
                <div className="gym-history-body">
                  <div className="gym-history-exercises">
                    {s.exercises.map((ex, i) => (
                      <span key={i} className="gym-history-ex-chip">
                        {ex.icon} {isRTL ? ex.nameAr : ex.nameEn}
                      </span>
                    ))}
                  </div>
                  <div className="gym-history-stats">
                    <span>💪 {s.exercises.length} {isRTL ? 'تمارين' : 'exs'}</span>
                    <span>⏱ {dur} {isRTL ? 'د' : 'min'}</span>
                    <span>📦 {Math.round(s.totalVolume || 0)} kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── HOME VIEW ──────────────────────────────────────────────────────────────────
  return (
    <div className="gym-screen screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="gym-header">
        <button className="gym-back-btn" onClick={onBack}>{isRTL ? '→' : '←'}</button>
        <h1 className="gym-title">{isRTL ? 'تتبع الجيم' : 'Gym Tracker'}</h1>
        <button className="gym-history-btn" onClick={() => setView('history')}>
          {isRTL ? 'السجل' : 'History'}
        </button>
      </div>

      <div className="gym-scroll-content">

        {/* Stats row */}
        <div className="gym-stats-row animate-fade-up">
          <div className="gym-stat-card">
            <span className="gym-stat-card__val">{stats.total}</span>
            <span className="gym-stat-card__lbl">{isRTL ? 'كل التمارين' : 'Total Sessions'}</span>
          </div>
          <div className="gym-stat-card">
            <span className="gym-stat-card__val">{stats.thisWeek}</span>
            <span className="gym-stat-card__lbl">{isRTL ? 'هذا الأسبوع' : 'This Week'}</span>
          </div>
          <div className="gym-stat-card">
            <span className="gym-stat-card__val">{Math.round((stats.totalVol || 0) / 1000)}t</span>
            <span className="gym-stat-card__lbl">{isRTL ? 'إجمالي الحجم' : 'Total Volume'}</span>
          </div>
        </div>

        {/* Start button */}
        <button className="gym-start-btn animate-fade-up" style={{ animationDelay: '0.1s' }} onClick={startSession}>
          <div className="gym-start-btn__inner">
            <span className="gym-start-btn__icon">🏋️</span>
            <div>
              <p className="gym-start-btn__title">{isRTL ? 'ابدأ تمرين جديد' : 'Start New Session'}</p>
              <p className="gym-start-btn__sub">{isRTL ? 'سجّل تمارينك بالوزن والسيتات' : 'Log exercises with weight & sets'}</p>
            </div>
          </div>
          <span className="gym-start-btn__arrow">{isRTL ? '←' : '→'}</span>
        </button>

        {/* AI Scan shortcut from home */}
        <button className="gym-scan-home-btn animate-fade-up" style={{ animationDelay: '0.12s' }} onClick={() => setShowScan(true)}>
          <span className="gym-scan-home-btn__icon">📸</span>
          <div>
            <p className="gym-scan-home-btn__title">{isRTL ? 'مسح تمرين بالذكاء' : 'AI Scan an Exercise'}</p>
            <p className="gym-scan-home-btn__sub">{isRTL ? 'صوّر الجهاز أو الشاشة — يتعرّف ويسجّل' : 'Snap a machine or screen — it detects & logs'}</p>
          </div>
          <span className="gym-scan-home-btn__badge">{isRTL ? 'جديد' : 'NEW'}</span>
        </button>

        {/* Last session */}
        {stats.last && (
          <div className="gym-last-session animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <p className="db-section-label">{isRTL ? 'آخر تمرين' : 'LAST SESSION'}</p>
            <div className="gym-last-session__card">
              <div className="gym-last-session__date">{stats.last.date}</div>
              <div className="gym-last-session__exercises">
                {stats.last.exercises.slice(0, 4).map((ex, i) => (
                  <span key={i} className="gym-history-ex-chip">
                    {ex.icon} {isRTL ? ex.nameAr : ex.nameEn}
                  </span>
                ))}
                {stats.last.exercises.length > 4 && (
                  <span className="gym-history-ex-chip">+{stats.last.exercises.length - 4}</span>
                )}
              </div>
              <div className="gym-history-stats">
                <span>💪 {stats.last.exercises.length} {isRTL ? 'تمارين' : 'exercises'}</span>
                <span>📦 {Math.round(stats.last.totalVolume || 0)} kg {isRTL ? 'حجم' : 'volume'}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {showScan && (
        <ScanExercise lang={lang} onAdd={handleScanAdd} onClose={() => setShowScan(false)} />
      )}
    </div>
  );
};

export default GymTrackerScreen;
