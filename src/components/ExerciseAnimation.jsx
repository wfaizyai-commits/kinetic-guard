import React from 'react';
import './ExerciseAnimation.css';

/* ─────────────────────────────────────────────
   Stick-figure animations — one per movement type
   viewBox: "0 0 160 200"
   Each <g class="fig"> is the full figure at rest;
   CSS keyframes move it through the motion loop.
───────────────────────────────────────────── */

const STROKE = { stroke: '#fff', strokeWidth: '5', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
const STROKE_DIM = { stroke: 'rgba(255,255,255,0.25)', strokeWidth: '5', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
const JOINT = { fill: '#FF6B00', stroke: 'none' };
const HEAD = { fill: 'none', stroke: '#fff', strokeWidth: '3.5' };

/* ── SQUAT ── */
const SquatAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim ex-anim--squat">
    {/* Floor */}
    <line x1="20" y1="195" x2="140" y2="195" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    {/* Figure group — animated up/down */}
    <g className="squat-body">
      {/* Head */}
      <circle cx="80" cy="28" r="14" {...HEAD}/>
      {/* Torso */}
      <line x1="80" y1="42" x2="80" y2="90" {...STROKE}/>
      {/* Left arm */}
      <line x1="80" y1="55" x2="52" y2="75" {...STROKE}/>
      <line x1="52" y1="75" x2="44" y2="95" {...STROKE}/>
      {/* Right arm */}
      <line x1="80" y1="55" x2="108" y2="75" {...STROKE}/>
      <line x1="108" y1="75" x2="116" y2="95" {...STROKE}/>
      {/* Left leg */}
      <line x1="72" y1="90" x2="60" y2="135" {...STROKE}/>
      <line x1="60" y1="135" x2="52" y2="175" {...STROKE}/>
      {/* Right leg */}
      <line x1="88" y1="90" x2="100" y2="135" {...STROKE}/>
      <line x1="100" y1="135" x2="108" y2="175" {...STROKE}/>
      {/* Joints */}
      <circle cx="80" cy="90" r="5" {...JOINT}/>
      <circle cx="60" cy="135" r="4" {...JOINT}/>
      <circle cx="100" cy="135" r="4" {...JOINT}/>
    </g>
    {/* Ghost figure at squat depth */}
    <g className="squat-ghost" opacity="0">
      <circle cx="80" cy="75" r="14" stroke="rgba(255,107,0,0.5)" strokeWidth="3" fill="none"/>
      <line x1="80" y1="89" x2="75" y2="130" stroke="rgba(255,107,0,0.5)" strokeWidth="4" strokeLinecap="round"/>
      <line x1="72" y1="130" x2="45" y2="145" stroke="rgba(255,107,0,0.5)" strokeWidth="4" strokeLinecap="round"/>
      <line x1="88" y1="130" x2="115" y2="145" stroke="rgba(255,107,0,0.5)" strokeWidth="4" strokeLinecap="round"/>
      <line x1="72" y1="130" x2="52" y2="175" stroke="rgba(255,107,0,0.5)" strokeWidth="4" strokeLinecap="round"/>
      <line x1="88" y1="130" x2="108" y2="175" stroke="rgba(255,107,0,0.5)" strokeWidth="4" strokeLinecap="round"/>
    </g>
    {/* Arrow */}
    <g className="squat-arrow">
      <line x1="136" y1="60" x2="136" y2="160" stroke="rgba(255,107,0,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
      <polygon points="130,158 136,172 142,158" fill="rgba(255,107,0,0.6)"/>
      <polygon points="130,62 136,48 142,62" fill="rgba(255,107,0,0.6)"/>
    </g>
  </svg>
);

/* ── PUSH-UP ── */
const PushUpAnim = () => (
  <svg viewBox="0 0 200 160" className="ex-anim ex-anim--pushup">
    <line x1="10" y1="135" x2="190" y2="135" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="pushup-body">
      {/* Head */}
      <circle cx="30" cy="65" r="13" {...HEAD}/>
      {/* Torso */}
      <line x1="43" y1="68" x2="130" y2="100" {...STROKE}/>
      {/* Upper arm */}
      <line x1="55" y1="72" x2="55" y2="112" {...STROKE}/>
      {/* Forearm */}
      <line x1="55" y1="112" x2="45" y2="135" {...STROKE}/>
      {/* Second arm */}
      <line x1="100" y1="85" x2="100" y2="125" {...STROKE}/>
      <line x1="100" y1="125" x2="90" y2="135" {...STROKE}/>
      {/* Legs */}
      <line x1="130" y1="100" x2="160" y2="112" {...STROKE}/>
      <line x1="160" y1="112" x2="178" y2="135" {...STROKE}/>
      {/* Joints */}
      <circle cx="55" cy="112" r="5" {...JOINT}/>
      <circle cx="100" cy="125" r="5" {...JOINT}/>
    </g>
    {/* Vertical arrow showing up/down */}
    <g className="pushup-arrow">
      <line x1="25" y1="90" x2="25" y2="130" stroke="rgba(255,107,0,0.5)" strokeWidth="2" strokeDasharray="3 3"/>
      <polygon points="20,92 25,80 30,92" fill="rgba(255,107,0,0.7)"/>
    </g>
  </svg>
);

/* ── GLUTE BRIDGE ── */
const GluteBridgeAnim = () => (
  <svg viewBox="0 0 200 160" className="ex-anim ex-anim--bridge">
    <line x1="10" y1="145" x2="190" y2="145" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="bridge-hips">
      {/* Head on floor */}
      <circle cx="28" cy="112" r="13" {...HEAD}/>
      {/* Upper body flat */}
      <line x1="40" y1="108" x2="100" y2="100" {...STROKE}/>
      {/* Arms on ground */}
      <line x1="55" y1="103" x2="50" y2="140" {...STROKE}/>
      <line x1="75" y1="101" x2="70" y2="140" {...STROKE}/>
      {/* Hips (animated up/down) */}
      <circle cx="108" cy="92" r="6" {...JOINT}/>
      {/* Left upper leg */}
      <line x1="108" y1="92" x2="128" y2="120" {...STROKE}/>
      {/* Left shin */}
      <line x1="128" y1="120" x2="130" y2="145" {...STROKE}/>
      {/* Right upper leg */}
      <line x1="108" y1="92" x2="148" y2="115" {...STROKE}/>
      {/* Right shin */}
      <line x1="148" y1="115" x2="155" y2="145" {...STROKE}/>
      {/* Knee joints */}
      <circle cx="128" cy="120" r="4" {...JOINT}/>
      <circle cx="148" cy="115" r="4" {...JOINT}/>
    </g>
    {/* Arrow up */}
    <g className="bridge-arrow">
      <line x1="108" y1="50" x2="108" y2="85" stroke="rgba(255,107,0,0.5)" strokeWidth="2" strokeDasharray="3 3"/>
      <polygon points="102,52 108,38 114,52" fill="rgba(255,107,0,0.7)"/>
    </g>
  </svg>
);

/* ── PLANK ── */
const PlankAnim = () => (
  <svg viewBox="0 0 220 140" className="ex-anim ex-anim--plank">
    <line x1="10" y1="120" x2="210" y2="120" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="plank-body">
      <circle cx="30" cy="75" r="13" {...HEAD}/>
      {/* Straight body line */}
      <line x1="43" y1="78" x2="180" y2="95" {...STROKE}/>
      {/* Left arm */}
      <line x1="65" y1="83" x2="62" y2="108" {...STROKE}/>
      <line x1="62" y1="108" x2="52" y2="120" {...STROKE}/>
      {/* Right arm */}
      <line x1="100" y1="87" x2="97" y2="112" {...STROKE}/>
      <line x1="97" y1="112" x2="87" y2="120" {...STROKE}/>
      {/* Leg */}
      <line x1="180" y1="95" x2="195" y2="120" {...STROKE}/>
      {/* Elbow joints */}
      <circle cx="62" cy="108" r="5" {...JOINT}/>
      <circle cx="97" cy="112" r="5" {...JOINT}/>
    </g>
    {/* Core pulse effect */}
    <circle cx="130" cy="89" r="0" className="plank-pulse" fill="rgba(255,107,0,0.2)"/>
    {/* Label */}
    <text x="110" y="135" textAnchor="middle" fontSize="10" fill="rgba(255,107,0,0.7)" fontFamily="Montserrat" fontWeight="700">HOLD</text>
  </svg>
);

/* ── HIP HINGE (Deadlift / RDL) ── */
const HingeAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim ex-anim--hinge">
    <line x1="20" y1="195" x2="140" y2="195" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="hinge-body">
      <circle cx="80" cy="28" r="14" {...HEAD}/>
      <line x1="80" y1="42" x2="80" y2="100" {...STROKE}/>
      {/* Arms hanging */}
      <line x1="80" y1="55" x2="55" y2="72" {...STROKE}/>
      <line x1="55" y1="72" x2="50" y2="95" {...STROKE}/>
      <line x1="80" y1="55" x2="105" y2="72" {...STROKE}/>
      <line x1="105" y1="72" x2="110" y2="95" {...STROKE}/>
      {/* Legs nearly straight */}
      <line x1="72" y1="100" x2="65" y2="148" {...STROKE}/>
      <line x1="65" y1="148" x2="55" y2="195" {...STROKE}/>
      <line x1="88" y1="100" x2="95" y2="148" {...STROKE}/>
      <line x1="95" y1="148" x2="105" y2="195" {...STROKE}/>
      {/* Joints */}
      <circle cx="80" cy="100" r="5" {...JOINT}/>
      <circle cx="65" cy="148" r="4" {...JOINT}/>
      <circle cx="95" cy="148" r="4" {...JOINT}/>
    </g>
    {/* Hip hinge arrow */}
    <g className="hinge-arrow">
      <path d="M 112 90 Q 130 60 112 40" stroke="rgba(255,107,0,0.5)" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
      <polygon points="107,43 116,33 118,46" fill="rgba(255,107,0,0.7)"/>
    </g>
  </svg>
);

/* ── ROW ── */
const RowAnim = () => (
  <svg viewBox="0 0 200 180" className="ex-anim ex-anim--row">
    <line x1="10" y1="155" x2="190" y2="155" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="row-body">
      <circle cx="35" cy="68" r="13" {...HEAD}/>
      {/* Torso hinged forward */}
      <line x1="44" y1="74" x2="110" y2="100" {...STROKE}/>
      {/* Support arm */}
      <line x1="65" y1="82" x2="60" y2="120" {...STROKE}/>
      <line x1="60" y1="120" x2="45" y2="155" {...STROKE}/>
      {/* Pulling arm */}
      <line x1="82" y1="89" x2="82" y2="120" {...STROKE} className="row-arm"/>
      <line x1="82" y1="120" x2="68" y2="135" {...STROKE} className="row-forearm"/>
      {/* Legs */}
      <line x1="110" y1="100" x2="125" y2="130" {...STROKE}/>
      <line x1="125" y1="130" x2="130" y2="155" {...STROKE}/>
      <line x1="110" y1="100" x2="150" y2="118" {...STROKE}/>
      <line x1="150" y1="118" x2="158" y2="155" {...STROKE}/>
      {/* Knee joints */}
      <circle cx="125" cy="130" r="4" {...JOINT}/>
      <circle cx="150" cy="118" r="4" {...JOINT}/>
      <circle cx="82" cy="120" r="5" {...JOINT}/>
    </g>
    {/* Pull arrow */}
    <g className="row-arrow">
      <line x1="82" y1="100" x2="82" y2="60" stroke="rgba(255,107,0,0.5)" strokeWidth="2" strokeDasharray="3 3"/>
      <polygon points="76,62 82,48 88,62" fill="rgba(255,107,0,0.7)"/>
    </g>
  </svg>
);

/* ── PULL-UP ── */
const PullUpAnim = () => (
  <svg viewBox="0 0 160 240" className="ex-anim ex-anim--pullup">
    {/* Bar */}
    <line x1="20" y1="20" x2="140" y2="20" stroke="#666" strokeWidth="6" strokeLinecap="round"/>
    <line x1="20" y1="10" x2="20" y2="30" stroke="#555" strokeWidth="3"/>
    <line x1="140" y1="10" x2="140" y2="30" stroke="#555" strokeWidth="3"/>
    <g className="pullup-body">
      {/* Hands on bar */}
      <circle cx="52" cy="22" r="5" fill="#FF6B00"/>
      <circle cx="108" cy="22" r="5" fill="#FF6B00"/>
      {/* Arms */}
      <line x1="52" y1="22" x2="58" y2="55" {...STROKE}/>
      <line x1="108" y1="22" x2="102" y2="55" {...STROKE}/>
      {/* Head */}
      <circle cx="80" cy="65" r="14" {...HEAD}/>
      {/* Torso */}
      <line x1="80" y1="79" x2="80" y2="130" {...STROKE}/>
      {/* Shoulder connects */}
      <line x1="58" y1="55" x2="80" y2="72" {...STROKE}/>
      <line x1="102" y1="55" x2="80" y2="72" {...STROKE}/>
      {/* Legs */}
      <line x1="72" y1="130" x2="68" y2="175" {...STROKE}/>
      <line x1="68" y1="175" x2="64" y2="215" {...STROKE}/>
      <line x1="88" y1="130" x2="92" y2="175" {...STROKE}/>
      <line x1="92" y1="175" x2="96" y2="215" {...STROKE}/>
      {/* Elbow joints */}
      <circle cx="58" cy="55" r="5" {...JOINT}/>
      <circle cx="102" cy="55" r="5" {...JOINT}/>
    </g>
    {/* Up arrow */}
    <g className="pullup-arrow">
      <line x1="142" y1="80" x2="142" y2="40" stroke="rgba(255,107,0,0.5)" strokeWidth="2" strokeDasharray="3 3"/>
      <polygon points="136,42 142,28 148,42" fill="rgba(255,107,0,0.7)"/>
    </g>
  </svg>
);

/* ── OVERHEAD PRESS ── */
const PressAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim ex-anim--press">
    <line x1="20" y1="195" x2="140" y2="195" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="press-body">
      <circle cx="80" cy="28" r="14" {...HEAD}/>
      <line x1="80" y1="42" x2="80" y2="100" {...STROKE}/>
      {/* Arms at shoulder height (resting) */}
      <line x1="80" y1="55" x2="45" y2="60" {...STROKE} className="press-upper-l"/>
      <line x1="45" y1="60" x2="38" y2="45" {...STROKE} className="press-lower-l"/>
      <line x1="80" y1="55" x2="115" y2="60" {...STROKE} className="press-upper-r"/>
      <line x1="115" y1="60" x2="122" y2="45" {...STROKE} className="press-lower-r"/>
      {/* Barbell */}
      <line x1="22" y1="43" x2="138" y2="43" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" className="press-bar"/>
      <circle cx="22" cy="43" r="6" fill="#FF6B00" opacity="0.7"/>
      <circle cx="138" cy="43" r="6" fill="#FF6B00" opacity="0.7"/>
      {/* Legs */}
      <line x1="72" y1="100" x2="65" y2="148" {...STROKE}/>
      <line x1="65" y1="148" x2="58" y2="195" {...STROKE}/>
      <line x1="88" y1="100" x2="95" y2="148" {...STROKE}/>
      <line x1="95" y1="148" x2="102" y2="195" {...STROKE}/>
      <circle cx="80" cy="100" r="5" {...JOINT}/>
      <circle cx="65" cy="148" r="4" {...JOINT}/>
      <circle cx="95" cy="148" r="4" {...JOINT}/>
    </g>
    {/* Arrow up */}
    <g className="press-arrow">
      <line x1="144" y1="40" x2="144" y2="10" stroke="rgba(255,107,0,0.5)" strokeWidth="2" strokeDasharray="3 3"/>
      <polygon points="138,12 144,-2 150,12" fill="rgba(255,107,0,0.7)"/>
    </g>
  </svg>
);

/* ── WALL PUSH-UP ── */
const WallPushUpAnim = () => (
  <svg viewBox="0 0 180 220" className="ex-anim ex-anim--wallpushup">
    {/* Wall */}
    <line x1="150" y1="10" x2="150" y2="210" stroke="#333" strokeWidth="8" strokeLinecap="round"/>
    <line x1="150" y1="195" x2="10" y2="195" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="wallpushup-body">
      <circle cx="52" cy="55" r="14" {...HEAD}/>
      <line x1="52" y1="69" x2="52" y2="118" {...STROKE}/>
      {/* Arms toward wall */}
      <line x1="52" y1="80" x2="100" y2="72" {...STROKE} className="wpu-upper-l"/>
      <line x1="100" y1="72" x2="140" y2="75" {...STROKE} className="wpu-lower-l"/>
      <line x1="52" y1="80" x2="100" y2="95" {...STROKE} className="wpu-upper-r"/>
      <line x1="100" y1="95" x2="140" y2="95" {...STROKE} className="wpu-lower-r"/>
      {/* Hand dots on wall */}
      <circle cx="140" cy="75" r="5" fill="#FF6B00"/>
      <circle cx="140" cy="95" r="5" fill="#FF6B00"/>
      {/* Legs */}
      <line x1="44" y1="118" x2="36" y2="165" {...STROKE}/>
      <line x1="36" y1="165" x2="30" y2="195" {...STROKE}/>
      <line x1="60" y1="118" x2="68" y2="165" {...STROKE}/>
      <line x1="68" y1="165" x2="72" y2="195" {...STROKE}/>
      <circle cx="44" cy="118" r="5" {...JOINT}/>
      <circle cx="60" cy="118" r="5" {...JOINT}/>
    </g>
    {/* Arrow */}
    <g className="wpu-arrow">
      <line x1="105" y1="55" x2="135" y2="55" stroke="rgba(255,107,0,0.5)" strokeWidth="2" strokeDasharray="3 3"/>
      <polygon points="133,49 147,55 133,61" fill="rgba(255,107,0,0.7)"/>
    </g>
  </svg>
);

/* ── DEAD BUG ── */
const DeadBugAnim = () => (
  <svg viewBox="0 0 220 160" className="ex-anim ex-anim--deadbug">
    <line x1="10" y1="135" x2="210" y2="135" stroke="rgba(255,107,0,0.3)" strokeWidth="2"/>
    <g className="deadbug-body">
      {/* Body on floor */}
      <circle cx="110" cy="90" r="13" {...HEAD}/>
      <line x1="110" y1="103" x2="110" y2="128" {...STROKE}/>
      {/* Left arm up */}
      <line x1="110" y1="108" x2="72" y2="95" {...STROKE} className="db-arm-l"/>
      <line x1="72" y1="95" x2="52" y2="75" {...STROKE} className="db-forearm-l"/>
      {/* Right arm */}
      <line x1="110" y1="108" x2="148" y2="100" {...STROKE} className="db-arm-r"/>
      <line x1="148" y1="100" x2="165" y2="115" {...STROKE} className="db-forearm-r"/>
      {/* Left leg up */}
      <line x1="105" y1="128" x2="82" y2="108" {...STROKE} className="db-leg-l"/>
      <line x1="82" y1="108" x2="60" y2="90" {...STROKE} className="db-shin-l"/>
      {/* Right leg */}
      <line x1="115" y1="128" x2="140" y2="128" {...STROKE} className="db-leg-r"/>
      <line x1="140" y1="128" x2="168" y2="135" {...STROKE} className="db-shin-r"/>
      {/* Joints */}
      <circle cx="72" cy="95" r="4" {...JOINT}/>
      <circle cx="148" cy="100" r="4" {...JOINT}/>
      <circle cx="82" cy="108" r="4" {...JOINT}/>
      <circle cx="140" cy="128" r="4" {...JOINT}/>
    </g>
  </svg>
);

/* ── MAP: exercise name → animation component ── */
const ANIMATION_MAP = {
  // Squats
  'bodyweight squat': SquatAnim,
  'goblet squat': SquatAnim,
  'barbell back squat': SquatAnim,
  'قرفصاء بوزن الجسم': SquatAnim,
  'قرفصاء الكأس': SquatAnim,
  'قرفصاء بالبار': SquatAnim,
  // Push-ups
  'push-up': PushUpAnim,
  'bench press': PushUpAnim,
  'ضغط البنش': PushUpAnim,
  'تمرين الضغط': PushUpAnim,
  // Wall push-up
  'wall push-up': WallPushUpAnim,
  'تمرين الضغط على الجدار': WallPushUpAnim,
  // Glute bridge
  'glute bridge': GluteBridgeAnim,
  'جسر الأرداف': GluteBridgeAnim,
  // Dead bug
  'dead bug': DeadBugAnim,
  'الدودة الميتة': DeadBugAnim,
  // Plank
  'plank': PlankAnim,
  'بلانك': PlankAnim,
  // Hinge
  'romanian deadlift': HingeAnim,
  'deadlift': HingeAnim,
  'رفع أرومانية': HingeAnim,
  'رفع ميت': HingeAnim,
  // Row
  'dumbbell row': RowAnim,
  'تجديف بالدمبل': RowAnim,
  // Pull-up
  'pull-up': PullUpAnim,
  'سحب علوي': PullUpAnim,
  // Press
  'overhead press': PressAnim,
  'ضغط فوق الرأس': PressAnim,
};

const ExerciseAnimation = ({ exerciseName }) => {
  const key = (exerciseName || '').toLowerCase();
  const Anim = ANIMATION_MAP[key] || SquatAnim;
  return (
    <div className="ex-anim-wrap">
      <Anim />
    </div>
  );
};

export default ExerciseAnimation;
