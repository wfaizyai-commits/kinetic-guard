import React, { createContext, useContext, useState } from 'react';

const GENDER_KEY = 'fitguard_gender_v1';
const CYCLE_KEY  = 'fitguard_cycle_v1';

const GenderContext = createContext({ gender: null, setGender: () => {}, cycleData: null, setCycleData: () => {} });

export const GenderProvider = ({ children }) => {
  const [gender, setGenderState] = useState(() => {
    try { return localStorage.getItem(GENDER_KEY) || null; } catch { return null; }
  });

  const [cycleData, setCycleDataState] = useState(() => {
    try {
      const raw = localStorage.getItem(CYCLE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const setGender = (g) => {
    try { localStorage.setItem(GENDER_KEY, g); } catch {}
    setGenderState(g);
  };

  const setCycleData = (data) => {
    try { localStorage.setItem(CYCLE_KEY, JSON.stringify(data)); } catch {}
    setCycleDataState(data);
  };

  return (
    <GenderContext.Provider value={{ gender, setGender, cycleData, setCycleData }}>
      {children}
    </GenderContext.Provider>
  );
};

export const useGender = () => useContext(GenderContext);

// ── Cycle phase calculator ────────────────────────────────────────────────────
export const getCyclePhase = (lastPeriodDate, cycleLength = 28, periodLength = 5) => {
  if (!lastPeriodDate) return null;
  const today = new Date();
  const last  = new Date(lastPeriodDate);
  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  const dayOfCycle = (diffDays % cycleLength) + 1; // 1-indexed

  if (dayOfCycle <= periodLength)   return { phase: 'menstrual',  day: dayOfCycle };
  if (dayOfCycle <= 13)             return { phase: 'follicular', day: dayOfCycle };
  if (dayOfCycle <= 16)             return { phase: 'ovulation',  day: dayOfCycle };
  return                                   { phase: 'luteal',     day: dayOfCycle };
};
