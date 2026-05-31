/**
 * formCheckAI.js — AI form analysis (client side)
 *
 * SECURITY: This no longer calls Anthropic directly. The previous version
 * shipped VITE_ANTHROPIC_API_KEY inside the app bundle, where it was
 * extractable by anyone — an unbounded billing risk. We now call the
 * `form-check` Supabase Edge Function, which holds the key server-side,
 * authenticates the user, and rate-limits per account.
 *
 * The image is downscaled on-device before upload to cut latency, bandwidth
 * and token cost (a full-res phone photo is wasteful for this task).
 */

import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FN_URL = `${SUPABASE_URL}/functions/v1/form-check`;

const MAX_EDGE = 768; // longest image edge sent to the model
const JPEG_QUALITY = 0.8;

// ── Downscale a data URL via canvas → smaller JPEG data URL ───────────────────
const downscaleDataUrl = (dataUrl) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      } catch {
        resolve(dataUrl); // tainted canvas / unexpected error → send original
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

const splitDataUrl = (dataUrl) => {
  const commaIdx = dataUrl.indexOf(',');
  const header = dataUrl.slice(0, commaIdx);
  const base64 = dataUrl.slice(commaIdx + 1);
  const mediaType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
  return { base64, mediaType };
};

/**
 * Analyse exercise form in a photo.
 *
 * @param {object} params
 * @param {string} params.photoDataUrl - base64 data URL from camera / file input
 * @param {object} params.exercise     - { name, ... }
 * @param {string} params.lang         - 'en' | 'ar'
 * @returns {{ good: {label,status}[], improve: {label,status}[] }}
 */
export const analyzeForm = async ({ photoDataUrl, exercise, lang = 'en' }) => {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error(
      lang === 'ar'
        ? 'إعداد الخادم غير مكتمل — تحقق من متغيرات البيئة'
        : 'Server not configured — check environment variables'
    );
  }

  // Must be signed in: the Edge Function authenticates the request.
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error(
      lang === 'ar'
        ? 'يجب تسجيل الدخول لاستخدام تحليل الحركة'
        : 'Please sign in to use form analysis'
    );
  }

  const shrunk = await downscaleDataUrl(photoDataUrl);
  const { base64, mediaType } = splitDataUrl(shrunk);
  const exerciseName = exercise?.name || (lang === 'ar' ? 'تمرين' : 'exercise');

  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ exerciseName, lang, imageBase64: base64, mediaType }),
  });

  if (!res.ok) {
    let code = '';
    try { code = (await res.json())?.error || ''; } catch { /* ignore */ }
    if (res.status === 429 || code === 'rate_limited') {
      throw new Error(
        lang === 'ar'
          ? 'وصلت للحد اليومي لتحليل الحركة — جرّب غداً'
          : "You've hit today's form-check limit — try again tomorrow"
      );
    }
    if (res.status === 401) {
      throw new Error(
        lang === 'ar' ? 'انتهت الجلسة — سجّل الدخول مجدداً' : 'Session expired — please sign in again'
      );
    }
    throw new Error(
      lang === 'ar' ? 'تعذّر التحليل — حاول مجدداً' : 'Analysis failed — please try again'
    );
  }

  const result = await res.json();

  return {
    good: (result.good || []).slice(0, 3).map((label) => ({ label, status: 'good' })),
    improve: (result.improve || []).slice(0, 2).map((label) => ({ label, status: 'improve' })),
  };
};
