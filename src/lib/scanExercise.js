/**
 * scanExercise.js — client for the detect-exercise Edge Function.
 *
 * Takes a gym photo (machine, cardio screen, or free weights), downscales it,
 * and asks the server-side AI to identify the exercise + read any cardio numbers.
 * Mirrors formCheckAI.js: no API key in the client, auth via Supabase session.
 */

import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FN_URL = `${SUPABASE_URL}/functions/v1/detect-exercise`;

const MAX_EDGE = 1024; // machine/screen text needs a bit more detail than a body pose
const JPEG_QUALITY = 0.82;

const downscaleDataUrl = (dataUrl) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      try { resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY)); }
      catch { resolve(dataUrl); }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

const splitDataUrl = (dataUrl) => {
  const i = dataUrl.indexOf(',');
  const header = dataUrl.slice(0, i);
  return {
    base64: dataUrl.slice(i + 1),
    mediaType: header.match(/data:([^;]+)/)?.[1] || 'image/jpeg',
  };
};

/**
 * @param {object} p
 * @param {string} p.photoDataUrl  data URL from camera/file input
 * @param {string} p.lang          'en' | 'ar'
 * @returns {Promise<{type,nameEn,nameAr,muscleEn,muscleAr,cardio,confidence,note}>}
 */
export const scanExercise = async ({ photoDataUrl, lang = 'en' }) => {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error(lang === 'ar' ? 'إعداد الخادم غير مكتمل' : 'Server not configured');
  }
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error(lang === 'ar' ? 'سجّل الدخول لاستخدام المسح' : 'Please sign in to use the scanner');
  }

  const shrunk = await downscaleDataUrl(photoDataUrl);
  const { base64, mediaType } = splitDataUrl(shrunk);

  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ lang, imageBase64: base64, mediaType }),
  });

  if (!res.ok) {
    let code = '';
    try { code = (await res.json())?.error || ''; } catch { /* ignore */ }
    if (res.status === 429 || code === 'rate_limited') {
      throw new Error(lang === 'ar' ? 'وصلت للحد اليومي للمسح — جرّب غداً' : "You've hit today's scan limit — try tomorrow");
    }
    if (res.status === 401) {
      throw new Error(lang === 'ar' ? 'انتهت الجلسة — سجّل الدخول مجدداً' : 'Session expired — please sign in again');
    }
    throw new Error(lang === 'ar' ? 'تعذّر المسح — حاول مجدداً' : 'Scan failed — please try again');
  }

  return res.json();
};
