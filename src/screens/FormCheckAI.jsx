import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import { takeCameraPhoto, requestCameraPermission, isNative } from '../services/native';
import './FormCheckAI.css';

// ── Static form-check tips (exercise-specific in a real app) ─────────────────
const FORM_TIPS = {
  en: [
    { label: 'Back is straight and neutral', status: 'good' },
    { label: 'Knees tracking over toes', status: 'good' },
    { label: 'Core braced and engaged', status: 'good' },
    { label: 'Control your descent speed', status: 'improve' },
    { label: 'Reach full depth on each rep', status: 'improve' },
  ],
  ar: [
    { label: 'الظهر مستقيم ومحايد', status: 'good' },
    { label: 'الركبتان محاذيتان للأصابع', status: 'good' },
    { label: 'الجذع مشدود ومفعّل', status: 'good' },
    { label: 'تحكّم في سرعة النزول', status: 'improve' },
    { label: 'اصل للعمق الكامل في كل تكرار', status: 'improve' },
  ]
};

const FormCheckAI = ({ exercise, onBack }) => {
  const { t, lang } = useLanguage();
  const fileInputRef = useRef(null);

  const [photoDataUrl, setPhotoDataUrl] = useState(null);  // captured image
  const [analyzing, setAnalyzing]       = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [tips, setTips]                 = useState([]);
  const [errorMsg, setErrorMsg]         = useState('');

  // ── Take photo ──────────────────────────────────────────────────────────────
  const takePhoto = async () => {
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
  const runAnalysis = () => {
    setAnalyzing(true);
    setAnalysisComplete(false);
    // Simulated AI analysis — replace with real model call when ready
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
      setTips(FORM_TIPS[lang] || FORM_TIPS.en);
    }, 2200);
  };

  // Cleanup on unmount
  useEffect(() => () => {}, []);

  const goodTips    = tips.filter(tip => tip.status === 'good');
  const improveTips = tips.filter(tip => tip.status === 'improve');

  const isAr = lang === 'ar';

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
                  ? t.formCheck.analyzing
                  : (isAr ? '🤖 تحليل الأداء' : '🤖 Analyze Form')}
              </Button>
            </div>
          )}
        </div>

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
