import React, { useState } from 'react';

/**
 * MedicalDisclaimer — one-time safety/liability gate.
 *
 * FitGuard screens "readiness", flags injuries, and substitutes exercises for
 * conditions like joint pain / post-surgery. That is wellness guidance, NOT
 * medical advice. This gate makes the user acknowledge that before any feature
 * is used. Acceptance is stored in localStorage ('fitguard_medical_v1').
 */
const MedicalDisclaimer = ({ lang = 'en', onAccept }) => {
  const isAR = lang === 'ar';
  const [checked, setChecked] = useState(false);

  const t = isAR
    ? {
        title: 'تنبيه السلامة',
        intro:
          'FitGuard أداة لياقة ووعي بدني — وليست بديلاً عن الاستشارة الطبية أو التشخيص أو العلاج.',
        points: [
          'استشر طبيبك قبل بدء أي برنامج تمارين، خاصة إذا كان لديك إصابة أو حالة مزمنة أو خضعت لعملية.',
          'التوصيات والتعديلات إرشادية عامة وقد لا تناسب حالتك الفردية.',
          'توقّف فوراً عند الشعور بألم أو دوخة أو ضيق نفس، واطلب المساعدة الطبية.',
          'أنت المسؤول عن أدائك للتمارين وعن قرار التمرّن من عدمه.',
        ],
        agree: 'قرأت وأوافق على ما سبق',
        button: 'موافق، تابع',
      }
    : {
        title: 'Safety Notice',
        intro:
          'FitGuard is a fitness and body-awareness tool — not a substitute for professional medical advice, diagnosis, or treatment.',
        points: [
          'Consult your doctor before starting any exercise program, especially with an injury, chronic condition, or recent surgery.',
          'Recommendations and exercise swaps are general guidance and may not suit your individual condition.',
          'Stop immediately if you feel pain, dizziness, or shortness of breath, and seek medical help.',
          'You are responsible for how you perform exercises and whether to train.',
        ],
        agree: 'I have read and agree to the above',
        button: 'Agree & Continue',
      };

  return (
    <div
      dir={isAR ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--surface, #0A0A0A)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'var(--surface-elevated, #141414)',
          border: '1px solid var(--border, rgba(255,255,255,0.08))',
          borderRadius: 'var(--radius-xl, 20px)',
          padding: '32px 24px',
          width: '100%', maxWidth: '420px',
          maxHeight: '90vh', overflowY: 'auto',
          textAlign: isAR ? 'right' : 'left',
        }}
      >
        <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '12px' }}>⚠️</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading, sans-serif)', fontSize: '22px', fontWeight: 900,
            color: 'var(--text-primary, #fff)', marginBottom: '12px', textAlign: 'center',
          }}
        >
          {t.title}
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary, #A0A0A0)', lineHeight: 1.7, marginBottom: '18px' }}>
          {t.intro}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {t.points.map((p, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13.5px', color: 'var(--text-secondary, #A0A0A0)', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--orange, #FF6B00)', flex: '0 0 auto' }}>•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <label
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '13.5px', color: 'var(--text-primary, #fff)',
            marginBottom: '20px', cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--orange, #FF6B00)', flex: '0 0 auto' }}
          />
          <span>{t.agree}</span>
        </label>

        <button
          type="button"
          disabled={!checked}
          onClick={onAccept}
          style={{
            width: '100%', border: 'none',
            borderRadius: 'var(--radius-md, 12px)',
            padding: '16px', fontSize: '16px', fontWeight: 700,
            fontFamily: 'var(--font-heading, sans-serif)',
            background: 'var(--orange, #FF6B00)', color: '#fff',
            cursor: checked ? 'pointer' : 'not-allowed',
            opacity: checked ? 1 : 0.5, transition: 'opacity 0.2s',
          }}
        >
          {t.button}
        </button>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
