import React, { useEffect, useState } from 'react';
import './AnimatedSplash.css';

const AnimatedSplash = ({ onComplete }) => {
  const [phase, setPhase] = useState('enter'); // enter → text → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'),  800);
    const t2 = setTimeout(() => setPhase('exit'),  2400);
    const t3 = setTimeout(() => onComplete?.(),    3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const RING_R      = 120;
  const CIRCUMFERENCE = 2 * Math.PI * RING_R;
  const N_DASHES    = 36;
  const DASH_LEN    = CIRCUMFERENCE / N_DASHES * 0.55;
  const GAP_LEN     = CIRCUMFERENCE / N_DASHES * 0.45;

  return (
    <div className={`asplash ${phase === 'exit' ? 'asplash--exit' : ''}`}>

      {/* Radial background pulse */}
      <div className="asplash-bg-pulse" />

      {/* Ring + F */}
      <div className={`asplash-ring-wrap ${phase !== 'enter' ? 'asplash-ring-wrap--visible' : ''}`}>
        <svg
          className="asplash-ring-svg"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer glow ring (non-dashed, faint) */}
          <circle
            cx="150" cy="150" r={RING_R + 8}
            fill="none"
            stroke="rgba(255,107,0,0.15)"
            strokeWidth="20"
          />

          {/* Animated dashed ring */}
          <circle
            className="asplash-dash-ring"
            cx="150" cy="150" r={RING_R}
            fill="none"
            stroke="#FF6B00"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${DASH_LEN} ${GAP_LEN}`}
            transform="rotate(-90 150 150)"
          />

          {/* Inner thin ring */}
          <circle
            className="asplash-inner-ring"
            cx="150" cy="150" r="88"
            fill="none"
            stroke="rgba(255,107,0,0.25)"
            strokeWidth="1.5"
          />
        </svg>

        {/* F lettermark */}
        <div className="asplash-letter-wrap">
          <span className="asplash-letter">F</span>
          <span className="asplash-dot" />
        </div>
      </div>

      {/* FITGUARD wordmark */}
      <div className={`asplash-wordmark ${phase === 'text' || phase === 'exit' ? 'asplash-wordmark--visible' : ''}`}>
        {'FITGUARD'.split('').map((ch, i) => (
          <span
            key={i}
            className="asplash-letter-char"
            style={{ animationDelay: `${i * 0.055}s` }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <div className={`asplash-tagline ${phase === 'text' || phase === 'exit' ? 'asplash-tagline--visible' : ''}`}>
        YOUR FITNESS SAFETY APP
      </div>

    </div>
  );
};

export default AnimatedSplash;
