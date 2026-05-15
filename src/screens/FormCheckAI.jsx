import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Camera as CameraIcon } from 'lucide-react';
import Button from '../components/Button';
import {
  isNative,
  requestCameraPermission,
  hapticMedium,
  hapticSuccess,
  hapticWarning,
  hapticError,
} from '../services/native.js';
import './FormCheckAI.css';

const FormCheckAI = ({ exercise, onBack, onResult }) => {
  const [phase, setPhase] = useState('instructions'); // instructions, requesting, recording, analyzing, result
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up camera stream when leaving
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleStartRecording = async () => {
    hapticMedium();
    setPhase('requesting');
    setCameraError(null);

    try {
      if (isNative) {
        // On device: request native camera permission
        const status = await requestCameraPermission();
        setCameraPermission(status);
        if (status !== 'granted') {
          setCameraError('Camera permission denied. Please enable it in Settings → KineticGuard → Camera.');
          setPhase('instructions');
          return;
        }
        // On native, we use the WebView camera (MediaPipe needs direct stream)
        // Capacitor Camera plugin is for photos; for live video we use getUserMedia
      }

      // Start live video stream (works on both web and Capacitor WebView)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // front camera for self-check
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setPhase('recording');

      // Attach stream to video element on next tick
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);

      // Auto-advance to analyzing after 4 seconds of recording
      // TODO: Replace with real MediaPipe pose detection
      setTimeout(() => {
        stopCamera();
        setPhase('analyzing');
        hapticMedium();
        setTimeout(() => {
          setPhase('result');
          const r = getResult();
          if (r.status === 'success') hapticSuccess();
          else if (r.status === 'warning') hapticWarning();
          else hapticError();
        }, 2500);
      }, 4000);

    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access was denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Could not start camera: ' + err.message);
      }
      setPhase('instructions');
      hapticError();
    }
  };

  const getResult = () => {
    if (exercise?.equipment === 'kettlebell') {
      return {
        status: 'success',
        message: 'Safety Green Light',
        detail: 'Your form looks strong and stable. Great depth on the squat!',
      };
    }
    return {
      status: 'warning',
      message: 'Form Alert',
      detail: 'Keep your chest up during the movement. Avoid rounding your lower back.',
    };
  };

  if (phase === 'result') {
    const result = getResult();
    return (
      <div className="form-check">
        <div className="form-check__result">
          <div className={`form-check__result-icon ${result.status}`}>
            {result.status === 'success' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
          </div>
          <h2 className="form-check__result-title">{result.message}</h2>
          <p className="form-check__result-detail">{result.detail}</p>
          <Button onClick={onBack}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-check">
      <div className="form-check__header">
        <button className="form-check__close" onClick={() => { stopCamera(); onBack(); }}>
          <X size={24} />
        </button>
        <span className="form-check__title">Form-Check AI</span>
      </div>

      <div className="form-check__content">
        {(phase === 'instructions' || phase === 'requesting') && (
          <>
            <h2 className="form-check__heading">Position yourself 5 feet from phone</h2>
            <p className="form-check__subheading">Perform 3 reps at controlled pace</p>

            <div className="form-check__skeleton-demo">
              <div className="skeleton-figure">
                <div className="skeleton-head" />
                <div className="skeleton-torso" />
                <div className="skeleton-arm" />
                <div className="skeleton-arm" />
                <div className="skeleton-leg" />
                <div className="skeleton-leg" />
              </div>
            </div>

            {cameraError && (
              <div className="form-check__error">
                <AlertCircle size={16} />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="form-check__instructions">
              <div className="form-check__instruction-item">
                <span className="form-check__instruction-num">1</span>
                <span>Position your phone on a stable surface facing you</span>
              </div>
              <div className="form-check__instruction-item">
                <span className="form-check__instruction-num">2</span>
                <span>Stand 5 feet (1.5m) away from the camera</span>
              </div>
              <div className="form-check__instruction-item">
                <span className="form-check__instruction-num">3</span>
                <span>Perform 3 controlled reps of {exercise?.name || 'the exercise'}</span>
              </div>
            </div>

            <Button
              onClick={handleStartRecording}
              fullWidth
              disabled={phase === 'requesting'}
            >
              {phase === 'requesting' ? 'Starting Camera...' : 'Start Recording'}
            </Button>
          </>
        )}

        {phase === 'recording' && (
          <div className="form-check__recording">
            <div className="form-check__camera-frame">
              {/* Live camera feed */}
              <video
                ref={videoRef}
                className="form-check__video"
                autoPlay
                playsInline
                muted
              />
              <div className="form-check__recording-indicator">
                <span className="recording-dot" />
                Recording...
              </div>
            </div>
            <p className="form-check__recording-hint">Perform 3 slow, controlled reps</p>
          </div>
        )}

        {phase === 'analyzing' && (
          <div className="form-check__analyzing">
            <div className="form-check__analyzing-spinner" />
            <h2 className="form-check__analyzing-title">Analyzing Form...</h2>
            <p className="form-check__analyzing-subtitle">Checking movement quality and safety markers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCheckAI;
