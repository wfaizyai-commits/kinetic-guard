/**
 * formCheckAI.js — Real AI form analysis via Claude vision
 *
 * Sends the user's exercise photo to Claude (claude-haiku) and gets
 * specific, personalised form feedback back as structured JSON.
 *
 * Setup: add to .env.local →  VITE_ANTHROPIC_API_KEY=sk-ant-...
 *
 * The header 'anthropic-dangerous-direct-browser-access: true'
 * is required for calls made directly from a browser / WKWebView.
 */

const API_URL  = 'https://api.anthropic.com/v1/messages';
const MODEL    = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400;

// ── Build the coaching prompt ────────────────────────────────────────────────
const buildPrompt = (exerciseName, lang) => {
  if (lang === 'ar') {
    return `أنت مدرب لياقة بدنية متخصص في السلامة الرياضية.
المستخدم يؤدي تمرين "${exerciseName}".
حلّل وضعيته وأداءه في الصورة بعناية.

أعد الرد كـ JSON فقط بهذا الشكل بالضبط (لا تضف أي نص خارج الـ JSON):
{"good":["نقطة إيجابية 1","نقطة إيجابية 2","نقطة إيجابية 3"],"improve":["نقطة للتحسين 1","نقطة للتحسين 2"]}

القواعد:
- 3 نقاط إيجابية تحديداً و2 نقاط للتحسين تحديداً
- كن محدداً جداً لهذا التمرين وما يظهر في الصورة
- اذكر أجزاء الجسم المحددة (الركبة، الظهر، الذراعين، إلخ)
- إذا لم تكن الصورة واضحة أو لا تُظهر تمريناً، اذكر ذلك في إحدى النقاط`;
  }

  return `You are a professional fitness coach specialising in exercise safety.
The user is performing "${exerciseName}".
Carefully analyse their posture and technique in the photo.

Reply as JSON ONLY in this exact format (no text outside the JSON):
{"good":["positive point 1","positive point 2","positive point 3"],"improve":["improvement point 1","improvement point 2"]}

Rules:
- Exactly 3 positive points and exactly 2 improvement points
- Be very specific to this exercise and what you actually see in the image
- Reference specific body parts (knee, back, arms, hips, etc.)
- If the image is unclear or doesn't show exercise form, note that in one of the points`;
};

// ── Main export ──────────────────────────────────────────────────────────────
/**
 * Analyse exercise form in a photo using Claude vision.
 *
 * @param {object} params
 * @param {string} params.photoDataUrl  - base64 data URL from Capacitor camera
 * @param {object} params.exercise      - { name, ... } exercise object
 * @param {string} params.lang          - 'en' | 'ar'
 *
 * @returns {{ good: {label,status}[], improve: {label,status}[] }}
 */
export const analyzeForm = async ({ photoDataUrl, exercise, lang = 'en' }) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      lang === 'ar'
        ? 'مفتاح API غير موجود — أضف VITE_ANTHROPIC_API_KEY إلى .env.local'
        : 'API key missing — add VITE_ANTHROPIC_API_KEY to .env.local'
    );
  }

  // Extract base64 payload and media type from the data URL
  // Format: "data:image/jpeg;base64,<payload>"
  const commaIdx   = photoDataUrl.indexOf(',');
  const header     = photoDataUrl.slice(0, commaIdx);         // "data:image/jpeg;base64"
  const base64Data = photoDataUrl.slice(commaIdx + 1);        // the actual base64 string
  const mediaType  = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

  const exerciseName = exercise?.name || (lang === 'ar' ? 'تمرين' : 'exercise');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type:       'base64',
                media_type: mediaType,
                data:       base64Data,
              },
            },
            {
              type: 'text',
              text: buildPrompt(exerciseName, lang),
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText);
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text ?? '';

  // Extract the JSON object from the response (Claude sometimes adds commentary)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      lang === 'ar'
        ? 'تعذّر قراءة رد الذكاء الاصطناعي — حاول مجدداً'
        : 'Could not parse AI response — please try again'
    );
  }

  const result = JSON.parse(jsonMatch[0]);

  return {
    good:    (result.good    || []).slice(0, 3).map(label => ({ label, status: 'good'    })),
    improve: (result.improve || []).slice(0, 2).map(label => ({ label, status: 'improve' })),
  };
};
