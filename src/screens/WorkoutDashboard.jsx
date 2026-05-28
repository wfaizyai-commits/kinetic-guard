import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useGender, getCyclePhase } from '../i18n/GenderContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import {
  fetchPrayerTimes,
  getNextPrayerIndex,
  minutesUntilNext,
  PRAYER_KEYS,
} from '../lib/prayerTimes';
import { initHealthKit, refreshHealthKit, isHealthKitAvailable, loadHKCache } from '../lib/healthKit';
import './WorkoutDashboard.css';

// ── 12-hour time helper ───────────────────────────────────────────────────────
const to12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// ── Workout library ───────────────────────────────────────────────────────────
// category: 'strength' | 'cardio' | 'core'
const WORKOUTS_BY_TIER = {
  novice: {
    en: [
      { id: 1, name: 'Bodyweight Squat',        sets: 3, reps: '12–15',    rest: '60s', muscle: 'Legs',   icon: '🦵', category: 'strength' },
      { id: 2, name: 'Wall Push-Up',            sets: 3, reps: '10–12',    rest: '60s', muscle: 'Chest',  icon: '💪', category: 'strength' },
      { id: 3, name: 'Glute Bridge',            sets: 3, reps: '15',       rest: '45s', muscle: 'Glutes', icon: '🍑', category: 'strength' },
      { id: 4, name: 'Dead Bug',                sets: 2, reps: '8 each',   rest: '60s', muscle: 'Core',   icon: '🪲', category: 'core' },
      { id: 5, name: 'Jumping Jack',            sets: 2, reps: '20',       rest: '45s', muscle: 'Cardio', icon: '⭐', category: 'cardio' },
      { id: 6, name: 'Lunge',                   sets: 2, reps: '10 each',  rest: '60s', muscle: 'Legs',   icon: '🦵', category: 'strength' },
    ],
    ar: [
      { id: 1, name: 'قرفصاء بوزن الجسم',       sets: 3, reps: '12–15',      rest: '60ث', muscle: 'أرجل',  icon: '🦵', category: 'strength' },
      { id: 2, name: 'تمرين الضغط على الجدار',   sets: 3, reps: '10–12',      rest: '60ث', muscle: 'صدر',   icon: '💪', category: 'strength' },
      { id: 3, name: 'جسر الأرداف',              sets: 3, reps: '15',          rest: '45ث', muscle: 'أرداف', icon: '🍑', category: 'strength' },
      { id: 4, name: 'الدودة الميتة',            sets: 2, reps: '8 لكل جانب', rest: '60ث', muscle: 'جذع',   icon: '🪲', category: 'core' },
      { id: 5, name: 'قفز النجمة',               sets: 2, reps: '20',          rest: '45ث', muscle: 'كارديو',icon: '⭐', category: 'cardio' },
      { id: 6, name: 'تمرين الطعنة',             sets: 2, reps: '10 لكل جانب',rest: '60ث', muscle: 'أرجل',  icon: '🦵', category: 'strength' },
    ]
  },
  intermediate: {
    en: [
      { id: 1, name: 'Goblet Squat',        sets: 4, reps: '10',       rest: '90s', muscle: 'Legs',       icon: '🦵', category: 'strength' },
      { id: 2, name: 'Push-Up',             sets: 4, reps: '12',       rest: '60s', muscle: 'Chest',      icon: '💪', category: 'strength' },
      { id: 3, name: 'Romanian Deadlift',   sets: 3, reps: '10',       rest: '90s', muscle: 'Hamstrings', icon: '🔥', category: 'strength' },
      { id: 4, name: 'Dumbbell Row',        sets: 3, reps: '12 each',  rest: '75s', muscle: 'Back',       icon: '🏋️', category: 'strength' },
      { id: 5, name: 'Plank',               sets: 3, reps: '30–45s',   rest: '45s', muscle: 'Core',       icon: '⚡', category: 'core' },
      { id: 6, name: 'Mountain Climber',    sets: 3, reps: '20 each',  rest: '45s', muscle: 'Core',       icon: '🧗', category: 'cardio' },
      { id: 7, name: 'Lunge',               sets: 3, reps: '12 each',  rest: '60s', muscle: 'Legs',       icon: '🦵', category: 'strength' },
    ],
    ar: [
      { id: 1, name: 'قرفصاء الكأس',      sets: 4, reps: '10',             rest: '90ث', muscle: 'أرجل',         icon: '🦵', category: 'strength' },
      { id: 2, name: 'تمرين الضغط',       sets: 4, reps: '12',             rest: '60ث', muscle: 'صدر',          icon: '💪', category: 'strength' },
      { id: 3, name: 'رفع أرومانية',      sets: 3, reps: '10',             rest: '90ث', muscle: 'أوتار العرقوب', icon: '🔥', category: 'strength' },
      { id: 4, name: 'تجديف بالدمبل',    sets: 3, reps: '12 لكل جانب',   rest: '75ث', muscle: 'ظهر',          icon: '🏋️', category: 'strength' },
      { id: 5, name: 'بلانك',             sets: 3, reps: '30–45ث',         rest: '45ث', muscle: 'جذع',          icon: '⚡', category: 'core' },
      { id: 6, name: 'تسلق الجبل',        sets: 3, reps: '20 لكل جانب',   rest: '45ث', muscle: 'جذع',          icon: '🧗', category: 'cardio' },
      { id: 7, name: 'تمرين الطعنة',      sets: 3, reps: '12 لكل جانب',   rest: '60ث', muscle: 'أرجل',         icon: '🦵', category: 'strength' },
    ]
  },
  advanced: {
    en: [
      { id: 1, name: 'Barbell Back Squat', sets: 5, reps: '5',    rest: '3 min', muscle: 'Full Body',  icon: '🏋️', category: 'strength' },
      { id: 2, name: 'Bench Press',        sets: 4, reps: '8',    rest: '2 min', muscle: 'Chest',      icon: '💪', category: 'strength' },
      { id: 3, name: 'Deadlift',           sets: 3, reps: '5',    rest: '3 min', muscle: 'Full Body',  icon: '🔥', category: 'strength' },
      { id: 4, name: 'Pull-Up',            sets: 4, reps: '8–10', rest: '90s',   muscle: 'Back',       icon: '⚡', category: 'strength' },
      { id: 5, name: 'Overhead Press',     sets: 4, reps: '8',    rest: '2 min', muscle: 'Shoulders',  icon: '🎯', category: 'strength' },
      { id: 6, name: 'Bicycle Crunch',     sets: 3, reps: '20 each',rest: '45s', muscle: 'Core',       icon: '🚴', category: 'core' },
      { id: 7, name: 'Mountain Climber',   sets: 4, reps: '30 each',rest: '30s', muscle: 'Cardio',     icon: '🧗', category: 'cardio' },
    ],
    ar: [
      { id: 1, name: 'قرفصاء بالبار',       sets: 5, reps: '5',             rest: '3 دقائق', muscle: 'الجسم كله', icon: '🏋️', category: 'strength' },
      { id: 2, name: 'ضغط البنش',           sets: 4, reps: '8',             rest: 'دقيقتان', muscle: 'صدر',       icon: '💪', category: 'strength' },
      { id: 3, name: 'رفع ميت',             sets: 3, reps: '5',             rest: '3 دقائق', muscle: 'الجسم كله', icon: '🔥', category: 'strength' },
      { id: 4, name: 'سحب علوي',            sets: 4, reps: '8–10',          rest: '90ث',     muscle: 'ظهر',       icon: '⚡', category: 'strength' },
      { id: 5, name: 'ضغط فوق الرأس',       sets: 4, reps: '8',             rest: 'دقيقتان', muscle: 'أكتاف',     icon: '🎯', category: 'strength' },
      { id: 6, name: 'كرنش الدراجة',        sets: 3, reps: '20 لكل جانب',  rest: '45ث',     muscle: 'جذع',       icon: '🚴', category: 'core' },
      { id: 7, name: 'تسلق الجبل',          sets: 4, reps: '30 لكل جانب',  rest: '30ث',     muscle: 'كارديو',    icon: '🧗', category: 'cardio' },
    ]
  }
};

// ── Women's workout library ───────────────────────────────────────────────────
const WORKOUTS_WOMEN = {
  novice: {
    en: [
      { id: 1, name: 'Glute Bridge',       sets: 3, reps: '15–20',   rest: '45s', muscle: 'Glutes', icon: '🍑', category: 'strength' },
      { id: 2, name: 'Bodyweight Squat',   sets: 3, reps: '12–15',   rest: '60s', muscle: 'Legs',   icon: '🦵', category: 'strength' },
      { id: 3, name: 'Wall Push-Up',       sets: 3, reps: '10–12',   rest: '60s', muscle: 'Chest',  icon: '💪', category: 'strength' },
      { id: 4, name: 'Dead Bug',           sets: 2, reps: '8 each',  rest: '60s', muscle: 'Core',   icon: '🪲', category: 'core' },
      { id: 5, name: 'Lunge',              sets: 2, reps: '10 each', rest: '60s', muscle: 'Legs',   icon: '🦵', category: 'strength' },
      { id: 6, name: 'Jumping Jack',       sets: 2, reps: '20',      rest: '45s', muscle: 'Cardio', icon: '⭐', category: 'cardio' },
    ],
    ar: [
      { id: 1, name: 'جسر الأرداف',             sets: 3, reps: '15–20',          rest: '45ث', muscle: 'أرداف',  icon: '🍑', category: 'strength' },
      { id: 2, name: 'قرفصاء بوزن الجسم',       sets: 3, reps: '12–15',          rest: '60ث', muscle: 'أرجل',   icon: '🦵', category: 'strength' },
      { id: 3, name: 'تمرين الضغط على الجدار',   sets: 3, reps: '10–12',          rest: '60ث', muscle: 'صدر',    icon: '💪', category: 'strength' },
      { id: 4, name: 'الدودة الميتة',            sets: 2, reps: '8 لكل جانب',    rest: '60ث', muscle: 'جذع',    icon: '🪲', category: 'core' },
      { id: 5, name: 'تمرين الطعنة',             sets: 2, reps: '10 لكل جانب',   rest: '60ث', muscle: 'أرجل',   icon: '🦵', category: 'strength' },
      { id: 6, name: 'قفز النجمة',               sets: 2, reps: '20',             rest: '45ث', muscle: 'كارديو', icon: '⭐', category: 'cardio' },
    ]
  },
  intermediate: {
    en: [
      { id: 1, name: 'Glute Bridge',       sets: 4, reps: '15',      rest: '45s', muscle: 'Glutes',     icon: '🍑', category: 'strength' },
      { id: 2, name: 'Goblet Squat',       sets: 3, reps: '12',      rest: '75s', muscle: 'Legs',       icon: '🦵', category: 'strength' },
      { id: 3, name: 'Romanian Deadlift',  sets: 3, reps: '10',      rest: '90s', muscle: 'Hamstrings', icon: '🔥', category: 'strength' },
      { id: 4, name: 'Push-Up',            sets: 3, reps: '10–12',   rest: '60s', muscle: 'Chest',      icon: '💪', category: 'strength' },
      { id: 5, name: 'Plank',              sets: 3, reps: '30–45s',  rest: '45s', muscle: 'Core',       icon: '⚡', category: 'core' },
      { id: 6, name: 'Lunge',              sets: 3, reps: '12 each', rest: '60s', muscle: 'Legs',       icon: '🦵', category: 'strength' },
      { id: 7, name: 'Bicycle Crunch',     sets: 3, reps: '20 each', rest: '45s', muscle: 'Core',       icon: '🚴', category: 'core' },
    ],
    ar: [
      { id: 1, name: 'جسر الأرداف',      sets: 4, reps: '15',            rest: '45ث', muscle: 'أرداف',         icon: '🍑', category: 'strength' },
      { id: 2, name: 'قرفصاء الكأس',     sets: 3, reps: '12',            rest: '75ث', muscle: 'أرجل',          icon: '🦵', category: 'strength' },
      { id: 3, name: 'رفع أرومانية',     sets: 3, reps: '10',            rest: '90ث', muscle: 'أوتار العرقوب', icon: '🔥', category: 'strength' },
      { id: 4, name: 'تمرين الضغط',      sets: 3, reps: '10–12',         rest: '60ث', muscle: 'صدر',           icon: '💪', category: 'strength' },
      { id: 5, name: 'بلانك',            sets: 3, reps: '30–45ث',        rest: '45ث', muscle: 'جذع',           icon: '⚡', category: 'core' },
      { id: 6, name: 'تمرين الطعنة',     sets: 3, reps: '12 لكل جانب',  rest: '60ث', muscle: 'أرجل',          icon: '🦵', category: 'strength' },
      { id: 7, name: 'كرنش الدراجة',     sets: 3, reps: '20 لكل جانب',  rest: '45ث', muscle: 'جذع',           icon: '🚴', category: 'core' },
    ]
  },
  advanced: {
    en: [
      { id: 1, name: 'Glute Bridge',       sets: 4, reps: '15',      rest: '60s',   muscle: 'Glutes',    icon: '🍑', category: 'strength' },
      { id: 2, name: 'Barbell Back Squat', sets: 4, reps: '8',       rest: '2 min', muscle: 'Legs',      icon: '🏋️', category: 'strength' },
      { id: 3, name: 'Deadlift',           sets: 3, reps: '6',       rest: '3 min', muscle: 'Full Body', icon: '🔥', category: 'strength' },
      { id: 4, name: 'Pull-Up',            sets: 3, reps: '6–8',     rest: '90s',   muscle: 'Back',      icon: '⚡', category: 'strength' },
      { id: 5, name: 'Overhead Press',     sets: 3, reps: '8',       rest: '90s',   muscle: 'Shoulders', icon: '🎯', category: 'strength' },
      { id: 6, name: 'Mountain Climber',   sets: 3, reps: '20 each', rest: '45s',   muscle: 'Cardio',    icon: '🧗', category: 'cardio' },
      { id: 7, name: 'Bicycle Crunch',     sets: 4, reps: '25 each', rest: '30s',   muscle: 'Core',      icon: '🚴', category: 'core' },
    ],
    ar: [
      { id: 1, name: 'جسر الأرداف',      sets: 4, reps: '15',            rest: '60ث',     muscle: 'أرداف',     icon: '🍑', category: 'strength' },
      { id: 2, name: 'قرفصاء بالبار',    sets: 4, reps: '8',             rest: 'دقيقتان', muscle: 'أرجل',      icon: '🏋️', category: 'strength' },
      { id: 3, name: 'رفع ميت',          sets: 3, reps: '6',             rest: '3 دقائق', muscle: 'الجسم كله', icon: '🔥', category: 'strength' },
      { id: 4, name: 'سحب علوي',         sets: 3, reps: '6–8',           rest: '90ث',     muscle: 'ظهر',       icon: '⚡', category: 'strength' },
      { id: 5, name: 'ضغط فوق الرأس',    sets: 3, reps: '8',             rest: '90ث',     muscle: 'أكتاف',     icon: '🎯', category: 'strength' },
      { id: 6, name: 'تسلق الجبل',       sets: 3, reps: '20 لكل جانب',  rest: '45ث',     muscle: 'كارديو',    icon: '🧗', category: 'cardio' },
      { id: 7, name: 'كرنش الدراجة',     sets: 4, reps: '25 لكل جانب',  rest: '30ث',     muscle: 'جذع',       icon: '🚴', category: 'core' },
    ]
  }
};

// ── Health data (localStorage) ────────────────────────────────────────────────
const HEALTH_KEY = 'fitguard_health_v2';
const todayStr = () => new Date().toISOString().slice(0, 10);

const defaultHealth = () => ({
  date: todayStr(),
  steps: 6840,
  calories: 380,
  activeMinutes: 28,
  weekWorkouts: [1, 0, 1, 1, 0, 0, 0],
});

const loadHealth = () => {
  try {
    const raw = localStorage.getItem(HEALTH_KEY);
    if (!raw) return defaultHealth();
    const d = JSON.parse(raw);
    if (d.date !== todayStr()) {
      return { ...d, date: todayStr(), steps: 0, calories: 0, activeMinutes: 0 };
    }
    return d;
  } catch { return defaultHealth(); }
};

const saveHealth = (data) => {
  try { localStorage.setItem(HEALTH_KEY, JSON.stringify(data)); } catch {}
};

export const recordWorkoutComplete = (durationMinutes = 30, calsBurned = 220) => {
  const h = loadHealth();
  const dayOfWeek = (new Date().getDay() + 6) % 7;
  const weeks = [...(h.weekWorkouts || [0,0,0,0,0,0,0])];
  weeks[dayOfWeek] = (weeks[dayOfWeek] || 0) + 1;
  saveHealth({
    ...h,
    calories: (h.calories || 0) + calsBurned,
    activeMinutes: (h.activeMinutes || 0) + durationMinutes,
    weekWorkouts: weeks,
  });
};

// ── Tier config ───────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  novice:       { score: 45, next: 'Intermediate', nextAr: 'متوسط', color: '#00E5FF', pct: 0.45 },
  intermediate: { score: 68, next: 'Advanced',     nextAr: 'متقدم', color: '#FF6B00', pct: 0.68 },
  advanced:     { score: 100,next: 'Elite',         nextAr: 'نخبة',  color: '#FFB800', pct: 1.00 },
};

// ── Tips / Nutrition content data ────────────────────────────────────────────

const DAILY_TIPS = {
  en: [
    { icon: '💧', title: 'Hydrate Well',              tip: 'Drink 2–3 litres of water daily. Add 500ml for every hour of intense exercise.' },
    { icon: '😴', title: 'Sleep to Grow',             tip: '80% of muscle repair happens during deep sleep. Aim for 7–9 hours every night.' },
    { icon: '🥩', title: 'Protein Timing',            tip: 'Eat 20–40g of protein within 2 hours after training for optimal muscle recovery.' },
    { icon: '🧘', title: 'Rest Days Matter',          tip: 'Muscles grow on rest days, not during workouts. Never skip your recovery days.' },
    { icon: '🫀', title: 'Always Warm Up',            tip: 'A 5–10 minute warm-up reduces injury risk by up to 50%. Never skip it.' },
    { icon: '🧂', title: 'Replenish Electrolytes',    tip: 'After intense sweating, replenish sodium, potassium, and magnesium to avoid cramps.' },
    { icon: '🫁', title: 'Breathe Right',             tip: 'Exhale on exertion (the lift), inhale on release. Proper breathing equals more power.' },
    { icon: '🌞', title: 'Morning Sunlight',          tip: '10 minutes of morning sun boosts Vitamin D and resets your sleep-wake cycle.' },
    { icon: '🍌', title: 'Pre-Workout Carbs',         tip: 'A banana or 3 dates 30–60 min before training gives clean, sustained energy.' },
    { icon: '🧠', title: 'Mind-Muscle Focus',         tip: 'Consciously focusing on the muscle you\'re working can increase its activation by 20–30%.' },
    { icon: '🦶', title: 'Foam Roll Daily',           tip: '5 minutes of foam rolling improves blood flow and reduces next-day soreness.' },
    { icon: '🥗', title: 'Eat the Rainbow',           tip: 'Each colour of vegetable provides different phytonutrients your body cannot make itself.' },
    { icon: '⏰', title: 'Train Consistently',        tip: 'Exercising at the same time each day optimises hormones and improves long-term results.' },
    { icon: '🍳', title: 'Breakfast Matters',         tip: 'A protein-rich breakfast regulates hunger hormones and fuels sustained morning energy.' },
  ],
  ar: [
    { icon: '💧', title: 'الترطيب الجيد',            tip: 'اشرب 2–3 لترات من الماء يومياً. أضف 500 مل لكل ساعة تمرين مكثف.' },
    { icon: '😴', title: 'النوم للنمو',              tip: '80% من إصلاح العضلات يحدث أثناء النوم العميق. استهدف 7–9 ساعات كل ليلة.' },
    { icon: '🥩', title: 'توقيت البروتين',           tip: 'تناول 20–40 غرام من البروتين خلال ساعتين بعد التمرين للتعافي الأمثل.' },
    { icon: '🧘', title: 'أيام الراحة أساسية',       tip: 'تنمو العضلات في أيام الراحة، لا أثناء التمارين. لا تتجاهل التعافي أبداً.' },
    { icon: '🫀', title: 'الإحماء دائماً',           tip: 'الإحماء لـ 5–10 دقائق يقلل خطر الإصابة بنسبة 50%. لا تتجاوزه أبداً.' },
    { icon: '🧂', title: 'تعويض الإلكتروليتات',      tip: 'بعد التعرق الشديد، عوّض الصوديوم والبوتاسيوم والمغنيسيوم لتجنب التشنجات.' },
    { icon: '🫁', title: 'التنفس الصحيح',            tip: 'ازفر عند المجهود (الرفع)، وشهق عند الإفراج. التنفس الصحيح = قوة أكبر.' },
    { icon: '🌞', title: 'ضوء الصباح',              tip: '10 دقائق من شمس الصباح تعزز فيتامين D وتنظم دورة النوم والاستيقاظ.' },
    { icon: '🍌', title: 'كربوهيدرات قبل التمرين',   tip: 'موزة أو 3 تمرات قبل 30–60 دقيقة من التمرين تمنحك طاقة نظيفة ومستدامة.' },
    { icon: '🧠', title: 'التركيز العضلي الذهني',    tip: 'التركيز على العضلة التي تعمل يمكن أن يزيد تنشيطها بنسبة 20–30%.' },
    { icon: '🦶', title: 'الفوم رول يومياً',         tip: '5 دقائق من الفوم رول تحسن تدفق الدم وتقلل آلام اليوم التالي.' },
    { icon: '🥗', title: 'كل ألوان الطيف',          tip: 'كل لون من الخضروات يوفر مغذيات نباتية مختلفة لا يستطيع جسمك إنتاجها.' },
    { icon: '⏰', title: 'انتظام التمرين',           tip: 'ممارسة الرياضة في نفس الوقت يومياً تُحسّن الهرمونات وتحقق نتائج أفضل.' },
    { icon: '🍳', title: 'الإفطار مهم',             tip: 'الإفطار الغني بالبروتين ينظم هرمونات الجوع ويوفر طاقة صباحية مستدامة.' },
  ],
};


// ── Activity Rings ────────────────────────────────────────────────────────────
const ActivityRings = ({ move, exercise, stand, animated }) => {
  const rings = [
    { r: 52, color: '#FF6B00', value: move,     goal: 500, width: 10 },
    { r: 38, color: '#00FF88', value: exercise, goal: 30,  width: 9  },
    { r: 25, color: '#00C8FF', value: stand,    goal: 5,   width: 8  },
  ];
  return (
    <svg className="activity-rings-svg" viewBox="0 0 124 124" xmlns="http://www.w3.org/2000/svg">
      {rings.map((ring, i) => {
        const c = 2 * Math.PI * ring.r;
        const pct = Math.min(ring.value / ring.goal, 1);
        const offset = c - pct * c;
        return (
          <g key={i}>
            <circle cx="62" cy="62" r={ring.r} fill="none" stroke={ring.color} strokeWidth={ring.width} opacity="0.12" />
            <circle cx="62" cy="62" r={ring.r} fill="none" stroke={ring.color} strokeWidth={ring.width}
              strokeLinecap="round" strokeDasharray={c} strokeDashoffset={animated ? offset : c}
              transform="rotate(-90 62 62)"
              style={{ filter: `drop-shadow(0 0 4px ${ring.color}80)`, transition: animated ? `stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.25}s` : 'none' }}
            />
          </g>
        );
      })}
    </svg>
  );
};

// ── Weekly Chart ──────────────────────────────────────────────────────────────
const WeeklyChart = ({ data, days, isRTL }) => {
  const max = Math.max(...data, 1);
  const todayIdx = (new Date().getDay() + 6) % 7;
  const ordered = isRTL ? [...data].reverse() : data;
  const orderedDays = isRTL ? [...days].reverse() : days;
  return (
    <div className="weekly-chart">
      {ordered.map((val, i) => {
        const actualIdx = isRTL ? 6 - i : i;
        const isToday = actualIdx === todayIdx;
        const pct = (val / max) * 100;
        return (
          <div key={i} className="weekly-chart__col">
            <div className="weekly-chart__bar-wrap">
              <div
                className={`weekly-chart__bar ${isToday ? 'weekly-chart__bar--today' : ''} ${val > 0 ? 'weekly-chart__bar--active' : ''}`}
                style={{ height: `${Math.max(pct, val > 0 ? 20 : 4)}%` }}
              />
            </div>
            <span className={`weekly-chart__label ${isToday ? 'weekly-chart__label--today' : ''}`}>{orderedDays[i]}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Prayer Times Tab ──────────────────────────────────────────────────────────
const PrayerTab = () => {
  const { t, isRTL } = useLanguage();
  const tp = t.prayer || {};

  const [state, setState]       = useState('loading');
  const [prayerData, setPrayerData] = useState(null);
  const [nextIdx, setNextIdx]   = useState(-1);
  const [minsLeft, setMinsLeft] = useState(0);

  useEffect(() => {
    fetchPrayerTimes()
      .then((data) => {
        const idx  = getNextPrayerIndex(data.prayers);
        const mins = minutesUntilNext(idx, data.prayers);
        setPrayerData(data);
        setNextIdx(idx);
        setMinsLeft(mins);
        setState('ready');
      })
      .catch((err) => {
        if (err.message === 'location_denied') setState('denied');
        else setState('error');
      });
  }, []);

  useEffect(() => {
    if (state !== 'ready' || !prayerData) return;
    const id = setInterval(() => {
      const idx  = getNextPrayerIndex(prayerData.prayers);
      const mins = minutesUntilNext(idx, prayerData.prayers);
      setNextIdx(idx);
      setMinsLeft(mins);
    }, 60_000);
    return () => clearInterval(id);
  }, [state, prayerData]);

  if (state === 'loading') {
    return (
      <div className="tab-content">
        <div className="prayer-tab-header">
          <h2 className="prayer-tab-title">{tp.title || 'PRAYER TIMES'}</h2>
        </div>
        <div className="prayer-loading" style={{ padding: '60px 0' }}>
          <span className="prayer-loading-dot"/><span className="prayer-loading-dot"/><span className="prayer-loading-dot"/>
        </div>
      </div>
    );
  }

  if (state === 'denied' || state === 'error') {
    return (
      <div className="tab-content">
        <div className="prayer-tab-header">
          <h2 className="prayer-tab-title">{tp.title || 'PRAYER TIMES'}</h2>
        </div>
        <div className="prayer-unavailable" style={{ marginTop: 40 }}>
          <span style={{ fontSize: 48 }}>🕌</span>
          <p>{state === 'denied' ? (tp.locationDenied || 'Location access denied') : (tp.error || 'Unable to load prayer times')}</p>
        </div>
      </div>
    );
  }

  const { prayers, city } = prayerData;
  const nextPrayerKey  = nextIdx >= 0 ? prayers[nextIdx].key : 'Fajr';
  const nextPrayerName = tp.names?.[nextPrayerKey] || nextPrayerKey;

  const countdownHours = Math.floor(minsLeft / 60);
  const countdownMins  = minsLeft % 60;
  const countdownText  = countdownHours > 0
    ? (isRTL ? `${countdownHours}س ${countdownMins}د` : `${countdownHours}h ${countdownMins}m`)
    : (isRTL ? `${minsLeft} ${tp.min || 'min'}` : `${minsLeft} ${tp.min || 'min'}`);

  return (
    <div className="tab-content">
      {/* Header */}
      <div className="prayer-tab-header">
        <h2 className="prayer-tab-title">{tp.title || 'PRAYER TIMES'}</h2>
        {city && <span className="prayer-city">📍 {city}</span>}
      </div>

      {/* Next prayer big pill */}
      <div className="prayer-next-pill prayer-next-pill--large animate-fade-up">
        <span className="prayer-next-icon" style={{ fontSize: 32 }}>🕌</span>
        <div className="prayer-next-info">
          <span className="prayer-next-label">{tp.next || 'Next prayer'}</span>
          <span className="prayer-next-name" style={{ fontSize: 20 }}>
            {nextIdx >= 0 ? nextPrayerName : (tp.tomorrow || 'Tomorrow — Fajr')}
          </span>
          <span className="prayer-next-countdown">
            {tp.in || 'in'} {countdownText}
          </span>
        </div>
        <div className="prayer-next-time" style={{ fontSize: 22 }}>
          {to12h(nextIdx >= 0 ? prayers[nextIdx].time : prayers[0].time)}
        </div>
      </div>

      {/* All 5 prayers — full list */}
      <div className="prayer-full-list animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {prayers.map((p, i) => {
          const isNext = i === nextIdx;
          const isPast = nextIdx >= 0 ? i < nextIdx : true;
          return (
            <div key={p.key} className={`prayer-full-row ${isNext ? 'prayer-full-row--next' : ''} ${isPast ? 'prayer-full-row--past' : ''}`}>
              <div className="prayer-full-row__left">
                {isNext && <span className="prayer-row__dot" style={{ marginRight: 8 }} />}
                <span className="prayer-full-row__name">{tp.names?.[p.key] || p.key}</span>
              </div>
              <span className="prayer-full-row__time">{to12h(p.time)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ── Watch / HealthKit Tab ─────────────────────────────────────────────────────
const WatchTab = ({ health, setHealth, hkLive, setHkLive }) => {
  const { isRTL } = useLanguage();
  const available = isHealthKitAvailable();

  const [syncing, setSyncing]             = useState(false);
  const [lastSync, setLastSync]           = useState(null);
  const [syncStatus, setSyncStatus]       = useState(null); // 'ok' | 'no_data' | 'error'
  const [syncMsg, setSyncMsg]             = useState('');
  const [huaweiSetup, setHuaweiSetup]     = useState(false);
  const [pendingReturn, setPendingReturn] = useState(false); // waiting for user to come back from Huawei Health
  const [dataAge, setDataAge]             = useState(null);  // ms since last Apple Health read

  // ── Relative time helper ──────────────────────────────────────────────────
  const relTime = (ms) => {
    if (ms === null) return null;
    const mins = Math.floor(ms / 60000);
    if (mins < 1)  return isRTL ? 'الآن'               : 'just now';
    if (mins < 60) return isRTL ? `منذ ${mins} دقيقة`  : `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return isRTL ? `منذ ${hrs} ساعة` : `${hrs}h ago`;
  };

  // ── On mount: check if cached data exists and how old it is ───────────────
  useEffect(() => {
    const cached = loadHKCache();
    if (cached?.fetchedAt) setDataAge(Date.now() - cached.fetchedAt);
  }, []);

  // ── Auto-refresh when returning from Huawei Health ────────────────────────
  useEffect(() => {
    if (!pendingReturn) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setPendingReturn(false);
        document.removeEventListener('visibilitychange', onVisible);
        // Small delay so Huawei Health has time to flush to Apple Health
        setTimeout(() => handleSync(), 1200);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [pendingReturn]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Open Huawei Health app (forces its sync to Apple Health) ──────────────
  const openHuaweiHealth = () => {
    setPendingReturn(true);
    setSyncMsg(isRTL
      ? '⏳ افتح Huawei Health ثم ارجع هنا — سيتم التحديث تلقائياً'
      : '⏳ Open Huawei Health, then return — we\'ll auto-refresh');
    setSyncStatus(null);
    try { window.open('huaweihealth://', '_system'); } catch (_) {}
    // Fallback: open App Store page if Huawei Health isn't installed
    setTimeout(() => {
      try { window.open('itms-apps://itunes.apple.com/app/huawei-health/id1085649519', '_system'); } catch (_) {}
    }, 1500);
  };

  const openHealthSettings = () => {
    try { window.open('app-settings:', '_system'); } catch (_) {}
  };

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncStatus(null);
    setSyncMsg('');
    try {
      const data = await refreshHealthKit();
      if (data && (data.steps > 0 || data.calories > 0 || data.activeMinutes > 0)) {
        setHealth((prev) => ({
          ...prev,
          steps:         data.steps         ?? prev.steps,
          calories:      data.calories      ?? prev.calories,
          activeMinutes: data.activeMinutes ?? prev.activeMinutes,
          weekWorkouts:  prev.weekWorkouts.map((v, i) => Math.max(v, data.weekWorkouts?.[i] ?? 0)),
        }));
        setHkLive(true);
        setLastSync(new Date());
        setDataAge(0);
        setSyncStatus('ok');
        setSyncMsg(
          isRTL
            ? `✅ تمت المزامنة — ${data.steps.toLocaleString()} خطوة · ${data.calories} سعرة · ${data.activeMinutes} دقيقة نشاط`
            : `✅ Synced — ${data.steps.toLocaleString()} steps · ${data.calories} cal · ${data.activeMinutes} active min`
        );
      } else if (data) {
        setSyncStatus('no_data');
        setSyncMsg(
          isRTL
            ? '⚠️ لا توجد بيانات في Apple Health. افتح Huawei Health أولاً لمزامنة بياناتك.'
            : '⚠️ No data in Apple Health yet. Open Huawei Health first to sync your watch.'
        );
      } else {
        setSyncStatus('no_data');
        setSyncMsg(
          isRTL
            ? '⚠️ تعذّر الوصول لـ Apple Health. اضغط "منح الوصول" أدناه وأعد المحاولة.'
            : '⚠️ Could not access Apple Health. Tap "Grant Access" below and try again.'
        );
      }
    } catch (e) {
      setSyncStatus('error');
      setSyncMsg(`❌ ${e?.message || (isRTL ? 'خطأ في المزامنة' : 'Sync error')}`);
    } finally {
      setSyncing(false);
    }
  };

  const lastSyncText = lastSync
    ? lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : (isRTL ? 'لم تتم المزامنة بعد' : 'Not synced yet');

  const dataAgeText = relTime(dataAge);
  const dataIsStale = dataAge !== null && dataAge > 20 * 60000; // older than 20 min

  // Huawei setup steps
  const huaweiSteps = isRTL
    ? ['افتح إعدادات iPhone', 'اضغط على "الخصوصية والأمان" ← "الصحة"', 'اختر "Huawei Health" من القائمة', 'فعّل جميع أذونات البيانات الصحية', 'ارجع لـ FitGuard واضغط "مزامنة الآن"']
    : ['Open iPhone Settings', 'Tap "Privacy & Security" → "Health"', 'Select "Huawei Health" from the list', 'Enable all health data permissions', 'Return to FitGuard and tap "Sync Now"'];

  return (
    <div className="tab-content">

      {/* Header */}
      <div className="watch-tab-header">
        <h2 className="watch-tab-title">{isRTL ? 'الأجهزة الذكية' : 'WEARABLES'}</h2>
        {hkLive && (
          <div className="hk-live-badge" style={{ position: 'static' }}>
            <span className="hk-live-dot" />
            {isRTL ? '🍎 مباشر' : '🍎 Live'}
          </div>
        )}
      </div>

      {/* ── Stale data warning ── */}
      {dataIsStale && !syncing && (
        <div className="watch-stale-banner animate-fade-up">
          <span>⚠️ </span>
          <span>
            {isRTL
              ? `البيانات قديمة (${dataAgeText}) — افتح Huawei Health أولاً ثم اضغط مزامنة`
              : `Data is ${dataAgeText} old — open Huawei Health first, then sync`}
          </span>
        </div>
      )}

      {/* ── Device: Apple Watch ── */}
      <div className="db-card watch-device-card animate-fade-up">
        <div className="watch-device-header">
          <span className="watch-device-logo">⌚</span>
          <div className="watch-device-info">
            <span className="watch-device-name">Apple Watch</span>
            <span className="watch-device-sub">
              {available
                ? (isRTL ? 'متصل عبر Apple Health' : 'Connected via Apple Health')
                : (isRTL ? 'يتطلب جهاز iPhone حقيقي' : 'Requires real iPhone')}
            </span>
          </div>
          <div className={`watch-status-dot ${available ? 'watch-status-dot--on' : 'watch-status-dot--off'}`} />
        </div>
      </div>

      {/* ── Device: Huawei Watch Fit 3 ── */}
      <div className="db-card watch-device-card animate-fade-up" style={{ animationDelay: '0.06s' }}>
        <div className="watch-device-header">
          <span className="watch-device-logo">🔴</span>
          <div className="watch-device-info">
            <span className="watch-device-name">Huawei Watch Fit 3</span>
            <span className="watch-device-sub">
              {isRTL
                ? 'يتزامن عبر Huawei Health ← Apple Health'
                : 'Syncs via Huawei Health → Apple Health'}
            </span>
          </div>
          <button
            className="watch-setup-toggle"
            onClick={() => setHuaweiSetup((v) => !v)}
          >
            {huaweiSetup
              ? (isRTL ? 'إخفاء' : 'Hide')
              : (isRTL ? 'إعداد' : 'Setup')}
          </button>
        </div>

        {/* ── Open Huawei Health button ── */}
        {available && (
          <button
            className="watch-huawei-open-btn"
            onClick={openHuaweiHealth}
            disabled={syncing}
          >
            <span>🔴</span>
            <span>
              {pendingReturn
                ? (isRTL ? '⏳ في انتظار العودة...' : '⏳ Waiting for you to return...')
                : (isRTL ? 'افتح Huawei Health أولاً' : 'Open Huawei Health first')}
            </span>
            {!pendingReturn && <span className="watch-huawei-open-btn__arrow">{isRTL ? '←' : '→'}</span>}
          </button>
        )}

        {/* Collapsible setup guide */}
        {huaweiSetup && (
          <div className="watch-setup-guide animate-fade-up">
            <p className="watch-setup-guide__title">
              {isRTL ? '🔧 خطوات الإعداد:' : '🔧 Setup Steps:'}
            </p>
            <ol className="watch-setup-steps">
              {huaweiSteps.map((step, i) => (
                <li key={i} className="watch-setup-step">
                  <span className="watch-setup-step__num">{i + 1}</span>
                  <span className="watch-setup-step__text">{step}</span>
                </li>
              ))}
            </ol>
            <p className="watch-setup-note">
              {isRTL
                ? '💡 بعد الإعداد، ستظهر بيانات ساعة هواوي تلقائياً في FitGuard عند المزامنة'
                : '💡 After setup, Huawei Watch data will appear automatically in FitGuard when you sync'}
            </p>
          </div>
        )}
      </div>

      {/* ── Live metrics ── */}
      <div className="db-card animate-fade-up" style={{ animationDelay: '0.12s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <p className="db-section-label" style={{ marginBottom: 0 }}>{isRTL ? 'البيانات الحالية' : 'CURRENT DATA'}</p>
          {dataAgeText && (
            <span style={{
              fontSize: '11px',
              color: dataIsStale ? 'var(--warning)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}>
              {isRTL ? `من Apple Health · ${dataAgeText}` : `From Apple Health · ${dataAgeText}`}
            </span>
          )}
        </div>
        <div className="watch-metrics-grid">
          <div className="watch-metric">
            <span className="watch-metric__icon">👟</span>
            <span className="watch-metric__value">{health.steps.toLocaleString()}</span>
            <span className="watch-metric__label">{isRTL ? 'خطوات' : 'Steps'}</span>
          </div>
          <div className="watch-metric">
            <span className="watch-metric__icon">🔥</span>
            <span className="watch-metric__value">{health.calories}</span>
            <span className="watch-metric__label">{isRTL ? 'سعرة' : 'Cal'}</span>
          </div>
          <div className="watch-metric">
            <span className="watch-metric__icon">⏱</span>
            <span className="watch-metric__value">{health.activeMinutes}</span>
            <span className="watch-metric__label">{isRTL ? 'دقيقة نشاط' : 'Active min'}</span>
          </div>
        </div>
      </div>

      {/* ── Sync result banner ── */}
      {syncMsg ? (
        <div
          className="watch-sync-banner animate-fade-up"
          style={{
            background: syncStatus === 'ok'
              ? 'rgba(0,200,100,0.12)'
              : 'rgba(255,180,0,0.12)',
            borderColor: syncStatus === 'ok'
              ? 'rgba(0,200,100,0.35)'
              : 'rgba(255,180,0,0.35)',
          }}
        >
          <span className="watch-sync-banner__msg">{syncMsg}</span>
          {syncStatus !== 'ok' && syncStatus !== null && (
            <button className="watch-grant-btn" onClick={openHealthSettings}>
              {isRTL ? '⚙️ منح وصول Apple Health' : '⚙️ Grant Apple Health Access'}
            </button>
          )}
        </div>
      ) : (
        <div className="db-card animate-fade-up" style={{ animationDelay: '0.18s' }}>
          <div className="watch-sync-row">
            <div>
              <p className="db-section-label" style={{ marginBottom: 4 }}>{isRTL ? 'آخر مزامنة من FitGuard' : 'LAST SYNC FROM FITGUARD'}</p>
              <span className="watch-sync-time">{lastSyncText}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Sync button ── */}
      {available ? (
        <button
          className={`watch-sync-btn ${syncing ? 'watch-sync-btn--syncing' : ''}`}
          onClick={handleSync}
          disabled={syncing}
        >
          <span className="watch-sync-btn__icon">{syncing ? '⏳' : '🔄'}</span>
          <span>{syncing ? (isRTL ? 'جاري المزامنة...' : 'Syncing...') : (isRTL ? 'مزامنة من Apple Health' : 'Sync from Apple Health')}</span>
        </button>
      ) : (
        <div className="watch-unavailable">
          <span style={{ fontSize: 40 }}>📱</span>
          <p>{isRTL
            ? 'قم بتثبيت التطبيق على جهاز iPhone حقيقي لمزامنة بيانات Apple Watch أو Huawei Watch'
            : 'Install on a real iPhone to sync data from Apple Watch or Huawei Watch'}</p>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const WorkoutDashboard = ({ tier, readinessData, onStartExercise, onViewExercise, onOpenCycleTracker }) => {
  const { t, lang, isRTL } = useLanguage();
  const { user } = useAuth();
  const { gender, cycleData } = useGender();
  const isFemale = gender === 'female';

  const [activeTab, setActiveTab]       = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [health, setHealth]             = useState(loadHealth);
  const [ringsAnimated, setRingsAnimated] = useState(false);
  const [hkLive, setHkLive]             = useState(false);

  const tierKey  = (tier || 'novice').toLowerCase();
  const tierCfg  = TIER_CONFIG[tierKey] || TIER_CONFIG.novice;
  // Pick women's or men's workout library
  const tierWorkouts = isFemale
    ? (WORKOUTS_WOMEN[tierKey] || WORKOUTS_WOMEN.novice)
    : (WORKOUTS_BY_TIER[tierKey] || WORKOUTS_BY_TIER.novice);
  const exercises    = tierWorkouts[lang] || tierWorkouts.en;

  // Cycle phase info (women only)
  const cyclePhaseInfo = isFemale && cycleData
    ? getCyclePhase(cycleData.lastPeriodDate, cycleData.cycleLength, cycleData.periodLength)
    : null;

  const CYCLE_PHASE_COLORS = { menstrual:'#FF6B8A', follicular:'#FFB347', ovulation:'#FF6B00', luteal:'#B06AFF' };
  const CYCLE_PHASE_ICONS  = { menstrual:'🌙', follicular:'🌱', ovulation:'⚡', luteal:'🍂' };
  const CYCLE_PHASE_NAMES_EN = { menstrual:'Menstrual', follicular:'Follicular', ovulation:'Ovulation', luteal:'Luteal' };
  const CYCLE_PHASE_NAMES_AR = { menstrual:'الدورة', follicular:'الجريبية', ovulation:'الإباضة', luteal:'الطور الأصفر' };
  const readinessScore = readinessData?.readinessScore || 75;
  const td = t.dashboard;

  useEffect(() => {
    const id = setTimeout(() => setRingsAnimated(true), 120);
    return () => clearTimeout(id);
  }, []);

  // Initial HealthKit sync
  useEffect(() => {
    if (!isHealthKitAvailable()) return;
    initHealthKit()
      .then((hkData) => {
        if (!hkData) return;
        setHealth((prev) => ({
          ...prev,
          steps:         hkData.steps         ?? prev.steps,
          calories:      hkData.calories      ?? prev.calories,
          activeMinutes: hkData.activeMinutes ?? prev.activeMinutes,
          weekWorkouts:  prev.weekWorkouts.map((v, i) => Math.max(v, hkData.weekWorkouts?.[i] ?? 0)),
        }));
        setHkLive(true);
      })
      .catch(() => {});
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return td.greetings?.morning  || 'Good morning';
    if (h < 17) return td.greetings?.afternoon || 'Good afternoon';
    return td.greetings?.evening || 'Good evening';
  };

  const firstName = user?.user_metadata?.display_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || (isRTL ? 'بطل' : 'Champion');

  const scoreColor  = readinessScore >= 70 ? 'var(--green)' : readinessScore >= 45 ? 'var(--warning)' : 'var(--danger)';
  const ringCirc    = 2 * Math.PI * 28;
  const ringOffset  = ringCirc - (readinessScore / 100) * ringCirc;
  const weekSessions = health.weekWorkouts.reduce((a, b) => a + (b > 0 ? 1 : 0), 0);

  // ── Tab labels ──
  const TABS = [
    { id: 'home',    icon: '📊', labelEn: 'Home',    labelAr: 'الرئيسية' },
    { id: 'workout', icon: '💪', labelEn: 'Workout',  labelAr: 'التمارين' },
    { id: 'prayer',  icon: '🕌', labelEn: 'Prayer',   labelAr: 'الصلاة'   },
    { id: 'watch',   icon: '⌚', labelEn: 'Watch',    labelAr: 'الساعة'   },
  ];

  return (
    <div className="dashboard-screen screen">
      <div className="lang-toggle-fixed"><LanguageToggle /></div>

      {/* ── Tab content area ── */}
      <div className="dashboard-content tab-scrollable">

        {/* ══ HOME TAB ══ */}
        {activeTab === 'home' && (
          <>
            {/* Greeting */}
            <div className="db-greeting animate-fade-up">
              <div className="db-greeting__text">
                <p className="db-greeting__sub">{getGreeting()}, <span className="db-greeting__name">{firstName} 👋</span></p>
                <h1 className="db-greeting__title">{td.title}</h1>
              </div>
              <div className="db-readiness-badge">
                <svg viewBox="0 0 64 64" className="db-readiness-svg">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
                  <circle cx="32" cy="32" r="28" fill="none"
                    stroke={scoreColor} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={ringCirc} strokeDashoffset={ringOffset}
                    transform="rotate(-90 32 32)"
                    style={{ filter: `drop-shadow(0 0 5px ${scoreColor})`, transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div className="db-readiness-center">
                  <span className="db-readiness-value" style={{ color: scoreColor }}>{readinessScore}</span>
                  <span className="db-readiness-label">{td.readiness}</span>
                </div>
              </div>
            </div>

            {/* Activity Rings */}
            <div className="db-card db-rings-card animate-fade-up" style={{ animationDelay: '0.08s', position: 'relative' }}>
              {hkLive && (
                <div className="hk-live-badge">
                  <span className="hk-live-dot" />
                  {isRTL ? '🍎 مباشر' : '🍎 Live'}
                </div>
              )}
              <div className="db-rings-wrap">
                <ActivityRings move={health.calories} exercise={health.activeMinutes} stand={weekSessions} animated={ringsAnimated} />
                <div className="db-rings-center">
                  <span className="db-rings-steps">{health.steps.toLocaleString()}</span>
                  <span className="db-rings-steps-label">{td.steps}</span>
                </div>
              </div>
              <div className="db-rings-legend">
                <div className="db-ring-legend-item">
                  <span className="db-ring-dot" style={{ background: '#FF6B00' }}/>
                  <div>
                    <p className="db-ring-legend-val">{health.calories} <span>{td.cal}</span></p>
                    <p className="db-ring-legend-name">{td.move}</p>
                  </div>
                </div>
                <div className="db-ring-legend-item">
                  <span className="db-ring-dot" style={{ background: '#00FF88' }}/>
                  <div>
                    <p className="db-ring-legend-val">{health.activeMinutes} <span>{td.min}</span></p>
                    <p className="db-ring-legend-name">{td.exercise}</p>
                  </div>
                </div>
                <div className="db-ring-legend-item">
                  <span className="db-ring-dot" style={{ background: '#00C8FF' }}/>
                  <div>
                    <p className="db-ring-legend-val">{weekSessions} <span>{td.sessions}</span></p>
                    <p className="db-ring-legend-name">{td.stand}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="db-card animate-fade-up" style={{ animationDelay: '0.14s' }}>
              <p className="db-section-label">{td.weeklyActivity}</p>
              <WeeklyChart data={health.weekWorkouts} days={td.days} isRTL={isRTL} />
            </div>

            {/* Tier Progress */}
            <div className="db-card db-tier-card animate-fade-up" style={{ animationDelay: '0.20s' }}>
              <p className="db-section-label">{td.tierProgress}</p>
              <div className="db-tier-row">
                <span className="db-tier-name" style={{ color: tierCfg.color }}>
                  {t.tiers?.[tierKey]?.name || tierKey}
                </span>
                <span className="db-tier-pct">{Math.round(tierCfg.pct * 100)}%</span>
              </div>
              <div className="db-tier-bar-bg">
                <div className="db-tier-bar-fill"
                  style={{
                    width: ringsAnimated ? `${tierCfg.pct * 100}%` : '0%',
                    background: tierCfg.color,
                    boxShadow: `0 0 10px ${tierCfg.color}60`,
                    transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1) 0.4s',
                  }}
                />
              </div>
              {tierCfg.pct < 1 && (
                <p className="db-tier-next">
                  {isRTL
                    ? `${100 - Math.round(tierCfg.score)} ${td.toNext} ${tierCfg.nextAr}`
                    : `${100 - Math.round(tierCfg.score)} ${td.toNext} ${tierCfg.next}`}
                </p>
              )}
            </div>

            {/* ── Tip of the Day ── */}
            {(() => {
              const lang = isRTL ? 'ar' : 'en';
              const dayOfYear = Math.floor(
                (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
              );
              const tipList = DAILY_TIPS[lang];
              const tip = tipList[dayOfYear % tipList.length];
              return (
                <div className="db-card db-tip-card animate-fade-up" style={{ animationDelay: '0.26s' }}>
                  <div className="db-tip-badge">
                    {isRTL ? '💡 نصيحة اليوم' : '💡 Tip of the Day'}
                  </div>
                  <div className="db-tip-body">
                    <span className="db-tip-icon">{tip.icon}</span>
                    <div className="db-tip-text">
                      <p className="db-tip-title">{tip.title}</p>
                      <p className="db-tip-desc">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* ══ WORKOUT TAB ══ */}
        {activeTab === 'workout' && (() => {
          const CATS = [
            { id: 'all',      labelEn: 'All',       labelAr: 'الكل',     emoji: '📋' },
            { id: 'strength', labelEn: 'Strength',  labelAr: 'قوة',      emoji: '💪' },
            { id: 'cardio',   labelEn: 'Cardio',    labelAr: 'كارديو',   emoji: '🔥' },
            { id: 'core',     labelEn: 'Core',      labelAr: 'جذع',      emoji: '⚡' },
          ];
          const filtered = activeCategory === 'all'
            ? exercises
            : exercises.filter(ex => ex.category === activeCategory);
          return (
            <div className="tab-content">
              {/* Banner */}
              <div className="dashboard-today-banner animate-fade-up">
                <div className="dashboard-today-banner__text">
                  <span className="dashboard-today-banner__tier">
                    {(t.tiers?.[tierKey]?.name || tierKey).toUpperCase()}
                  </span>
                  <span className="dashboard-today-banner__count">{td.todayWorkout}</span>
                  <span className="dashboard-today-banner__label">{exercises.length} {td.exercises}</span>
                </div>
                <div className="dashboard-today-banner__arrow">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Cycle Phase Banner (women only) */}
              {isFemale && (
                <button
                  className="cycle-phase-banner animate-fade-up"
                  style={{
                    animationDelay: '0.03s',
                    borderColor: cyclePhaseInfo ? CYCLE_PHASE_COLORS[cyclePhaseInfo.phase] : '#B06AFF',
                    background: cyclePhaseInfo ? `${CYCLE_PHASE_COLORS[cyclePhaseInfo.phase]}18` : 'rgba(176,106,255,0.1)',
                  }}
                  onClick={onOpenCycleTracker}
                >
                  <span className="cycle-phase-banner__icon">
                    {cyclePhaseInfo ? CYCLE_PHASE_ICONS[cyclePhaseInfo.phase] : '🌸'}
                  </span>
                  <div className="cycle-phase-banner__text">
                    <span className="cycle-phase-banner__name" style={{ color: cyclePhaseInfo ? CYCLE_PHASE_COLORS[cyclePhaseInfo.phase] : '#B06AFF' }}>
                      {cyclePhaseInfo
                        ? (lang === 'ar' ? CYCLE_PHASE_NAMES_AR[cyclePhaseInfo.phase] : CYCLE_PHASE_NAMES_EN[cyclePhaseInfo.phase])
                        : (lang === 'ar' ? 'متتبع الدورة الشهرية' : 'Cycle Tracker')}
                    </span>
                    <span className="cycle-phase-banner__sub">
                      {cyclePhaseInfo
                        ? (lang === 'ar' ? `اليوم ${cyclePhaseInfo.day} من دورتك` : `Day ${cyclePhaseInfo.day} of your cycle`)
                        : (lang === 'ar' ? 'اضغطي لإعداد متتبع دورتك' : 'Tap to set up your cycle tracker')}
                    </span>
                  </div>
                  <span className="cycle-phase-banner__arrow" style={{ color: cyclePhaseInfo ? CYCLE_PHASE_COLORS[cyclePhaseInfo.phase] : '#B06AFF' }}>›</span>
                </button>
              )}

              {/* Category filter chips */}
              <div className="cat-filter animate-fade-up" style={{ animationDelay: '0.04s' }}>
                {CATS.map(cat => (
                  <button
                    key={cat.id}
                    className={`cat-chip ${activeCategory === cat.id ? 'cat-chip--active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span className="cat-chip__emoji">{cat.emoji}</span>
                    <span>{isRTL ? cat.labelAr : cat.labelEn}</span>
                  </button>
                ))}
              </div>

              {/* Exercise list */}
              <p className="db-section-label" style={{ marginBottom: 10, marginTop: 4 }}>
                {isRTL ? 'التمارين' : 'EXERCISES'}
                {activeCategory !== 'all' && (
                  <span style={{ color: 'var(--orange)', marginRight: 8, marginLeft: 8 }}>
                    ({filtered.length})
                  </span>
                )}
              </p>
              <div className="dashboard-exercises">
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    {isRTL ? 'لا توجد تمارين في هذه الفئة' : 'No exercises in this category'}
                  </div>
                ) : filtered.map((ex, i) => (
                  <button
                    key={ex.id}
                    type="button"
                    className="exercise-row"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => onViewExercise && onViewExercise(ex, exercises)}
                  >
                    <span className="exercise-row__num">{i + 1}</span>
                    <span className="exercise-row__icon">{ex.icon}</span>
                    <div className="exercise-row__info">
                      <span className="exercise-row__name">{ex.name}</span>
                      <span className="exercise-row__meta">
                        {ex.sets} {t.exercise.sets} · {ex.reps} {t.exercise.reps} · {ex.rest} {t.exercise.rest}
                      </span>
                    </div>
                    <div className="exercise-row__right">
                      <span className="muscle-chip">{ex.muscle}</span>
                      <svg className="exercise-row__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Start CTA */}
              <div className="dashboard-cta animate-fade-up" style={{ marginTop: 16 }}>
                <Button variant="primary" size="xl" fullWidth
                  onClick={() => onStartExercise && onStartExercise(exercises[0], exercises)}>
                  {td.start}
                </Button>
              </div>
            </div>
          );
        })()}

        {/* ══ PRAYER TAB ══ */}
        {activeTab === 'prayer' && <PrayerTab />}

        {/* ══ WATCH TAB ══ */}
        {activeTab === 'watch' && (
          <WatchTab
            health={health}
            setHealth={setHealth}
            hkLive={hkLive}
            setHkLive={setHkLive}
          />
        )}

      </div>

      {/* ── Bottom Tab Bar ── */}
      <div className="tab-bar" dir="ltr">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-bar__item ${activeTab === tab.id ? 'tab-bar__item--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-bar__icon">{tab.icon}</span>
            <span className="tab-bar__label">{isRTL ? tab.labelAr : tab.labelEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkoutDashboard;
