import { useEffect, useState } from 'react';
import './AnimatedSplash.css';

/**
 * AnimatedSplash — "Pulse Shield" concept.
 * Shield outline draws itself → fills → emits a protective pulse → the F lands,
 * then the FITGUARD wordmark + tagline fade in. One screen (native splash hands
 * off to this instantly; see main.jsx / capacitor.config.ts).
 */
const AnimatedSplash = ({ onComplete }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const tExit = setTimeout(() => setExit(true), 2600);
    const tDone = setTimeout(() => onComplete?.(), 3150);
    return () => { clearTimeout(tExit); clearTimeout(tDone); };
  }, []);

  return (
    <div className={`asplash ${exit ? 'asplash--exit' : ''}`}>
      <div className="asplash-bg-pulse" />

      <div className="asplash-shield-wrap">
        {/* expanding protective pulse rings */}
        <span className="asplash-pulse asplash-pulse--1" />
        <span className="asplash-pulse asplash-pulse--2" />

        <svg className="asplash-shield" viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg">
          {/* soft fill that scales in after the outline draws */}
          <path
            className="asplash-shield-fill"
            d="M50 20 L78 31 V58 C78 78 64 91 50 96 C36 91 22 78 22 58 V31 Z"
            fill="rgba(255,107,0,0.16)"
          />
          {/* outline that draws itself */}
          <path
            className="asplash-shield-path"
            d="M50 6 L90 22 V58 C90 86 70 104 50 110 C30 104 10 86 10 58 V22 Z"
            fill="none" stroke="#FF6B00" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
          />
          {/* F lettermark */}
          <text className="asplash-shield-f" x="50" y="70" textAnchor="middle"
            fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="40" fill="#fff">F</text>
        </svg>
      </div>

      <div className="asplash-wordmark">
        {'FITGUARD'.split('').map((ch, i) => (
          <span key={i} className="asplash-char" style={{ animationDelay: `${1.3 + i * 0.05}s` }}>{ch}</span>
        ))}
      </div>

      <div className="asplash-tagline">YOUR FITNESS SAFETY APP</div>
    </div>
  );
};

export default AnimatedSplash;
