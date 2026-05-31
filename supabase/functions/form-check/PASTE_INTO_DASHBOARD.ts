// ─────────────────────────────────────────────────────────────────────────────
//  FitGuard — form-check  (SELF-CONTAINED version for the Supabase Dashboard)
//
//  HOW TO USE:
//  1. Supabase Dashboard → Edge Functions → "Deploy a new function"
//  2. Name it EXACTLY:  form-check
//  3. Delete the sample code it shows you, then paste THIS WHOLE FILE in.
//  4. Click Deploy.
//
//  (This file inlines the CORS headers so it's a single paste. The modular
//   version in index.ts is for the CLI and does the same thing.)
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400;

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
const MAX_CALLS_PER_WINDOW = 40;

const buildPrompt = (exerciseName: string, lang: string): string => {
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

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!anthropicKey || !supabaseUrl || !serviceKey) {
    return json({ error: 'server_misconfigured' }, 500);
  }

  // 1. Authenticate the caller
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'unauthorized' }, 401);

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (userErr || !user) return json({ error: 'unauthorized' }, 401);

  // 2. Rate limit per user
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count } = await admin
    .from('ai_usage')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', since);

  if ((count ?? 0) >= MAX_CALLS_PER_WINDOW) {
    return json({ error: 'rate_limited', retryAfterMs: WINDOW_MS }, 429);
  }

  // 3. Validate input
  let payload: { exerciseName?: string; lang?: string; imageBase64?: string; mediaType?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const { exerciseName = 'exercise', lang = 'en', imageBase64, mediaType = 'image/jpeg' } = payload;
  if (!imageBase64 || imageBase64.length < 100) return json({ error: 'missing_image' }, 400);
  if (imageBase64.length > 7_000_000) return json({ error: 'image_too_large' }, 413);

  // 4. Call Claude
  const anthropicRes = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: buildPrompt(exerciseName, lang) },
          ],
        },
      ],
    }),
  });

  if (!anthropicRes.ok) {
    const detail = await anthropicRes.text().catch(() => anthropicRes.statusText);
    console.error('anthropic_error', anthropicRes.status, detail);
    return json({ error: 'ai_error' }, 502);
  }

  const data = await anthropicRes.json();
  const rawText: string = data?.content?.[0]?.text ?? '';
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) return json({ error: 'unparseable' }, 502);

  let parsed: { good?: string[]; improve?: string[] };
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return json({ error: 'unparseable' }, 502);
  }

  // 5. Record usage (fire-and-forget)
  admin.from('ai_usage').insert({ user_id: user.id, kind: 'form_check' }).then(() => {});

  return json({
    good: (parsed.good ?? []).slice(0, 3),
    improve: (parsed.improve ?? []).slice(0, 2),
  });
});
