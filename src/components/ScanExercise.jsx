import { useState } from 'react';
import { takeCameraPhoto, requestCameraPermission, isNative } from '../services/native';
import { scanExercise } from '../lib/scanExercise';
import './ScanExercise.css';

/**
 * ScanExercise — point camera at a machine / cardio screen / weights,
 * AI identifies the exercise (+ reads cardio numbers), user confirms → onAdd().
 *
 * Props:
 *   lang   'en' | 'ar'
 *   onAdd(exercise)  exercise = { id, nameEn, nameAr, muscleEn, muscleAr, icon, cardio? }
 *   onClose()
 */
const SCAN_CONSENT_KEY = 'fitguard_scan_consent_v1';

const ScanExercise = ({ lang = 'en', onAdd, onClose }) => {
  const isAr = lang === 'ar';
  const [stage, setStage] = useState('intro'); // intro | scanning | result | error
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [fileKey, setFileKey] = useState(0);

  const hasConsent = () => {
    try { return localStorage.getItem(SCAN_CONSENT_KEY) === 'yes'; } catch { return false; }
  };
  const giveConsent = () => { try { localStorage.setItem(SCAN_CONSENT_KEY, 'yes'); } catch { /* ignore */ } };

  const runScan = async (dataUrl) => {
    setPhoto(dataUrl);
    setStage('scanning');
    setError('');
    try {
      const r = await scanExercise({ photoDataUrl: dataUrl, lang });
      setResult(r);
      setStage('result');
    } catch (e) {
      setError(e?.message || (isAr ? 'تعذّر المسح' : 'Scan failed'));
      setStage('error');
    }
  };

  // source: 'camera' (live capture) | 'photos' (pick existing image)
  const capture = async (source = 'camera') => {
    giveConsent();
    if (isNative) {
      try {
        if (source === 'camera') {
          const perm = await requestCameraPermission();
          if (perm === 'denied') {
            setError(isAr ? 'تعذّر الوصول للكاميرا — تحقق من الإعدادات' : 'Camera denied — check app settings');
            setStage('error');
            return;
          }
        }
        const dataUrl = await takeCameraPhoto({ source });
        if (dataUrl) runScan(dataUrl);
      } catch {
        setError(isAr
          ? (source === 'photos' ? 'تعذّر فتح معرض الصور' : 'تعذّر فتح الكاميرا')
          : (source === 'photos' ? 'Could not open photo library' : 'Could not open camera'));
        setStage('error');
      }
    } else {
      // web: camera → input with capture attr; upload → plain file picker
      document.getElementById(source === 'photos' ? 'scan-file-input-lib' : 'scan-file-input')?.click();
    }
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => runScan(ev.target?.result);
    reader.readAsDataURL(f);
    setFileKey((k) => k + 1); // reset input
  };

  const confirmAdd = () => {
    if (!result) return;
    const id = (result.nameEn || 'scanned').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    onAdd({
      id,
      nameEn: result.nameEn,
      nameAr: result.nameAr,
      muscleEn: result.muscleEn || 'Other',
      muscleAr: result.muscleAr || 'أخرى',
      icon: result.type === 'cardio' ? '🏃' : '🤖',
      scanned: true,
      cardio: result.type === 'cardio' ? result.cardio : null,
    });
  };

  const confColor = result?.confidence === 'high' ? 'var(--green)'
    : result?.confidence === 'medium' ? 'var(--warning)' : 'var(--danger)';
  const confText = (c) => isAr
    ? ({ high: 'ثقة عالية', medium: 'ثقة متوسطة', low: 'غير متأكد' }[c] || '')
    : ({ high: 'High confidence', medium: 'Medium confidence', low: 'Not sure' }[c] || '');

  return (
    <div className="scan-overlay" onClick={onClose}>
      <input id="scan-file-input" key={`cam-${fileKey}`} type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={onFile} />
      <input id="scan-file-input-lib" key={`lib-${fileKey}`} type="file" accept="image/*"
        style={{ display: 'none' }} onChange={onFile} />
      <div className="scan-sheet" onClick={(e) => e.stopPropagation()} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="scan-header">
          <h3>{isAr ? '📸 مسح التمرين بالذكاء' : '📸 AI Exercise Scan'}</h3>
          <button className="scan-close" onClick={onClose}>✕</button>
        </div>

        {/* INTRO */}
        {stage === 'intro' && (
          <div className="scan-body">
            <div className="scan-illus">🤖</div>
            <p className="scan-lead">
              {isAr
                ? 'صوّر الجهاز أو شاشة المشاية، والذكاء الاصطناعي يتعرّف على التمرين ويسجّله لك.'
                : 'Snap a photo of the machine or treadmill screen — AI identifies the exercise and logs it.'}
            </p>
            {!hasConsent() && (
              <p className="scan-consent">
                {isAr
                  ? '🔒 تُرسل الصورة بشكل آمن لخادمنا للتحليل فقط، ولا نحتفظ بها.'
                  : '🔒 The photo is sent securely to our server for analysis only and is not stored.'}
              </p>
            )}
            <button className="scan-cta" onClick={() => capture('camera')}>
              {isAr ? '📷 افتح الكاميرا' : '📷 Open Camera'}
            </button>
            <button className="scan-cta scan-cta--ghost" onClick={() => capture('photos')}>
              {isAr ? '🖼️ ارفع صورة من المعرض' : '🖼️ Upload from Library'}
            </button>
          </div>
        )}

        {/* SCANNING */}
        {stage === 'scanning' && (
          <div className="scan-body">
            {photo && <img src={photo} alt="" className="scan-photo" />}
            <div className="scan-loading">
              <div className="scan-spinner" />
              <p>{isAr ? 'جارٍ التعرّف على التمرين…' : 'Identifying exercise…'}</p>
            </div>
          </div>
        )}

        {/* RESULT */}
        {stage === 'result' && result && (
          <div className="scan-body">
            {photo && <img src={photo} alt="" className="scan-photo scan-photo--sm" />}
            <div className="scan-result-card">
              <div className="scan-result-top">
                <span className="scan-result-icon">{result.type === 'cardio' ? '🏃' : '🏋️'}</span>
                <div>
                  <div className="scan-result-name">{isAr ? result.nameAr : result.nameEn}</div>
                  <div className="scan-result-muscle">{isAr ? result.muscleAr : result.muscleEn}</div>
                </div>
                <span className="scan-conf" style={{ color: confColor, borderColor: confColor }}>
                  {confText(result.confidence)}
                </span>
              </div>

              {result.type === 'cardio' && result.cardio && (
                <div className="scan-cardio">
                  {result.cardio.durationMin != null && <span>⏱ {result.cardio.durationMin} {isAr ? 'د' : 'min'}</span>}
                  {result.cardio.distanceKm != null && <span>📏 {result.cardio.distanceKm} km</span>}
                  {result.cardio.calories != null && <span>🔥 {result.cardio.calories} {isAr ? 'سعرة' : 'kcal'}</span>}
                  {result.cardio.speed != null && <span>⚡ {result.cardio.speed} km/h</span>}
                </div>
              )}

              {result.note && <p className="scan-note">{result.note}</p>}
            </div>

            <div className="scan-actions">
              <button className="scan-retry" onClick={() => setStage('intro')}>
                {isAr ? '🔄 صورة ثانية' : '🔄 New photo'}
              </button>
              <button className="scan-cta" onClick={confirmAdd}>
                {isAr ? '✓ أضف للتمرين' : '✓ Add to workout'}
              </button>
            </div>
            <p className="scan-hint">
              {isAr ? 'بتقدر تعدّل الوزن والسيتات بعد الإضافة.' : 'You can edit weight & sets after adding.'}
            </p>
          </div>
        )}

        {/* ERROR */}
        {stage === 'error' && (
          <div className="scan-body">
            <div className="scan-illus">😕</div>
            <p className="scan-error">{error}</p>
            <button className="scan-cta" onClick={() => setStage('intro')}>
              {isAr ? 'حاول مجدداً' : 'Try again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanExercise;
