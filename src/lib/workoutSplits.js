/**
 * workoutSplits.js — FitGuard guided training splits (gym-focused).
 *
 * Adds a muscle-group "Bro Split" on TOP of the existing safety-tier system,
 * so a gym user sees content that matches how they actually train
 * (Day 1: Chest & Triceps, …) — exactly like a printed gym plan.
 *
 * The safety layer still applies: Daily Readiness gates intensity, and
 * injury risk flags swap exercises via injuryMods.js downstream.
 *
 * Image slots: each exercise has an `img` id. If a matching file exists at
 *   /public/exercises/<img>.webp  (or .png/.jpg)
 * the UI shows it; otherwise it falls back to the animated Muscle Blueprint.
 */

export const SPLIT_ID = 'bro_v1';

export const BRO_SPLIT = {
  id: SPLIT_ID,
  nameEn: 'Bro Split',
  nameAr: 'تقسيم العضلات',
  descEn: '5 days · one muscle focus per day',
  descAr: '٥ أيام · كل يوم عضلة',
  days: [
    {
      id: 'd1',
      titleEn: 'Chest & Triceps',
      titleAr: 'الصدر والترايسبس',
      icon: '💥',
      exercises: [
        { img: 'bench_press',       nameEn: 'Bench Press',        nameAr: 'ضغط البنش',        muscleEn: 'Chest',   muscleAr: 'صدر',     sets: 3, reps: '10-12' },
        { img: 'incline_press',     nameEn: 'Incline Bench Press', nameAr: 'ضغط بنش مائل',     muscleEn: 'Chest',   muscleAr: 'صدر',     sets: 3, reps: '10-12' },
        { img: 'chest_fly',         nameEn: 'Chest Fly',          nameAr: 'تفتيح الصدر',       muscleEn: 'Chest',   muscleAr: 'صدر',     sets: 3, reps: '10-12' },
        { img: 'tricep_pushdown',   nameEn: 'Tricep Pushdown',    nameAr: 'دفع الترايسبس',     muscleEn: 'Triceps', muscleAr: 'ترايسبس', sets: 3, reps: '10-12' },
        { img: 'overhead_ext',      nameEn: 'Overhead Extension', nameAr: 'تمديد فوق الرأس',   muscleEn: 'Triceps', muscleAr: 'ترايسبس', sets: 3, reps: '10-12' },
        { img: 'skull_crusher',     nameEn: 'Skull Crushers',     nameAr: 'سحق الجمجمة',       muscleEn: 'Triceps', muscleAr: 'ترايسبس', sets: 3, reps: '10-12' },
      ],
    },
    {
      id: 'd2',
      titleEn: 'Back & Biceps',
      titleAr: 'الظهر والبايسبس',
      icon: '🔙',
      exercises: [
        { img: 'deadlift',     nameEn: 'Deadlift',         nameAr: 'الرفعة الميتة',  muscleEn: 'Back',   muscleAr: 'ظهر',     sets: 3, reps: '8-10' },
        { img: 'lat_pulldown', nameEn: 'Lat Pulldown',     nameAr: 'سحب أمامي',      muscleEn: 'Back',   muscleAr: 'ظهر',     sets: 3, reps: '10-12' },
        { img: 'barbell_row',  nameEn: 'Barbell Row',      nameAr: 'تجديف بالبار',   muscleEn: 'Back',   muscleAr: 'ظهر',     sets: 3, reps: '10-12' },
        { img: 'seated_row',   nameEn: 'Seated Cable Row', nameAr: 'تجديف بالكابل',  muscleEn: 'Back',   muscleAr: 'ظهر',     sets: 3, reps: '10-12' },
        { img: 'barbell_curl', nameEn: 'Barbell Curl',     nameAr: 'لف بالبار',      muscleEn: 'Biceps', muscleAr: 'بايسبس',  sets: 3, reps: '10-12' },
        { img: 'hammer_curl',  nameEn: 'Hammer Curl',      nameAr: 'لف المطرقة',     muscleEn: 'Biceps', muscleAr: 'بايسبس',  sets: 3, reps: '10-12' },
      ],
    },
    {
      id: 'd3',
      titleEn: 'Legs',
      titleAr: 'الأرجل',
      icon: '🦵',
      exercises: [
        { img: 'squat',       nameEn: 'Barbell Squat',    nameAr: 'قرفصاء بالبار',   muscleEn: 'Quads',      muscleAr: 'فخذ',         sets: 4, reps: '8-10' },
        { img: 'leg_press',   nameEn: 'Leg Press',        nameAr: 'ضغط الأرجل',      muscleEn: 'Quads',      muscleAr: 'فخذ',         sets: 3, reps: '10-12' },
        { img: 'rdl',         nameEn: 'Romanian Deadlift', nameAr: 'رفعة رومانية',    muscleEn: 'Hamstrings', muscleAr: 'خلفية الفخذ', sets: 3, reps: '10-12' },
        { img: 'leg_curl',    nameEn: 'Leg Curl',         nameAr: 'لف الساق',        muscleEn: 'Hamstrings', muscleAr: 'خلفية الفخذ', sets: 3, reps: '12-15' },
        { img: 'leg_ext',     nameEn: 'Leg Extension',    nameAr: 'تمديد الساق',     muscleEn: 'Quads',      muscleAr: 'فخذ',         sets: 3, reps: '12-15' },
        { img: 'calf_raise',  nameEn: 'Calf Raise',       nameAr: 'رفع السمانة',     muscleEn: 'Calves',     muscleAr: 'سمانة',       sets: 4, reps: '15-20' },
      ],
    },
    {
      id: 'd4',
      titleEn: 'Shoulders',
      titleAr: 'الأكتاف',
      icon: '🎯',
      exercises: [
        { img: 'overhead_press', nameEn: 'Overhead Press',  nameAr: 'ضغط الكتف',     muscleEn: 'Shoulders', muscleAr: 'أكتاف', sets: 4, reps: '8-10' },
        { img: 'lateral_raise',  nameEn: 'Lateral Raise',   nameAr: 'رفرفة جانبية',  muscleEn: 'Shoulders', muscleAr: 'أكتاف', sets: 3, reps: '12-15' },
        { img: 'front_raise',    nameEn: 'Front Raise',     nameAr: 'رفرفة أمامية',  muscleEn: 'Shoulders', muscleAr: 'أكتاف', sets: 3, reps: '12-15' },
        { img: 'rear_delt_fly',  nameEn: 'Rear Delt Fly',   nameAr: 'رفرفة خلفية',   muscleEn: 'Shoulders', muscleAr: 'أكتاف', sets: 3, reps: '12-15' },
        { img: 'shrug',          nameEn: 'Barbell Shrug',   nameAr: 'هز الأكتاف',    muscleEn: 'Traps',     muscleAr: 'ترابيس', sets: 3, reps: '12-15' },
      ],
    },
    {
      id: 'd5',
      titleEn: 'Arms & Abs',
      titleAr: 'الذراعين والبطن',
      icon: '💪',
      exercises: [
        { img: 'barbell_curl',    nameEn: 'Barbell Curl',     nameAr: 'لف بالبار',       muscleEn: 'Biceps',  muscleAr: 'بايسبس',  sets: 3, reps: '10-12' },
        { img: 'tricep_pushdown', nameEn: 'Tricep Pushdown',  nameAr: 'دفع الترايسبس',   muscleEn: 'Triceps', muscleAr: 'ترايسبس', sets: 3, reps: '10-12' },
        { img: 'hammer_curl',     nameEn: 'Hammer Curl',      nameAr: 'لف المطرقة',      muscleEn: 'Biceps',  muscleAr: 'بايسبس',  sets: 3, reps: '10-12' },
        { img: 'overhead_ext',    nameEn: 'Overhead Extension', nameAr: 'تمديد فوق الرأس', muscleEn: 'Triceps', muscleAr: 'ترايسبس', sets: 3, reps: '10-12' },
        { img: 'cable_crunch',    nameEn: 'Cable Crunch',     nameAr: 'كرنش بالكابل',    muscleEn: 'Abs',     muscleAr: 'بطن',     sets: 3, reps: '15-20' },
        { img: 'leg_raise',       nameEn: 'Hanging Leg Raise', nameAr: 'رفع الأرجل معلقاً', muscleEn: 'Abs',  muscleAr: 'بطن',     sets: 3, reps: '12-15' },
      ],
    },
  ],
};

/** Candidate image URLs for an exercise img id (first that loads wins). */
export const exerciseImageCandidates = (imgId) =>
  imgId ? [`/exercises/${imgId}.webp`, `/exercises/${imgId}.png`, `/exercises/${imgId}.jpg`] : [];

export default BRO_SPLIT;
