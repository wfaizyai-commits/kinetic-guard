import React, { useState, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import { takeCameraPhoto, requestCameraPermission, isNative } from '../services/native';
import { analyzeForm } from '../lib/formCheckAI';
import './FormCheckAI.css';

const CAM_CONSENT_KEY = 'fitguard_cam_consent_v1';

const FormCheckAI = ({ exercise, onBack }) => {
  const { t, lang } = useLanguage();
  const fileInputRef = useRef(null);

  const [photoDataUrl, setPhotoDataUrl] = useState(null);  // captured image
  const [analyzing, setAnalyzing]       = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [tips, setTips]                 = useState([]);
  const [errorMsg, setErrorMsg]         = useState('');
  const [showConsent, setShowConsent]   = useState(false);

  const isAr = lang === 'ar';

  const hasCameraConsent = () => {
    try { return localStorage.getItem(CAM_CONSENT_KEY) === 'yes'; } catch { return false; }
  };

  // ── Actual capture (after consent) ────────────────────────────────────────────
  const doCapture = async () => {
    setErrorMsg('');
    setAnalysisComplete(false);
    setTips([]);

    if (isNative) {
      // ── Native iOS / Android: request permission then shoot ───────────────
      try {
        const permission = await requestCameraPermission();
        if (permission === 'denied') {
          setErrorMsg(isAr ? 'تعذّر الوصول للكاميرا — تحقق من إعدادات التطبيق' : 'Camera permission denied — check app settings');
          return;
        }
        const dataUrl = await takeCameraPhoto();
        if (dataUrl) setPhotoDataUrl(dataUrl);
      } catch (e) {
        setErrorMsg(isAr ? 'تعذّر فتح الكاميرا' : 'Could not open camera');
      }
    } else {
      // ── Web / browser fallback: file input with camera capture ────────────
      fileInputRef.current?.click();
    }
  };

  // ── Take photo (consent gate) ─────────────────────────────────────────────────
  const takePhoto = async () => {
    if (!hasCameraConsent()) {
      setShowConsent(true);
      return;
    }
    await doCapture();
  };

  const acceptConsent = async () => {
    try { localStorage.setItem(CAM_CONSENT_KEY, 'yes'); } catch { /* ignore */ }
    setShowConsent(false);
    await doCapture();
  };

  // Handles the web fallback file-input result
  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoDataUrl(ev.target?.result);
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  // ── Retake ──────────────────────────────────────────────────────────────────
  const retakePhoto = () => {
    setPhotoDataUrl(null);
    setAnalysisComplete(false);
    setTips([]);
    setErrorMsg('');
  };

  // ── Analyse ─────────────────────────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!photoDataUrl) return;
    setAnalyzing(true);
    setAnalysisComplete(false);
    setTips([]);
    setErrorMsg('');
    try {
      const result = await analyzeForm({
        photoDataUrl,
        exercise,
        lang,
      });
      setTips([...result.good, ...result.improve]);
      setAnalysisComplete(true);
    } catch (e) {
      setErrorMsg(e?.message || (isAr ? 'فشل التحليل — حاول مجدداً' : 'Analysis failed — please try again'));
    } finally {
      setAnalyzing(false);
    }
  };

  const goodTips    = tips.filter(tip => tip.status === 'good');
  const improveTips = tips.filter(tip => tip.status === 'improve');

  return (
    <div className="formcheck-screen screen">
      {/* Hidden file input — web fallback only */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      {/* ── One-time camera / data-use consent ────────────────────────────── */}
      {showConsent && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
        >
          <div style={{
            background: 'var(--surface-elevated, #141414)',
            border: '1px solid var(--border, rgba(255,255,255,0.08))',
            borderRadius: 'var(--radius-xl, 20px)',
            padding: '28px 24px', width: '100%', maxWidth: '380px',
            textAlign: isAr ? 'right' : 'left',
          }}>
            <div style={{ fontSize: '34px', textAlign: 'center', marginBottom: '10px' }}>🔒📷</div>
            <h3 style={{ fontFamily: 'var(--font-heading, sans-serif)', fontSize: '19px', fontWeight: 900, color: 'var(--text-primary, #fff)', marginBottom: '10px', textAlign: 'center' }}>
              {isAr ? 'تحليل الحركة بالصورة' : 'Photo-based form analysis'}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary, #A0A0A0)', lineHeight: 1.7, marginBottom: '18px' }}>
              {isAr
                ? 'لتحليل أدائك، تُرسل صورتك بشكل آمن إلى خادمنا ثم إلى خدمة الذكاء الاصطناعي للحصول على ملاحظات فورية. لا نحتفظ بالصورة بعد التحليل. بالمتابعة فإنك توافق على ذلك.'
                : 'To analyse your form, your photo is sent securely to our server and then to an AI service for instant feedback. We do not keep the image after analysis. By continuing you consent to this.'}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="ghost" size="md" onClick={() => setShowConsent(false)}>
                {isAr ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button variant="primary" size="md" fullWidth onClick={acceptConsent}>
                {isAr ? 'موافق، تابع' : 'Agree & Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="lang-toggle-fixed">
        <LanguageToggle />
      </div>

      {/* Header */}
      <div className="formcheck-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => { retakePhoto(); onBack && onBack(); }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t.exercise.back}</span>
        </button>
        <h2 className="formcheck-title-header">{t.formCheck.title}</h2>
        <div style={{ width: 60 }} />
      </div>

      <div className="formcheck-content">
        {/* Photo viewport */}
        <div className="formcheck-viewport animate-fade-up">
          {photoDataUrl ? (
            <>
              <img
                src={photoDataUrl}
                alt="Form snapshot"
                className="formcheck-photo"
              />
              {analyzing && (
                <div className="formcheck-analyzing">
                  <div className="formcheck-analyzing__spinner" />
                  <p>{t.formCheck.analyzing}</p>
                </div>
              )}
              {/* Corner brackets overlay */}
              <div className="formcheck-corners">
                <span className="formcheck-corner formcheck-corner--tl" />
                <span className="formcheck-corner formcheck-corner--tr" />
                <span className="formcheck-corner formcheck-corner--bl" />
                <span className="formcheck-corner formcheck-corner--br" />
              </div>
            </>
          ) : (
            <div className="formcheck-placeholder">
              <div className="formcheck-placeholder__icon">📷</div>
              <p className="formcheck-placeholder__text">
                {isAr
                  ? 'صوّر نفسك أثناء أداء التمرين لتحليل أدائك'
                  : 'Take a photo of yourself performing the exercise'}
              </p>
              {errorMsg && (
                <p className="formcheck-placeholder__error">{errorMsg}</p>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="formcheck-controls animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {!photoDataUrl ? (
            <Button variant="primary" size="lg" fullWidth onClick={takePhoto}>
              📷 {t.formCheck.startCamera}
            </Button>
          ) : (
            <div className="formcheck-controls__row">
              <Button variant="ghost" size="md" onClick={retakePhoto}>
                {isAr ? '🔄 إعادة' : '🔄 Retake'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={runAnalysis}
                disabled={analyzing || analysisComplete}
                className="formcheck-analyze-btn"
              >
                {analyzing
                  ? (isAr ? '🤖 جارٍ التحليل…' : '🤖 Analysing…')
                  : (isAr ? '🤖 تحليل الأداء' : '🤖 Analyze Form')}
              </Button>
            </div>
          )}
        </div>

        {/* Inline error after analyze attempt */}
        {!analyzing && errorMsg && photoDataUrl && (
          <div className="formcheck-api-error animate-fade-up">
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Analysis results */}
        {analysisComplete && tips.length > 0 && (
          <div className="formcheck-results animate-scale-in">
            {goodTips.length > 0 && (
              <div className="formcheck-results__section">
                <p className="formcheck-results__section-title formcheck-results__section-title--good">
                  ✅ {t.formCheck.good}
                </p>
                {goodTips.map((tip, i) => (
                  <div key={i} className="formcheck-tip formcheck-tip--good">
                    <span className="formcheck-tip__dot formcheck-tip__dot--good" />
                    <span>{tip.label}</span>
                  </div>
                ))}
              </div>
            )}
            {improveTips.length > 0 && (
              <div className="formcheck-results__section">
                <p className="formcheck-results__section-title formcheck-results__section-title--improve">
                  ⚡ {t.formCheck.improve}
                </p>
                {improveTips.map((tip, i) => (
                  <div key={i} className="formcheck-tip formcheck-tip--improve">
                    <span className="formcheck-tip__dot formcheck-tip__dot--improve" />
                    <span>{tip.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Retake CTA after results */}
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={retakePhoto}
              style={{ marginTop: '8px' }}
            >
              {isAr ? '📷 صوّر تمريناً آخر' : '📷 Take Another Shot'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCheckAI;
