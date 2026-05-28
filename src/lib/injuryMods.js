/**
 * injuryMods.js — FitGuard Injury Modification Engine
 *
 * Maps risk flags (from Safety Audit) → safe exercise substitutions.
 * Called in WorkoutDashboard to swap flagged exercises automatically.
 */

// Substitution map: original exercise name (EN) → safer alternative
const SUBS = {
  joint_pain: {
    labelEn: 'Joint-safe modifications applied',
    labelAr: 'تعديلات لحماية المفاصل',
    color:   '#FFB800',
    swaps: {
      'Barbell Back Squat':  { name: 'Box Squat',          muscle: 'Legs',   icon: '🦵', note: 'Less spinal load' },
      'Deadlift':            { name: 'Romanian Deadlift',  muscle: 'Hamstrings', icon: '🔥', note: 'Reduced joint stress' },
      'Jumping Jack':        { name: 'Step Jack',           muscle: 'Cardio', icon: '⭐', note: 'Low-impact alternative' },
      'Mountain Climber':    { name: 'Slow Mountain Climber', muscle: 'Core', icon: '🧗', note: 'Controlled pace' },
      'Lunge':               { name: 'Reverse Lunge',      muscle: 'Legs',   icon: '🦵', note: 'Easier on knees' },
    },
    swapsAr: {
      'قرفصاء بالبار':       { name: 'قرفصاء صندوق',        muscle: 'أرجل',  icon: '🦵' },
      'رفع ميت':             { name: 'رفع رومانية',          muscle: 'أوتار العرقوب', icon: '🔥' },
      'قفز النجمة':          { name: 'مشي النجمة',           muscle: 'كارديو',icon: '⭐' },
      'تسلق الجبل':          { name: 'تسلق بطيء',            muscle: 'جذع',   icon: '🧗' },
      'تمرين الطعنة':        { name: 'طعنة خلفية',            muscle: 'أرجل',  icon: '🦵' },
    },
  },

  prior_surgery: {
    labelEn: 'Post-surgery safe program',
    labelAr: 'برنامج آمن بعد العملية',
    color:   '#FF6B8A',
    swaps: {
      'Barbell Back Squat': { name: 'Bodyweight Squat',    muscle: 'Legs',   icon: '🦵', note: 'No added load' },
      'Deadlift':           { name: 'Glute Bridge',        muscle: 'Glutes', icon: '🍑', note: 'Floor-based, safe' },
      'Bench Press':        { name: 'Wall Push-Up',        muscle: 'Chest',  icon: '💪', note: 'Reduced shoulder strain' },
      'Pull-Up':            { name: 'Resistance Band Row', muscle: 'Back',   icon: '🏋️', note: 'Controlled resistance' },
      'Overhead Press':     { name: 'Lateral Raise',       muscle: 'Shoulders', icon: '🎯', note: 'Lower joint stress' },
    },
    swapsAr: {
      'قرفصاء بالبار':      { name: 'قرفصاء بوزن الجسم',   muscle: 'أرجل',  icon: '🦵' },
      'رفع ميت':            { name: 'جسر الأرداف',          muscle: 'أرداف', icon: '🍑' },
      'ضغط البنش':          { name: 'تمرين الضغط على الجدار', muscle: 'صدر',icon: '💪' },
      'سحب علوي':           { name: 'تجديف بالشريط المقاوم', muscle: 'ظهر', icon: '🏋️' },
      'ضغط علوي':           { name: 'رفع جانبي',             muscle: 'أكتاف',icon: '🎯' },
    },
  },

  posture_issues: {
    labelEn: 'Posture-corrective exercises added',
    labelAr: 'تمارين تصحيح الوضعية',
    color:   '#B06AFF',
    swaps: {
      'Bench Press':    { name: 'Dumbbell Row',     muscle: 'Back',       icon: '🏋️', note: 'Strengthens posterior chain' },
      'Push-Up':        { name: 'Scapular Push-Up', muscle: 'Back',       icon: '💪', note: 'Shoulder blade stability' },
    },
    swapsAr: {
      'ضغط البنش':  { name: 'تجديف بالدمبل',   muscle: 'ظهر',  icon: '🏋️' },
      'تمرين الضغط':{ name: 'ضغط الكتف اللوحي', muscle: 'ظهر',  icon: '💪' },
    },
    extras: [
      { id: 'extra_1', name: 'Wall Angel',     sets: 3, reps: '10', rest: '30s', muscle: 'Back',   icon: '🕊️', category: 'core', noteEn: 'Posture correction', noteAr: 'تصحيح الوضعية' },
      { id: 'extra_2', name: 'Cat-Cow Stretch',sets: 2, reps: '10', rest: '30s', muscle: 'Back',   icon: '🐱', category: 'core', noteEn: 'Spinal mobility',    noteAr: 'مرونة العمود الفقري' },
    ],
    extrasAr: [
      { id: 'extra_1', name: 'تمرين الملاك الجداري', sets: 3, reps: '10', rest: '30ث', muscle: 'ظهر', icon: '🕊️', category: 'core' },
      { id: 'extra_2', name: 'تمرين القط والبقرة',   sets: 2, reps: '10', rest: '30ث', muscle: 'ظهر', icon: '🐱', category: 'core' },
    ],
  },

  limited_mobility: {
    labelEn: 'Mobility-adapted program',
    labelAr: 'برنامج مُكيَّف للمرونة',
    color:   '#00C878',
    swaps: {
      'Goblet Squat':        { name: 'Bodyweight Squat',   muscle: 'Legs',   icon: '🦵', note: 'Full range not required' },
      'Romanian Deadlift':   { name: 'Good Morning',       muscle: 'Hamstrings', icon: '🔥', note: 'Limited hip hinge' },
      'Mountain Climber':    { name: 'Dead Bug',           muscle: 'Core',   icon: '🪲', note: 'Builds stability first' },
    },
    swapsAr: {
      'قرفصاء الكأس':       { name: 'قرفصاء بوزن الجسم',  muscle: 'أرجل',  icon: '🦵' },
      'رفع أرومانية':       { name: 'صباح الخير',          muscle: 'أوتار العرقوب', icon: '🔥' },
      'تسلق الجبل':         { name: 'الدودة الميتة',        muscle: 'جذع',   icon: '🪲' },
    },
  },
};

/**
 * Apply injury modifications to an exercise list.
 * @param {Array} exercises   — raw exercise list from WORKOUTS_BY_TIER
 * @param {Array} riskFlags   — e.g. ['joint_pain', 'prior_surgery']
 * @param {string} lang       — 'en' | 'ar'
 * @returns {{ exercises: Array, warnings: Array }}
 */
export const applyInjuryMods = (exercises, riskFlags, lang = 'en') => {
  if (!riskFlags?.length) return { exercises, warnings: [] };

  const isAr   = lang === 'ar';
  const result = exercises.map(ex => ({ ...ex }));
  const warnings = [];
  let anyMod = false;

  for (const flag of riskFlags) {
    const mod = SUBS[flag];
    if (!mod) continue;
    const swapMap = isAr ? mod.swapsAr : mod.swaps;

    let flagMod = false;
    for (let i = 0; i < result.length; i++) {
      const sub = swapMap?.[result[i].name];
      if (sub) {
        result[i] = {
          ...result[i],
          ...sub,
          originalName: result[i].name,
          modified: true,
          modNote: isAr ? mod.labelAr : mod.labelEn,
          modColor: mod.color,
        };
        flagMod = true;
        anyMod  = true;
      }
    }

    // Add posture extras if flag is posture_issues
    if (flag === 'posture_issues' && mod.extras) {
      const extras = isAr ? mod.extrasAr : mod.extras;
      extras.forEach(e => {
        if (!result.find(r => r.id === e.id)) {
          result.push({ ...e, modified: true, modNote: isAr ? mod.labelAr : mod.labelEn, modColor: mod.color });
        }
      });
      flagMod = true; anyMod = true;
    }

    if (flagMod) {
      warnings.push({ flag, label: isAr ? mod.labelAr : mod.labelEn, color: mod.color });
    }
  }

  return { exercises: result, warnings };
};

export const FLAG_INFO = {
  joint_pain:        { icon: '🦴', labelEn: 'Joint Pain',        labelAr: 'ألم المفاصل'       },
  prior_surgery:     { icon: '🩺', labelEn: 'Prior Surgery',     labelAr: 'عملية جراحية سابقة' },
  posture_issues:    { icon: '🧍', labelEn: 'Posture Issues',    labelAr: 'مشاكل في الوضعية'   },
  limited_mobility:  { icon: '🤸', labelEn: 'Limited Mobility',  labelAr: 'محدودية الحركة'     },
  sedentary_lifestyle:{ icon: '🪑', labelEn: 'Sedentary Lifestyle', labelAr: 'نمط حياة خامل' },
};
