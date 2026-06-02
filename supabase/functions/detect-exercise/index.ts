/**
 * detect-exercise — FitGuard AI exercise scanner (Supabase Edge Function)
 *
 * Point the camera at a gym machine, a cardio console (treadmill/bike screen),
 * or a free-weight setup → Claude vision identifies the exercise and reads any
 * numbers it can see (time/distance/calories on a cardio screen). The app then
 * lets the user confirm sets/reps/weight and logs it. No body photos needed.
 *
 * Same security model as form-check: key server-side, user authenticated via
 * Supabase JWT, rate-limited per user via the shared `ai_usage` table.
 *
 * DEPLOY
 *   supabase functions deploy detect-exercise
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   (shared with form-check)
 *
 * POST {SUPABASE_URL}/functions/v1/detect-exercise
 *   headers: Authorization: Bearer <access_token>, apikey: <anon key>
 *   body:    { lang, imageBase64, mediaType }
 *   returns: {
 *     type: 'machine'|'cardio'|'freeweight'|'unknown',
 *     nameEn, nameAr, muscleEn, muscleAr,
 *     cardio: { durationMin, distanceKm, calories, speed } | null,
 *     confidence: 'high'|'medium'|'low',
 *     note: string
 *   }
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 500;

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
const MAX_CALLS_PER_WINDOW = 60;       // scanning is the core loop → a bit higher

const PROMPT = (lang: string) => `You are FitGuard's gym vision assistant. You are shown ONE photo taken in a gym. It is a picture of equipment or a screen — NOT a person's body.

Identify what it shows and reply as JSON ONLY (no text outside the JSON), in this EXACT shape:
{
  "type": "machine" | "cardio" | "freeweight" | "unknown",
  "nameEn": "exercise name in English",
  "nameAr": "exercise name in Arabic",
  "muscleEn": "primary muscle in English",
  "muscleAr": "primary muscle in Arabic",
  "cardio": { "durationMin": number|null, "distanceKm": number|null, "calories": number|null, "speed": number|null } ,
  "confidence": "high" | "medium" | "low",
  "note": "one short ${lang === 'ar' ? 'Arabic' : 'English'} sentence to the user"
}

Rules:
- "machine": a strength machine (leg press, lat pulldown, chest press, cable, Smith, etc). Name the EXERCISE it performs, not the brand.
- "cardio": a treadmill / bike / elliptical / rower OR its console screen. Read whatever numbers are visible into "cardio" (minutes, km, kcal, km/h). Use null for any number you cannot read clearly.
- "freeweight": barbell/dumbbell/bench setup. Infer the most likely exercise.
- If you truly cannot tell, use type "unknown" and say so kindly in "note".
- "cardio" must be null when type is not "cardio".
- Arabic fields must be natural Saudi-friendly Arabic.
- Keep names concise (e.g. "Leg Press", "ضغط الأرجل").`;

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

  // 1. Authenticate
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'unauthorized' }, 401);
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (userErr || !user) return json({ error: 'unauthorized' }, 401);

  // 2. Rate limit (shared ai_usage table)
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
  let payload: { lang?: string; imageBase64?: string; mediaType?: string };
  try { payload = await req.json(); } catch { return json({ error: 'bad_request' }, 400); }
  const { lang = 'en', imageBase64, mediaType = 'image/jpeg' } = payload;
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
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: PROMPT(lang) },
        ],
      }],
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

  let parsed: Record<string, unknown>;
  try { parsed = JSON.parse(match[0]); } catch { return json({ error: 'unparseable' }, 502); }

  // 5. Record usage (fire-and-forget)
  admin.from('ai_usage').insert({ user_id: user.id, kind: 'detect_exercise' }).then(() => {});

  // Normalize / harden the response
  const allowed = ['machine', 'cardio', 'freeweight', 'unknown'];
  const type = allowed.includes(parsed.type as string) ? parsed.type : 'unknown';
  return json({
    type,
    nameEn: String(parsed.nameEn ?? 'Exercise'),
    nameAr: String(parsed.nameAr ?? 'تمرين'),
    muscleEn: String(parsed.muscleEn ?? ''),
    muscleAr: String(parsed.muscleAr ?? ''),
    cardio: type === 'cardio' ? (parsed.cardio ?? null) : null,
    confidence: ['high', 'medium', 'low'].includes(parsed.confidence as string) ? parsed.confidence : 'low',
    note: String(parsed.note ?? ''),
  });
});
