/**
 * welcome-email — sends a bilingual welcome email to new waitlist signups.
 *
 * STATUS: scaffold. Wire a provider before enabling (Resend recommended — simple
 * + good deliverability). Then trigger it from a Supabase Database Webhook on
 * INSERT into public.waitlist, OR call it from the landing page after signup.
 *
 * DEPLOY
 *   supabase functions deploy welcome-email
 *   supabase secrets set RESEND_API_KEY=re_...   (provider key — server-side only)
 *   supabase secrets set WELCOME_FROM="FitGuard <hello@fitguardapp.com>"
 *
 * RECOMMENDED TRIGGER (no client call needed):
 *   Supabase Dashboard → Database → Webhooks → new webhook on
 *   table public.waitlist, event INSERT → HTTP POST to this function.
 *   The webhook sends { record: { email, lang } } automatically.
 */
import { corsHeaders } from '../_shared/cors.ts';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const subject = (lang: string) =>
  lang === 'ar' ? 'أهلاً بك في قائمة انتظار FitGuard 🛡️' : 'Welcome to the FitGuard waitlist 🛡️';

const html = (lang: string) => lang === 'ar'
  ? `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#0C0A08;color:#F5EFE8;padding:32px;border-radius:16px">
       <h1 style="color:#FF6B00;margin:0 0 12px">أهلاً بك في FitGuard 🎉</h1>
       <p style="line-height:1.8;color:#cfc9c2">سجّلناك في قائمة الانتظار. قبل الإطلاق الرسمي بنرسل لك دعوة TestFlight + ٣ أشهر Pro مجاناً.</p>
       <p style="line-height:1.8;color:#cfc9c2">FitGuard أول مدرب لياقة ذكي بالعربي: يفحص جاهزيتك قبل كل تمرين، يحميك من الإصابة، ويتكيّف مع جسمك ويومك.</p>
       <p style="color:#8c8c8c;font-size:13px;margin-top:24px">تدرّب بذكاء. ابقَ محمياً. · fitguardapp.com</p>
     </div>`
  : `<div style="font-family:Arial,sans-serif;background:#0C0A08;color:#F5EFE8;padding:32px;border-radius:16px">
       <h1 style="color:#FF6B00;margin:0 0 12px">Welcome to FitGuard 🎉</h1>
       <p style="line-height:1.7;color:#cfc9c2">You're on the waitlist. Before launch we'll send you a TestFlight invite + 3 months of Pro, free.</p>
       <p style="line-height:1.7;color:#cfc9c2">FitGuard is the first Arabic AI fitness safety coach: it checks your readiness before every workout, protects you from injury, and adapts to your body and your day.</p>
       <p style="color:#8c8c8c;font-size:13px;margin-top:24px">Train Smart. Stay Safe. · fitguardapp.com</p>
     </div>`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const RESEND = Deno.env.get('RESEND_API_KEY');
  const FROM = Deno.env.get('WELCOME_FROM') || 'FitGuard <onboarding@resend.dev>';
  if (!RESEND) return json({ error: 'email_not_configured' }, 503);

  // Accept either a direct {email,lang} or a Supabase webhook {record:{...}}
  let body: { email?: string; lang?: string; record?: { email?: string; lang?: string } };
  try { body = await req.json(); } catch { return json({ error: 'bad_request' }, 400); }
  const email = body.email || body.record?.email;
  const lang = (body.lang || body.record?.lang || 'ar') === 'en' ? 'en' : 'ar';
  if (!email) return json({ error: 'missing_email' }, 400);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: email, subject: subject(lang), html: html(lang) }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    console.error('resend_error', res.status, detail);
    return json({ error: 'send_failed' }, 502);
  }
  return json({ ok: true });
});
