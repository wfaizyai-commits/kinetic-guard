/**
 * notifications.js — FitGuard Educational Push Notifications
 *
 * Sends 2 personalized health tips per day:
 *   08:00 → Morning tip (nutrition / hydration)
 *   20:00 → Evening tip (recovery / exercise science)
 *
 * Content is age-personalised:
 *   youth    → 15–25
 *   adult    → 26–40
 *   senior   → 41+
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// ── Storage keys ─────────────────────────────────────────────────────────────
const NOTIF_KEY   = 'fitguard_notif_v1';
const PROFILE_KEY = 'fitguard_notif_profile_v1';

// ── Age group helper ──────────────────────────────────────────────────────────
export const getAgeGroup = (age) => {
  if (!age || age < 26) return 'youth';
  if (age < 41)         return 'adult';
  return 'senior';
};

// ── Content library ───────────────────────────────────────────────────────────
// 30 tips per category × 3 age groups × 2 languages = rich rotation
const TIPS = {
  en: {
    youth: {
      morning: [
        { title: '🥗 Fuel Your Workout', body: 'Eat a balanced meal 1–2 hours before training. Complex carbs give you sustained energy for intense sessions.' },
        { title: '💧 Hydration Check', body: 'Drink 500ml of water before your morning workout. Even mild dehydration reduces performance by up to 20%.' },
        { title: '🍳 Protein at Breakfast', body: 'Add eggs or Greek yogurt to breakfast. Protein in the morning kickstarts muscle protein synthesis for the day.' },
        { title: '🍌 Pre-Workout Snack', body: 'A banana 30 min before exercise provides quick energy and potassium to prevent muscle cramps.' },
        { title: '☕ Caffeine Timing', body: 'Coffee 45–60 min before exercise can improve performance by 11–12%. Avoid it within 6 hours of sleep.' },
        { title: '🥦 Eat the Rainbow', body: 'Aim for 5 different colored vegetables today. Each color provides unique antioxidants that speed up recovery.' },
        { title: '🌾 Complex Carbs First', body: "Your muscles run on glycogen. Start the day with oats or whole grain bread to top up your body's fuel tank." },
      ],
      evening: [
        { title: '🛌 Sleep = Gains', body: '7–9 hours of sleep is when 70% of muscle repair happens. Growth hormone peaks during deep sleep. Prioritize rest!' },
        { title: '🧘 Stretch Before Bed', body: '10 minutes of gentle stretching reduces next-day soreness by relaxing muscle tension built up during the day.' },
        { title: '🥛 Casein Before Sleep', body: 'Cottage cheese or milk before bed provides slow-digesting casein protein that feeds muscles for 7–8 hours overnight.' },
        { title: '📵 Screen-Free Wind Down', body: 'Blue light from phones suppresses melatonin production. Put your phone down 30 min before bed for better recovery sleep.' },
        { title: '🔄 Active Recovery', body: "Light walking or swimming on rest days increases blood flow and removes lactic acid 40% faster than complete rest." },
        { title: '💪 Progressive Overload', body: 'Add just 2.5kg or one extra rep per week. Small consistent increases build more muscle than occasional intense sessions.' },
        { title: '🧊 Cold Shower Boost', body: 'A 2-minute cold shower after training reduces inflammation and speeds muscle recovery. Try ending your shower cold.' },
      ],
    },
    adult: {
      morning: [
        { title: '🫀 Heart Health First', body: 'Add 10 min of brisk walking to your morning. Adults who walk 30 min/day have 35% lower risk of cardiovascular disease.' },
        { title: '🥑 Healthy Fats Matter', body: 'Include avocado, olive oil or nuts daily. Omega-3 fatty acids reduce joint inflammation — critical for consistent training.' },
        { title: '⚖️ Protein Targets', body: 'After 25, target 1.6–2.2g of protein per kg of bodyweight to maintain muscle mass as metabolism slows.' },
        { title: '🩺 Train Your Posture', body: 'Poor posture causes 80% of back pain. Add 5 min of posture exercises to your morning — chin tucks, shoulder rolls, cat-cow.' },
        { title: '🥣 Fiber Intake', body: 'Aim for 30g of fiber daily. High-fiber diets reduce cortisol levels, which helps preserve muscle mass during stress.' },
        { title: '💊 Vitamin D Check', body: '80% of adults are Vitamin D deficient. Supplement with 2000–4000 IU daily — it directly affects muscle strength and mood.' },
        { title: '🧠 Train Your Brain Too', body: 'Exercise and learning activate the same neural pathways. Pair your workout with a podcast to double the brain benefits.' },
      ],
      evening: [
        { title: '🔁 Mobility is Priority', body: 'After 30, mobility work prevents injury better than stretching alone. Spend 10 min on hip flexors and thoracic spine tonight.' },
        { title: '😴 Sleep Quality Drops', body: 'Adults lose deep sleep with age. Keep your bedroom below 19°C and avoid alcohol — it reduces REM sleep by 40%.' },
        { title: '🧴 Magnesium for Recovery', body: 'Magnesium glycinate before bed reduces muscle cramps and improves sleep quality. Most adults are deficient.' },
        { title: '📊 Track Your Progress', body: 'Adults who log workouts consistently achieve 33% better results. FitGuard tracks every session for you automatically.' },
        { title: '🚶 NEAT Matters', body: 'Non-exercise activity (walking, standing) burns more calories daily than structured workouts. Take the stairs today.' },
        { title: '🫁 Breathe Correctly', body: 'Diaphragmatic breathing during exercise increases oxygen delivery by 30%. Breathe into your belly, not your chest.' },
        { title: '🧘 Stress and Muscle', body: 'Chronic stress raises cortisol which breaks down muscle. A 10-min meditation before bed protects your gains.' },
      ],
    },
    senior: {
      morning: [
        { title: '🦴 Bone Health', body: 'Weight-bearing exercise 3×/week increases bone density by up to 3% per year. Your FitGuard program is designed exactly for this.' },
        { title: '⚖️ Balance Training', body: 'Falls are the #1 injury risk after 40. Practice standing on one foot for 30 seconds daily — it dramatically improves balance.' },
        { title: '🥩 Leucine for Muscle', body: 'After 40, muscles become less sensitive to protein. Aim for 30–40g protein per meal and prioritize leucine-rich foods.' },
        { title: '🚶 Walk Every Day', body: 'A 30-minute daily walk reduces all-cause mortality by 35% for adults 40+. Even splitting it into 3 × 10 min works.' },
        { title: '💧 Thirst Decreases', body: 'After 40, thirst sensation decreases by 40%. Set hydration reminders and aim for 8–10 glasses even if you feel fine.' },
        { title: '🧠 Exercise and Memory', body: 'Regular exercise increases BDNF — your brain\'s growth hormone. It reduces cognitive decline risk by 30–40%.' },
        { title: '🏊 Low Impact is Smart', body: 'Swimming and cycling provide full cardio benefits with 80% less joint stress than running. Train smarter, not harder.' },
      ],
      evening: [
        { title: '😴 Sleep Architecture', body: 'Deep sleep drops significantly after 40. Avoid naps after 3pm and keep a consistent sleep/wake schedule for better quality.' },
        { title: '🔄 Recovery Takes Longer', body: 'After 40, muscles need 48–72 hours to recover. Your FitGuard program automatically spaces exercises to protect you.' },
        { title: '🫀 Heart Rate Zones', body: 'Training at 60–70% max heart rate builds aerobic fitness with minimal stress. Formula: 220 minus your age = max HR.' },
        { title: '🧴 Joint Protection', body: 'Glucosamine and omega-3 supplements reduce joint pain in 40+ adults by up to 28%. Consistency matters more than dose.' },
        { title: '💪 Muscle is Medicine', body: 'Sarcopenia (muscle loss) starts at 40 at 3–5%/decade without training. Every workout session directly fights this process.' },
        { title: '🥗 Anti-Inflammatory Diet', body: 'Turmeric, ginger and berries reduce systemic inflammation that causes muscle pain and slows recovery after 40.' },
        { title: '🛌 Nap Smart', body: 'A 20-minute nap before 3pm improves afternoon performance by 34% without disrupting night sleep. Use it on heavy training days.' },
      ],
    },
  },

  ar: {
    youth: {
      morning: [
        { title: '🥗 وقود التمرين', body: 'تناول وجبة متوازنة قبل التمرين بـ 1–2 ساعة. الكربوهيدرات المعقدة تمنحك طاقة مستدامة للجلسات المكثفة.' },
        { title: '💧 اشرب الماء', body: 'اشرب 500 مل قبل تمرينك الصباحي. حتى الجفاف الخفيف يقلل أداءك حتى 20%.' },
        { title: '🍳 بروتين الفطور', body: 'أضف البيض أو الزبادي اليوناني للفطور. البروتين صباحاً يُنشّط بناء العضلات طوال اليوم.' },
        { title: '🍌 وجبة ما قبل التمرين', body: 'موزة قبل التمرين بـ 30 دقيقة تعطيك طاقة سريعة وتحمي عضلاتك من التشنج.' },
        { title: '☕ توقيت الكافيين', body: 'القهوة قبل التمرين بـ 45–60 دقيقة تحسّن الأداء 11–12%. تجنّبها 6 ساعات قبل النوم.' },
        { title: '🥦 تنوّع الألوان', body: 'اهدف لـ 5 خضروات بألوان مختلفة اليوم. كل لون يوفر مضادات أكسدة فريدة تسرّع التعافي.' },
        { title: '🌾 الكربوهيدرات أولاً', body: 'عضلاتك تعمل على الجليكوجين. ابدأ يومك بالشوفان أو الخبز الكامل لتعبئة خزان الطاقة.' },
      ],
      evening: [
        { title: '🛌 النوم = العضلات', body: '7–9 ساعات نوم هي الوقت الذي تتعافى فيه 70% من العضلات. هرمون النمو يذروه في النوم العميق.' },
        { title: '🧘 تمدد قبل النوم', body: '10 دقائق إطالة خفيفة تقلل ألم اليوم التالي وتريح توتر العضلات المتراكم.' },
        { title: '🥛 كازين قبل النوم', body: 'الجبن القريش أو الحليب قبل النوم يوفر بروتيناً بطيئاً يغذي عضلاتك 7–8 ساعات.' },
        { title: '📵 ابتعد عن الشاشات', body: 'الضوء الأزرق يقمع إفراز الميلاتونين. ضع هاتفك جانباً 30 دقيقة قبل النوم لتعافٍ أفضل.' },
        { title: '🔄 تعافٍ نشط', body: 'المشي الخفيف أو السباحة أيام الراحة يزيد تدفق الدم ويزيل حمض اللاكتيك 40% أسرع من الراحة التامة.' },
        { title: '💪 التحميل التدريجي', body: 'زد 2.5 كجم أو تكرار واحد أسبوعياً. الزيادات الصغيرة المستمرة تبني عضلاً أكثر من الجلسات المكثفة المتقطعة.' },
        { title: '🧊 دش بارد للتعافي', body: 'دقيقتان دش بارد بعد التمرين يقلل الالتهاب ويسرّع تعافي العضلات. جرّب إنهاء دشك بالماء البارد.' },
      ],
    },
    adult: {
      morning: [
        { title: '🫀 صحة القلب أولاً', body: 'أضف 10 دقائق مشي سريع لصباحك. البالغون الذين يمشون 30 دقيقة يومياً لديهم خطر أقل بـ 35% لأمراض القلب.' },
        { title: '🥑 الدهون الصحية', body: 'أدرج الأفوكادو أو زيت الزيتون أو المكسرات يومياً. أوميغا-3 يقلل التهاب المفاصل للتدريب المنتظم.' },
        { title: '⚖️ هدف البروتين', body: 'بعد 25 عاماً، استهدف 1.6–2.2 جرام بروتين لكل كيلو وزن للحفاظ على الكتلة العضلية مع تباطؤ الأيض.' },
        { title: '🩺 درّب وضعيتك', body: 'سوء الوضعية يسبب 80% من آلام الظهر. أضف 5 دقائق لتمارين الوضعية صباحاً — دحرجة الأكتاف، تمارين العنق.' },
        { title: '🥣 الألياف مهمة', body: 'اهدف لـ 30 جراماً من الألياف يومياً. تقلل الكورتيزول مما يحافظ على الكتلة العضلية في أوقات الضغط.' },
        { title: '💊 فيتامين د', body: '80% من البالغين يعانون نقص فيتامين د. تكمّل بـ 2000–4000 وحدة يومياً — يؤثر مباشرة على قوة العضلات والمزاج.' },
        { title: '🧠 تمرّن عقلك أيضاً', body: 'الرياضة والتعلم يُنشّطان نفس المسارات العصبية. اجمع تمرينك مع بودكاست لمضاعفة فوائد الدماغ.' },
      ],
      evening: [
        { title: '🔁 الحركة أولوية', body: 'بعد الثلاثين، تمارين الحركة تمنع الإصابة أكثر من الإطالة. أمضِ 10 دقائق على بسواس الورك والعمود الفقري الصدري.' },
        { title: '😴 جودة النوم تنخفض', body: 'البالغون يفقدون النوم العميق مع العمر. حافظ على غرفتك دون 19°م وتجنّب الكحول — يقلل نوم REM بنسبة 40%.' },
        { title: '🧴 المغنيسيوم للتعافي', body: 'جليسينات المغنيسيوم قبل النوم يقلل تشنجات العضلات ويحسّن جودة النوم. معظم البالغين يفتقرونه.' },
        { title: '📊 تتبّع التقدم', body: 'البالغون الذين يسجّلون تمارينهم يحققون نتائج أفضل بـ 33%. FitGuard يتتبع كل جلسة تلقائياً.' },
        { title: '🚶 الحركة اليومية مهمة', body: 'النشاط غير الرياضي (المشي، الوقوف) يحرق سعرات أكثر من التمارين المنظمة يومياً. اصعد السلم اليوم.' },
        { title: '🫁 اتنفس صح', body: 'التنفس الحجابي أثناء التمرين يزيد توصيل الأكسجين 30%. تنفّس في بطنك لا في صدرك.' },
        { title: '🧘 التوتر والعضلات', body: 'التوتر المزمن يرفع الكورتيزول الذي يكسر العضلات. 10 دقائق تأمل قبل النوم تحمي مكاسبك.' },
      ],
    },
    senior: {
      morning: [
        { title: '🦴 صحة العظام', body: 'تمارين الثقل 3 مرات أسبوعياً تزيد كثافة العظام حتى 3% سنوياً. برنامج FitGuard مصمم لهذا تحديداً.' },
        { title: '⚖️ تدريب التوازن', body: 'السقوط هو مخاطرة الإصابة الأولى بعد الأربعين. تدرّب على الوقوف على قدم واحدة 30 ثانية يومياً.' },
        { title: '🥩 لوسين للعضلات', body: 'بعد الأربعين تقل استجابة العضلات للبروتين. استهدف 30–40 جراماً بروتين في كل وجبة وركّز على اللوسين.' },
        { title: '🚶 امشِ كل يوم', body: '30 دقيقة مشي يومياً تقلل الوفيات الكلية بـ 35% لمن هم فوق 40. حتى تقسيمها 3 × 10 دقائق يعمل.' },
        { title: '💧 احذر العطش', body: 'بعد الأربعين يتراجع الإحساس بالعطش 40%. ضع تذكيرات للترطيب واهدف 8–10 أكواب حتى لو لا تشعر بالعطش.' },
        { title: '🧠 الرياضة والذاكرة', body: 'التمرين المنتظم يزيد BDNF — هرمون نمو الدماغ. يقلل خطر تراجع الإدراك بـ 30–40%.' },
        { title: '🏊 التمارين منخفضة الأثر', body: 'السباحة والدراجة تعطيان فوائد قلبية كاملة بـ 80% أقل ضغطاً على المفاصل من الجري. تدرّب بذكاء.' },
      ],
      evening: [
        { title: '😴 بنية النوم تتغير', body: 'النوم العميق يقل بشكل ملحوظ بعد الأربعين. تجنّب القيلولة بعد 3م والتزم بجدول نوم ثابت.' },
        { title: '🔄 التعافي يستغرق وقتاً أطول', body: 'بعد الأربعين تحتاج العضلات 48–72 ساعة للتعافي. برنامج FitGuard يحسب هذا تلقائياً لحمايتك.' },
        { title: '🫀 مناطق معدل ضربات القلب', body: 'التمرين عند 60–70% من الحد الأقصى يبني اللياقة الهوائية براحة. القانون: 220 ناقص عمرك = أقصى معدل.' },
        { title: '🧴 حماية المفاصل', body: 'الجلوكوسامين وأوميغا-3 يقللان آلام المفاصل لمن فوق 40 بنسبة 28%. الاتساق أهم من الجرعة.' },
        { title: '💪 العضلة دواء', body: 'فقدان العضلات يبدأ بعد 40 بنسبة 3–5% كل عقد بدون تدريب. كل جلسة تمرين تحارب هذه العملية مباشرة.' },
        { title: '🥗 نظام مضاد للالتهابات', body: 'الكركم والزنجبيل والتوت يقللون الالتهاب المزمن الذي يسبب ألم العضلات ويبطّئ التعافي بعد الأربعين.' },
        { title: '🛌 القيلولة الذكية', body: 'قيلولة 20 دقيقة قبل الساعة 3م تحسّن الأداء بعد الظهر بـ 34% دون الإخلال بنوم الليل.' },
      ],
    },
  },
};

// ── Notification IDs ──────────────────────────────────────────────────────────
// 100–199 → morning tips
// 200–299 → evening tips
const BASE_MORNING = 100;
const BASE_EVENING = 200;
const DAYS_AHEAD   = 14; // schedule 2 weeks in advance

// ── Helpers ───────────────────────────────────────────────────────────────────
const loadNotifState = () => {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}'); } catch { return {}; }
};

const saveNotifState = (s) => {
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(s)); } catch {}
};

export const loadNotifProfile = () => {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch { return {}; }
};

export const saveNotifProfile = (profile) => {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
};

// Pick a tip rotating through the array by date offset
const pickTip = (arr, dayOffset) => arr[dayOffset % arr.length];

// Build all notifications for the next N days
const buildSchedule = (lang, ageGroup) => {
  const pool   = TIPS[lang]?.[ageGroup] || TIPS.en.adult;
  const today  = new Date();
  const notifs = [];

  for (let d = 0; d < DAYS_AHEAD; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    // Morning — 08:00
    const morning = new Date(date);
    morning.setHours(8, 0, 0, 0);
    if (morning > new Date()) {
      const tip = pickTip(pool.morning, d);
      notifs.push({
        id:         BASE_MORNING + d,
        title:      tip.title,
        body:       tip.body,
        schedule:   { at: morning },
        smallIcon:  'ic_stat_icon_config_sample',
        iconColor:  '#FF6B00',
        sound:      null,
        extra:      { type: 'health_tip', time: 'morning' },
      });
    }

    // Evening — 20:00
    const evening = new Date(date);
    evening.setHours(20, 0, 0, 0);
    if (evening > new Date()) {
      const tip = pickTip(pool.evening, d);
      notifs.push({
        id:         BASE_EVENING + d,
        title:      tip.title,
        body:       tip.body,
        schedule:   { at: evening },
        smallIcon:  'ic_stat_icon_config_sample',
        iconColor:  '#FF6B00',
        sound:      null,
        extra:      { type: 'health_tip', time: 'evening' },
      });
    }
  }

  return notifs;
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Call once after user sets their age / language preferences.
 * Requests permission (shows iOS dialog), then schedules tips.
 */
export const setupNotifications = async ({ lang = 'en', age = 25 } = {}) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Notifications] Web mode — skipping native schedule');
    return { granted: false };
  }

  try {
    // 1. Request permission
    const { display } = await LocalNotifications.requestPermissions();
    if (display !== 'granted') {
      console.warn('[Notifications] Permission denied');
      saveNotifState({ granted: false, scheduledAt: null });
      return { granted: false };
    }

    // 2. Cancel any old tips
    await cancelHealthTips();

    // 3. Build and schedule
    const ageGroup = getAgeGroup(age);
    const schedule = buildSchedule(lang, ageGroup);

    if (schedule.length > 0) {
      await LocalNotifications.schedule({ notifications: schedule });
    }

    saveNotifState({
      granted: true,
      scheduledAt: new Date().toISOString(),
      lang,
      ageGroup,
      count: schedule.length,
    });

    console.log(`[Notifications] Scheduled ${schedule.length} tips (${ageGroup}, ${lang})`);
    return { granted: true, count: schedule.length };

  } catch (e) {
    console.error('[Notifications] Setup failed:', e);
    return { granted: false, error: String(e) };
  }
};

/**
 * Cancel all scheduled health tips (IDs 100–299).
 */
export const cancelHealthTips = async () => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const ids = [
      ...Array.from({ length: DAYS_AHEAD }, (_, i) => ({ id: BASE_MORNING + i })),
      ...Array.from({ length: DAYS_AHEAD }, (_, i) => ({ id: BASE_EVENING + i })),
    ];
    await LocalNotifications.cancel({ notifications: ids });
  } catch (e) {
    console.warn('[Notifications] Cancel failed:', e);
  }
};

/**
 * Re-schedule (call when user changes language or age).
 */
export const rescheduleNotifications = async ({ lang, age }) => {
  const profile = loadNotifProfile();
  const newLang  = lang  ?? profile.lang  ?? 'en';
  const newAge   = age   ?? profile.age   ?? 25;
  saveNotifProfile({ ...profile, lang: newLang, age: newAge });
  return setupNotifications({ lang: newLang, age: newAge });
};

/**
 * Returns whether notifications are currently granted + scheduled.
 */
export const getNotifStatus = () => loadNotifState();
