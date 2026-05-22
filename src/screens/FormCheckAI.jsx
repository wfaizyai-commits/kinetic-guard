import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Button from '../components/Button';
import './FormCheckAI.css';

const FORM_TIPS = {
  en: [
    { label: 'Keep your back straight', status: 'good' },
    { label: 'Knees track over toes', status: 'good' },
    { label: 'Core braced and engaged', status: 'good' },
    { label: 'Controlled descent speed', status: 'improve' },
    { label: 'Full depth achieved', status: 'improve' },
  ],
  ar: [
    { label: 'حافظ على استقامة ظهرك', status: 'good' },
    { label: 'الركبتان محاذيتان للأصابع', status: 'good' },
    { label: 'الجذع مشدود ومفعّل', status: 'good' },
    { label: 'سرعة النزول متحكم بها', status: 'improve' },
    { label: 'الوصول للعمق الكامل', status: 'improve' },
  ]
};

const FormCheckAI = ({ exercise, onBack }) => {
  const { t, lang } = useLanguage();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [tips, setTips] = useState([]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setPermissionDenied(false);
    } catch (e) {
      console.error('Camera error:', e);
      setPermissionDenied(true);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setAnalysisComplete(false);
    setAnalyzing(false);
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
      setTips(FORM_TIPS[lang] || FORM_TIPS.en);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const goodTips = tips.filter(tip => tip.status === 'good');
  const improveTips = tips.filter(tip => tip.status === 'improve');

  return (
    <div className="formcheck-screen screen">
      <div className="lang-toggle-fixed">
        <LanguageToggle />
      </div>

      {/* Header */}
      <div className="formcheck-header">
        <button type="button" className="back-btn" onClick={() => { stopCamera(); onBack && onBack(); }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t.exercise.back}</span>
        </button>
        <h2 className="formcheck-title-header">{t.formCheck.title}</h2>
        <div style={{ width: 60 }} />
      </div>

      <div className="formcheck-content">
        {/* Camera viewport */}
        <div className="formcheck-viewport animate-fade-up">
          <video
            ref={videoRef}
            className={['formcheck-video', cameraActive ? 'formcheck-video--active' : ''].filter(Boolean).join(' ')}
            autoPlay
            muted
            playsInline
          />

          {!cameraActive && !permissionDenied && (
            <div className="formcheck-placeholder">
              <div className="formcheck-placeholder__icon">📷</div>
              <p className="formcheck-placeholder__text">
                {lang === 'ar' ? 'وجّه الكاميرا نحوك أثناء التمرين' : 'Position camera to see your full body during exercise'}
              </p>
            </div>
          )}

          {permissionDenied && (
            <div className="formcheck-placeholder formcheck-placeholder--error">
              <div className="formcheck-placeholder__icon">🚫</div>
              <p className="formcheck-placeholder__text">{t.formCheck.permissionDenied}</p>
            </div>
          )}

          {cameraActive && analyzing && (
            <div className="formcheck-analyzing">
              <div className="formcheck-analyzing__spinner" />
              <p>{t.formCheck.analyzing}</p>
            </div>
          )}

          {cameraActive && (
            <div className="formcheck-corners">
              <span className="formcheck-corner formcheck-corner--tl" />
              <span className="formcheck-corner formcheck-corner--tr" />
              <span className="formcheck-corner formcheck-corner--bl" />
              <span className="formcheck-corner formcheck-corner--br" />
            </div>
          )}
        </div>

        {/* Camera controls */}
        <div className="formcheck-controls animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {!cameraActive ? (
            <Button variant="primary" size="lg" fullWidth onClick={startCamera}>
              📷 {t.formCheck.startCamera}
            </Button>
          ) : (
            <div className="formcheck-controls__row">
              <Button variant="ghost" size="md" onClick={stopCamera}>
                {t.formCheck.stopCamera}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={runAnalysis}
                disabled={analyzing}
                className="formcheck-analyze-btn"
              >
                {analyzing ? t.formCheck.analyzing : (lang === 'ar' ? '🤖 تحليل الأداء' : '🤖 Analyze Form')}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCheckAI;
