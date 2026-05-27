import React from 'react';
import './ExerciseAnimation.css';

/*
  Clean Sport character animations.
  Every limb is a stroked line running joint-to-joint — no fills.
  Arms originate FROM the spine. Legs FROM the hip joint.
  White spine, dimmer arms, orange active muscles, orange joint dots.
  3-frame crossfade via CSS .fr1 / .fr2 / .fr3.
*/

// ── Design tokens ─────────────────────────────────────────────────────────────
const W  = 'rgba(255,255,255,0.92)';  // spine / torso
const WM = 'rgba(255,255,255,0.58)';  // upper arms / inactive limbs
const WL = 'rgba(255,255,255,0.35)';  // forearms / feet / passive
const A  = '#FF6B00';                  // active muscle
const B  = WM;                         // alias kept for any leftover refs

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Stroked line limb between two joints */
const L = (x1, y1, x2, y2, w, c) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2}
    stroke={c} strokeWidth={w} strokeLinecap="round" />
);

/** No-op — shadows removed in this style */
const Sh = () => null;

/** Outlined head circle */
const Hd = (cx, cy, r = 12) => (
  <circle cx={cx} cy={cy} r={r} fill="none" stroke={W} strokeWidth="2.5" />
);

/** Joint dot — orange fill when active, white ring when inactive */
const Jt = (cx, cy, r = 5, c = A) => (
  c === A
    ? <circle cx={cx} cy={cy} r={r} fill={A} />
    : <circle cx={cx} cy={cy} r={r} fill="none" stroke={WM} strokeWidth="1.5" />
);

/** Floor baseline */
const Fl = (y, x2 = 144) => (
  <line x1="16" y1={y} x2={x2} y2={y}
    stroke="rgba(255,107,0,0.22)" strokeWidth="2" />
);

/** Dashed arrow pointing downward (squat/press direction) */
const ArrDn = (x, y1, y2) => (
  <g className="arrow-pulse" opacity="0.5">
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={A} strokeWidth="1.5" strokeDasharray="4 3" />
    <polygon points={`${x-5},${y2-8} ${x},${y2+4} ${x+5},${y2-8}`} fill={A} />
    <polygon points={`${x-5},${y1+8} ${x},${y1-4} ${x+5},${y1+8}`} fill={A} />
  </g>
);

/** Dashed arrow pointing upward */
const ArrUp = (x, y1, y2) => (
  <g className="arrow-pulse" opacity="0.5">
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={A} strokeWidth="1.5" strokeDasharray="4 3" />
    <polygon points={`${x-5},${y2+8} ${x},${y2-4} ${x+5},${y2+8}`} fill={A} />
  </g>
);

/* ══════════════════════════════════════════════════════════════════════════════
   SQUAT — active: quads + glutes
   viewBox 0 0 160 220 · floor y=194
   Frames: standing → half squat → deep squat
══════════════════════════════════════════════════════════════════════════════ */
const SquatAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim">
    {Fl(194)}
    {ArrDn(148, 50, 170)}

    {/* ── Frame 1: standing ── */}
    <g className="fr1">
      {Hd(80, 20)}
      {L(80,32,  80,96,  8, W)}      {/* spine */}
      {L(80,50,  57,78,  7, WM)}     {/* L upper arm */}
      {L(57,78,  50,96,  5, WL)}     {/* L forearm */}
      {L(80,50, 103,78,  7, WM)}     {/* R upper arm */}
      {L(103,78,110,96,  5, WL)}     {/* R forearm */}
      {L(80,96,  72,148, 8, A)}      {/* L thigh */}
      {L(80,96,  88,148, 8, A)}      {/* R thigh */}
      {L(72,148, 70,188, 7, A)}      {/* L shin */}
      {L(88,148, 90,188, 7, A)}      {/* R shin */}
      {L(70,188, 52,192, 5, WL)}     {/* L foot */}
      {L(90,188,108,192, 5, WL)}     {/* R foot */}
      {Jt(80,50,  4, WM)}            {/* shoulder */}
      {Jt(80,96,  5)}                {/* hip */}
      {Jt(72,148, 6)}                {/* L knee */}
      {Jt(88,148, 6)}                {/* R knee */}
    </g>

    {/* ── Frame 2: half squat ── */}
    <g className="fr2">
      {Hd(80, 16)}
      {L(80,28,  80,94,  8, W)}
      {L(80,46,  46,66,  7, WM)}
      {L(46,66,  30,74,  5, WL)}
      {L(80,46, 114,66,  7, WM)}
      {L(114,66,130,74,  5, WL)}
      {L(80,94,  46,142, 8, A)}
      {L(80,94, 114,142, 8, A)}
      {L(46,142, 44,186, 7, A)}
      {L(114,142,116,186, 7, A)}
      {L(44,186, 26,190, 5, WL)}
      {L(116,186,134,190, 5, WL)}
      {Jt(80,46,  4, WM)}
      {Jt(80,94,  6)}
      {Jt(46,142, 6)}
      {Jt(114,142,6)}
    </g>

    {/* ── Frame 3: deep squat ── */}
    <g className="fr3">
      {Hd(80, 12)}
      {L(80,24,  79,88,  8, W)}
      {L(79,44,  36,60,  7, WM)}
      {L(36,60,  22,68,  5, WL)}
      {L(79,44, 122,60,  7, WM)}
      {L(122,60,136,68,  5, WL)}
      {L(79,88,  32,130, 8, A)}
      {L(79,88, 126,130, 8, A)}
      {L(32,130, 30,180, 7, A)}
      {L(126,130,128,180, 7, A)}
      {L(30,180, 12,184, 5, WL)}
      {L(128,180,146,184, 5, WL)}
      {Jt(79,44,  4, WM)}
      {Jt(79,88,  7)}
      {Jt(32,130, 6)}
      {Jt(126,130,6)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   PUSH-UP — active: chest, triceps, shoulders
   viewBox 0 0 230 148 · floor y=126
   Frames: top (arms extended) → mid → bottom
══════════════════════════════════════════════════════════════════════════════ */
const PushUpAnim = () => (
  <svg viewBox="0 0 230 148" className="ex-anim">
    {Fl(126, 220)}
    {ArrDn(18, 78, 116)}

    {/* ── Frame 1: top ── */}
    <g className="fr1">
      {Hd(24,60,12)}
      {L(36,66, 178,96,  8, W)}      {/* body */}
      {L(64,74,  62,108, 7, A)}      {/* L upper arm */}
      {L(62,108, 50,124, 5, A)}      {/* L forearm */}
      {L(108,84,106,118, 7, A)}      {/* R upper arm */}
      {L(106,118,94,124, 5, A)}      {/* R forearm */}
      {L(178,96, 194,108, 7, WM)}    {/* back upper leg */}
      {L(194,108,210,124, 6, WL)}    {/* back lower leg */}
      {Jt(62,108,  5)}
      {Jt(106,118, 5)}
      {Jt(194,108, 4, WM)}
    </g>

    {/* ── Frame 2: mid ── */}
    <g className="fr2">
      {Hd(24,64,12)}
      {L(36,70, 178,100, 8, W)}
      {L(64,78,  58,110, 7, A)}
      {L(58,110, 46,124, 5, A)}
      {L(108,88,102,120, 7, A)}
      {L(102,120,90,124, 5, A)}
      {L(178,100,194,112, 7, WM)}
      {L(194,112,210,124, 6, WL)}
      {Jt(58,110,  5)}
      {Jt(102,120, 5)}
      {Jt(194,112, 4, WM)}
    </g>

    {/* ── Frame 3: bottom ── */}
    <g className="fr3">
      {Hd(24,68,12)}
      {L(36,76, 178,106, 8, W)}
      {L(64,84,  54,112, 7, A)}
      {L(54,112, 42,124, 5, A)}
      {L(108,94, 96,124, 7, A)}
      {L(96,124, 84,124, 5, A)}
      {L(178,106,194,116, 7, WM)}
      {L(194,116,210,124, 6, WL)}
      {Jt(54,112, 5)}
      {Jt(96,124, 5)}
      {Jt(194,116,4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   GLUTE BRIDGE — active: glutes, hamstrings
   viewBox 0 0 230 158 · floor y=142
   Frames: flat → mid-rise → full bridge
══════════════════════════════════════════════════════════════════════════════ */
const GluteBridgeAnim = () => (
  <svg viewBox="0 0 230 158" className="ex-anim">
    {Fl(142, 220)}
    {ArrUp(110, 44, 80)}

    {/* ── Frame 1: flat ── */}
    <g className="fr1">
      {Hd(26,112,12)}
      {L(38,108, 112,104, 8, W)}     {/* torso */}
      {L(50,108,  50,134, 6, WM)}    {/* L upper arm down */}
      {L(50,134,  40,142, 5, WL)}    {/* L forearm */}
      {L(66,106,  68,134, 6, WM)}    {/* R upper arm */}
      {L(68,134,  78,142, 5, WL)}    {/* R forearm */}
      {L(112,104, 130,120, 7, WM)}   {/* L thigh */}
      {L(130,120, 132,142, 6, WM)}   {/* L shin */}
      {L(112,104, 156,118, 7, WM)}   {/* R thigh */}
      {L(156,118, 158,142, 6, WM)}   {/* R shin */}
      {Jt(112,104, 5, WM)}
      {Jt(130,120, 4, WM)}
      {Jt(156,118, 4, WM)}
    </g>

    {/* ── Frame 2: mid-rise ── */}
    <g className="fr2">
      {Hd(26,112,12)}
      {L(38,108, 108,86,  8, W)}
      {L(50,108,  50,134, 6, WM)}
      {L(50,134,  40,142, 5, WL)}
      {L(66,108,  68,134, 6, WM)}
      {L(68,134,  78,142, 5, WL)}
      {L(108,86,  130,120, 7, A)}
      {L(130,120, 132,142, 6, A)}
      {L(108,86,  156,118, 7, A)}
      {L(156,118, 158,142, 6, A)}
      {Jt(108,86,  6)}
      {Jt(130,120, 5)}
      {Jt(156,118, 5)}
    </g>

    {/* ── Frame 3: full bridge ── */}
    <g className="fr3">
      {Hd(26,112,12)}
      {L(38,108, 106,72,  8, W)}
      {L(50,108,  50,134, 6, WM)}
      {L(50,134,  40,142, 5, WL)}
      {L(66,108,  68,134, 6, WM)}
      {L(68,134,  78,142, 5, WL)}
      {L(106,72,  130,120, 7, A)}
      {L(130,120, 132,142, 6, A)}
      {L(106,72,  156,118, 7, A)}
      {L(156,118, 158,142, 6, A)}
      {Jt(106,72,  8)}
      {Jt(130,120, 5)}
      {Jt(156,118, 5)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   PLANK — active: core (static hold)
   viewBox 0 0 230 138 · floor y=118
══════════════════════════════════════════════════════════════════════════════ */
const PlankAnim = () => (
  <svg viewBox="0 0 230 138" className="ex-anim">
    {Fl(118, 222)}

    <g>
      {Hd(26,72,12)}
      {L(38,78,  180,96,  8, W)}     {/* body */}
      {L(62,84,   58,106, 7, A)}     {/* L upper arm */}
      {L(58,106,  48,118, 5, A)}     {/* L forearm on floor */}
      {L(98,90,   94,112, 7, A)}     {/* R upper arm */}
      {L(94,112,  82,118, 5, A)}     {/* R forearm */}
      {L(180,96,  198,108, 7, WM)}   {/* back leg upper */}
      {L(198,108, 212,118, 6, WL)}   {/* back leg lower */}
      {Jt(58,106, 5)}
      {Jt(94,112, 5)}
      {Jt(198,108,4, WM)}
    </g>

    {/* Core pulse ring */}
    <circle cx="124" cy="88" r="0" className="plank-pulse"
      fill="none" stroke={A} strokeWidth="3" />

    <text x="114" y="132" textAnchor="middle" fontSize="9"
      fill="rgba(255,107,0,0.7)" fontFamily="Montserrat,sans-serif"
      fontWeight="800" letterSpacing="2">HOLD</text>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   HIP HINGE (Romanian Deadlift / Deadlift) — active: back, hamstrings, glutes
   viewBox 0 0 160 220 · floor y=194
   Frames: standing → 40° hinge → full hinge (~75°)
══════════════════════════════════════════════════════════════════════════════ */
const HingeAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim">
    {Fl(194)}
    {ArrUp(148, 80, 30)}

    {/* ── Frame 1: standing ── */}
    <g className="fr1">
      {Hd(80, 20)}
      {L(80,32,  80,98,  8, A)}      {/* spine = active back */}
      {L(80,52,  70,80,  6, WM)}     {/* L upper arm (bar grip) */}
      {L(70,80,  66,104, 5, WL)}     {/* L forearm */}
      {L(80,52,  90,80,  6, WM)}     {/* R upper arm */}
      {L(90,80,  94,104, 5, WL)}     {/* R forearm */}
      {L(80,98,  73,148, 8, A)}      {/* L thigh */}
      {L(80,98,  87,148, 8, A)}      {/* R thigh */}
      {L(73,148, 70,188, 7, WM)}     {/* L shin */}
      {L(87,148, 90,188, 7, WM)}     {/* R shin */}
      {L(70,188, 52,192, 5, WL)}
      {L(90,188,108,192, 5, WL)}
      {Jt(80,52,  4, WM)}
      {Jt(80,98,  6)}
      {Jt(73,148, 5, WM)}
      {Jt(87,148, 5, WM)}
    </g>

    {/* ── Frame 2: 40° hinge ── */}
    <g className="fr2">
      {Hd(42, 42)}
      {L(80,100, 42,46,  8, A)}      {/* spine hinged forward */}
      {L(42,60,  38,90,  6, WM)}     {/* L arm hanging */}
      {L(38,90,  36,108, 5, WL)}
      {L(54,64,  52,94,  6, WM)}     {/* R arm hanging */}
      {L(52,94,  54,112, 5, WL)}
      {L(80,100, 73,150, 8, A)}      {/* L thigh */}
      {L(80,100, 87,150, 8, A)}      {/* R thigh */}
      {L(73,150, 70,190, 7, WM)}
      {L(87,150, 90,190, 7, WM)}
      {L(70,190, 52,194, 5, WL)}
      {L(90,190,108,194, 5, WL)}
      {Jt(80,100, 7)}
      {Jt(73,150, 4, WM)}
      {Jt(87,150, 4, WM)}
    </g>

    {/* ── Frame 3: full hinge (~75°) ── */}
    <g className="fr3">
      {Hd(14, 74)}
      {L(80,100, 14,78,  8, A)}      {/* spine nearly horizontal */}
      {L(14,82,  18,110, 6, WM)}
      {L(18,110, 22,124, 5, WL)}
      {L(26,84,  30,112, 6, WM)}
      {L(30,112, 34,126, 5, WL)}
      {L(80,100, 73,150, 8, A)}
      {L(80,100, 87,150, 8, A)}
      {L(73,150, 70,190, 7, WM)}
      {L(87,150, 90,190, 7, WM)}
      {L(70,190, 52,194, 5, WL)}
      {L(90,190,108,194, 5, WL)}
      {Jt(80,100, 8)}
      {Jt(73,150, 4, WM)}
      {Jt(87,150, 4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   DUMBBELL ROW — active: back (lats), bicep
   viewBox 0 0 210 182 · floor y=156
   Frames: arm extended down → mid pull → full pull
══════════════════════════════════════════════════════════════════════════════ */
const RowAnim = () => (
  <svg viewBox="0 0 210 182" className="ex-anim">
    {Fl(156, 202)}

    {/* ── Frame 1: arm down ── */}
    <g className="fr1">
      {Hd(32,64,12)}
      {L(44,70,  118,98,  8, W)}     {/* torso hinged */}
      {L(64,78,   58,118, 6, WM)}    {/* support arm (right, on surface) */}
      {L(58,118,  50,156, 5, WM)}
      {L(118,90,  80,134, 7, A)}     {/* pulling arm upper */}
      {L(80,134,  68,152, 5, A)}     {/* pulling arm lower */}
      <circle cx="64" cy="154" r="7" fill={A} opacity="0.9"/>
      <line x1="56" y1="154" x2="72" y2="154" stroke={A} strokeWidth="4" strokeLinecap="round"/>
      {L(118,98,  134,130, 7, WM)}   {/* back leg upper */}
      {L(134,130, 136,156, 6, WM)}
      {L(118,98,  150,120, 7, WM)}   {/* back leg lower */}
      {L(150,120, 154,156, 6, WM)}
      {Jt(80,134, 5)}
      {Jt(134,130,4, WM)}
      {Jt(150,120,4, WM)}
    </g>

    {/* ── Frame 2: mid pull ── */}
    <g className="fr2">
      {Hd(32,64,12)}
      {L(44,70,  118,98,  8, W)}
      {L(64,78,   58,118, 6, WM)}
      {L(58,118,  50,156, 5, WM)}
      {L(118,90,  82,112, 7, A)}
      {L(82,112,  66,128, 5, A)}
      <circle cx="60" cy="130" r="7" fill={A} opacity="0.9"/>
      <line x1="52" y1="130" x2="68" y2="130" stroke={A} strokeWidth="4" strokeLinecap="round"/>
      {L(118,98,  134,130, 7, WM)}
      {L(134,130, 136,156, 6, WM)}
      {L(118,98,  150,120, 7, WM)}
      {L(150,120, 154,156, 6, WM)}
      {Jt(82,112, 5)}
      {Jt(134,130,4, WM)}
    </g>

    {/* ── Frame 3: full pull ── */}
    <g className="fr3">
      {Hd(32,64,12)}
      {L(44,70,  118,98,  8, W)}
      {L(64,78,   58,118, 6, WM)}
      {L(58,118,  50,156, 5, WM)}
      {L(118,90,  84,72,  7, A)}
      {L(84,72,   70,56,  5, A)}
      <circle cx="64" cy="52" r="7" fill={A} opacity="0.9"/>
      <line x1="56" y1="52" x2="72" y2="52" stroke={A} strokeWidth="4" strokeLinecap="round"/>
      {L(118,98,  134,130, 7, WM)}
      {L(134,130, 136,156, 6, WM)}
      {L(118,98,  150,120, 7, WM)}
      {L(150,120, 154,156, 6, WM)}
      {Jt(84,72,  5)}
      {Jt(134,130,4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   PULL-UP — active: lats, biceps
   viewBox 0 0 160 250
   Frames: hanging → halfway → chin over bar
══════════════════════════════════════════════════════════════════════════════ */
const PullUpAnim = () => (
  <svg viewBox="0 0 160 250" className="ex-anim">
    {/* Bar */}
    <rect x="12" y="14" width="136" height="10" rx="5" fill="rgba(255,255,255,0.22)"/>
    <line x1="22" y1="8" x2="22" y2="24" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round"/>
    <line x1="138" y1="8" x2="138" y2="24" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round"/>
    {ArrUp(148, 90, 32)}

    {/* ── Frame 1: hanging (arms straight) ── */}
    <g className="fr1">
      {Jt(50, 20, 6)}                {/* L hand on bar */}
      {Jt(110,20, 6)}                {/* R hand on bar */}
      {L(50,20,  58,66,  7, A)}      {/* L arm */}
      {L(110,20,102,66,  7, A)}      {/* R arm */}
      {Hd(80,90, 12)}
      {L(80,78,  80,168, 8, W)}      {/* spine */}
      {L(80,98,  62,130, 6, WM)}     {/* L upper leg */}
      {L(62,130, 60,170, 5, WM)}
      {L(60,170, 58,208, 5, WL)}
      {L(80,98,  98,130, 6, WM)}
      {L(98,130,100,170, 5, WM)}
      {L(100,170,102,208,5, WL)}
      {Jt(58,66, 5)}
      {Jt(102,66,5)}
      {Jt(62,130,4, WM)}
      {Jt(98,130,4, WM)}
    </g>

    {/* ── Frame 2: halfway ── */}
    <g className="fr2">
      {Jt(50, 20, 6)}
      {Jt(110,20, 6)}
      {L(50,20,  60,54,  7, A)}
      {L(60,54,  68,72,  6, A)}      {/* forearm bends */}
      {L(110,20,100,54,  7, A)}
      {L(100,54, 92,72,  6, A)}
      {Hd(80,80, 12)}
      {L(80,68,  80,154, 8, W)}
      {L(80,88,  62,120, 6, WM)}
      {L(62,120, 60,162, 5, WM)}
      {L(60,162, 58,200, 5, WL)}
      {L(80,88,  98,120, 6, WM)}
      {L(98,120,100,162, 5, WM)}
      {L(100,162,102,200,5, WL)}
      {Jt(60,54, 5)}
      {Jt(100,54,5)}
      {Jt(62,120,4, WM)}
      {Jt(98,120,4, WM)}
    </g>

    {/* ── Frame 3: chin over bar ── */}
    <g className="fr3">
      {Jt(50, 20, 6)}
      {Jt(110,20, 6)}
      {L(50,20,  64,44,  7, A)}
      {L(64,44,  72,62,  6, A)}
      {L(110,20, 96,44,  7, A)}
      {L(96,44,  88,62,  6, A)}
      {Hd(80,68, 12)}
      {L(80,56,  80,140, 8, W)}
      {L(80,78,  62,112, 6, WM)}
      {L(62,112, 60,154, 5, WM)}
      {L(60,154, 58,192, 5, WL)}
      {L(80,78,  98,112, 6, WM)}
      {L(98,112,100,154, 5, WM)}
      {L(100,154,102,192,5, WL)}
      {Jt(64,44, 5)}
      {Jt(96,44, 5)}
      {Jt(62,112,4, WM)}
      {Jt(98,112,4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   OVERHEAD PRESS — active: deltoids, triceps
   viewBox 0 0 168 228 · floor y=200
   Frames: bar at shoulders → halfway → arms fully extended
══════════════════════════════════════════════════════════════════════════════ */
const PressAnim = () => (
  <svg viewBox="0 0 168 228" className="ex-anim">
    {Fl(200, 152)}
    {ArrUp(156, 50, 8)}

    {/* ── Frame 1: bar at shoulders ── */}
    <g className="fr1">
      {Hd(84, 28)}
      {L(84,40,  84,106, 8, W)}
      {L(84,52,  42,66,  7, A)}      {/* L upper arm */}
      {L(42,66,  32,48,  6, A)}      {/* L forearm up (holding bar) */}
      {L(84,52, 126,66,  7, A)}
      {L(126,66,136,48,  6, A)}
      <line x1="16" y1="46" x2="152" y2="46" stroke={A} strokeWidth="5" strokeLinecap="round"/>
      <circle cx="16" cy="46" r="9" fill={A} opacity="0.85"/>
      <circle cx="152" cy="46" r="9" fill={A} opacity="0.85"/>
      {Jt(42,66,  5)}
      {Jt(126,66, 5)}
      {L(84,106, 76,154, 7, WM)}
      {L(76,154, 72,198, 6, WL)}
      {L(84,106, 92,154, 7, WM)}
      {L(92,154, 96,198, 6, WL)}
      {Jt(76,154, 4, WM)}
      {Jt(92,154, 4, WM)}
    </g>

    {/* ── Frame 2: halfway ── */}
    <g className="fr2">
      {Hd(84, 28)}
      {L(84,40,  84,106, 8, W)}
      {L(84,52,  40,50,  7, A)}
      {L(40,50,  34,28,  6, A)}
      {L(84,52, 128,50,  7, A)}
      {L(128,50,134,28,  6, A)}
      <line x1="18" y1="26" x2="150" y2="26" stroke={A} strokeWidth="5" strokeLinecap="round"/>
      <circle cx="18" cy="26" r="9" fill={A} opacity="0.85"/>
      <circle cx="150" cy="26" r="9" fill={A} opacity="0.85"/>
      {Jt(40,50,  5)}
      {Jt(128,50, 5)}
      {L(84,106, 76,154, 7, WM)}
      {L(76,154, 72,198, 6, WL)}
      {L(84,106, 92,154, 7, WM)}
      {L(92,154, 96,198, 6, WL)}
      {Jt(76,154, 4, WM)}
      {Jt(92,154, 4, WM)}
    </g>

    {/* ── Frame 3: arms fully extended ── */}
    <g className="fr3">
      {Hd(84, 28)}
      {L(84,40,  84,106, 8, W)}
      {L(84,52,  60,32,  7, A)}
      {L(60,32,  56,10,  6, A)}
      {L(84,52, 108,32,  7, A)}
      {L(108,32,112,10,  6, A)}
      <line x1="40" y1="8" x2="128" y2="8" stroke={A} strokeWidth="5" strokeLinecap="round"/>
      <circle cx="40" cy="8" r="9" fill={A} opacity="0.85"/>
      <circle cx="128" cy="8" r="9" fill={A} opacity="0.85"/>
      {Jt(60,32,  5)}
      {Jt(108,32, 5)}
      {L(84,106, 76,154, 7, WM)}
      {L(76,154, 72,198, 6, WL)}
      {L(84,106, 92,154, 7, WM)}
      {L(92,154, 96,198, 6, WL)}
      {Jt(76,154, 4, WM)}
      {Jt(92,154, 4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   WALL PUSH-UP — active: chest, front shoulders
   viewBox 0 0 188 228 · wall at x=162
   Frames: arms extended → mid → close to wall
══════════════════════════════════════════════════════════════════════════════ */
const WallPushUpAnim = () => (
  <svg viewBox="0 0 188 228" className="ex-anim">
    <rect x="160" y="8" width="4" height="214" rx="2" fill="rgba(255,255,255,0.20)"/>
    {Fl(200, 170)}

    {/* ── Frame 1: arms extended ── */}
    <g className="fr1">
      {Hd(48, 50)}
      {L(48,62,  48,124, 8, W)}
      {L(48,76,  96,78,  7, A)}      {/* L arm */}
      {L(96,78,  154,80, 6, A)}
      {L(48,88,  96,92,  7, A)}      {/* R arm */}
      {L(96,92,  154,94, 6, A)}
      <circle cx="154" cy="80" r="6" fill={A}/>
      <circle cx="154" cy="94" r="6" fill={A}/>
      {Jt(96,78,  4)}
      {Jt(96,92,  4)}
      {L(48,124, 36,172, 7, WM)}
      {L(36,172, 32,200, 6, WL)}
      {L(48,124, 62,172, 7, WM)}
      {L(62,172, 66,200, 6, WL)}
      {Jt(36,172, 4, WM)}
      {Jt(62,172, 4, WM)}
    </g>

    {/* ── Frame 2: mid ── */}
    <g className="fr2">
      {Hd(56, 50)}
      {L(56,62,  56,124, 8, W)}
      {L(56,76, 102,78,  7, A)}
      {L(102,78, 154,80, 6, A)}
      {L(56,88, 104,92,  7, A)}
      {L(104,92, 154,94, 6, A)}
      <circle cx="154" cy="80" r="6" fill={A}/>
      <circle cx="154" cy="94" r="6" fill={A}/>
      {Jt(102,78, 4)}
      {Jt(104,92, 4)}
      {L(56,124, 44,172, 7, WM)}
      {L(44,172, 40,200, 6, WL)}
      {L(56,124, 70,172, 7, WM)}
      {L(70,172, 74,200, 6, WL)}
      {Jt(44,172, 4, WM)}
      {Jt(70,172, 4, WM)}
    </g>

    {/* ── Frame 3: close to wall ── */}
    <g className="fr3">
      {Hd(66, 50)}
      {L(66,62,  66,124, 8, W)}
      {L(66,76, 112,80,  7, A)}
      {L(112,80, 154,80, 6, A)}
      {L(66,88, 114,94,  7, A)}
      {L(114,94, 154,94, 6, A)}
      <circle cx="154" cy="80" r="6" fill={A}/>
      <circle cx="154" cy="94" r="6" fill={A}/>
      {Jt(112,80, 4)}
      {Jt(114,94, 4)}
      {L(66,124, 52,172, 7, WM)}
      {L(52,172, 48,200, 6, WL)}
      {L(66,124, 80,172, 7, WM)}
      {L(80,172, 84,200, 6, WL)}
      {Jt(52,172, 4, WM)}
      {Jt(80,172, 4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   DEAD BUG — active: core, opposite arm + leg
   viewBox 0 0 230 162 · floor y=140
   Frames: neutral → L arm + R leg → R arm + L leg
══════════════════════════════════════════════════════════════════════════════ */
const DeadBugAnim = () => (
  <svg viewBox="0 0 230 162" className="ex-anim">
    {Fl(140, 222)}

    {/* ── Frame 1: neutral ── */}
    <g className="fr1">
      {Hd(115,62,12)}
      {L(115,74, 115,118, 8, W)}     {/* torso vertical */}
      {/* both arms raised */}
      {L(115,88,  88,74,  6, WM)}
      {L(88,74,   72,60,  5, WL)}
      {L(115,88, 142,74,  6, WM)}
      {L(142,74, 158,60,  5, WL)}
      {/* both knees up */}
      {L(115,118, 90,108, 6, WM)}
      {L(90,108,  76,92,  5, WM)}
      {L(115,118, 140,108, 6, WM)}
      {L(140,108, 154,92,  5, WM)}
      {Jt(88,74,  4, WM)}
      {Jt(142,74, 4, WM)}
      {Jt(90,108, 4, WM)}
      {Jt(140,108,4, WM)}
    </g>

    {/* ── Frame 2: L arm + R leg extend ── */}
    <g className="fr2">
      {Hd(115,62,12)}
      {L(115,74, 115,118, 8, W)}
      {/* L arm extending overhead — ACTIVE */}
      {L(115,88,  78,72,  6, A)}
      {L(78,72,   54,52,  5, A)}
      {/* R arm bent up — inactive */}
      {L(115,88, 148,78,  6, WM)}
      {L(148,78, 162,86,  5, WL)}
      {/* R leg extending — ACTIVE */}
      {L(115,118, 148,120, 6, A)}
      {L(148,120, 174,122, 5, A)}
      {/* L leg bent up — inactive */}
      {L(115,118,  88,106, 6, WM)}
      {L(88,106,   74,96,  5, WM)}
      {Jt(78,72,   5)}
      {Jt(148,120, 5)}
      {Jt(88,106,  4, WM)}
      {Jt(148,78,  4, WM)}
    </g>

    {/* ── Frame 3: R arm + L leg extend ── */}
    <g className="fr3">
      {Hd(115,62,12)}
      {L(115,74, 115,118, 8, W)}
      {/* R arm extending — ACTIVE */}
      {L(115,88, 152,72,  6, A)}
      {L(152,72, 176,52,  5, A)}
      {/* L arm bent up — inactive */}
      {L(115,88,  82,78,  6, WM)}
      {L(82,78,   68,86,  5, WL)}
      {/* L leg extending — ACTIVE */}
      {L(115,118,  82,120, 6, A)}
      {L(82,120,   56,122, 5, A)}
      {/* R leg bent up — inactive */}
      {L(115,118, 142,106, 6, WM)}
      {L(142,106, 156,96,  5, WM)}
      {Jt(152,72,  5)}
      {Jt(82,120,  5)}
      {Jt(82,78,   4, WM)}
      {Jt(142,106, 4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   LUNGE — active: front quad + glute
   viewBox 0 0 160 220 · floor y=194
   Frames: standing → step → full lunge
══════════════════════════════════════════════════════════════════════════════ */
const LungeAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim">
    {Fl(194)}

    {/* ── Frame 1: standing ── */}
    <g className="fr1">
      {Hd(80, 20)}
      {L(80,32,  80,96,  8, W)}
      {L(80,50,  58,78,  6, WM)}
      {L(58,78,  50,96,  5, WL)}
      {L(80,50, 102,78,  6, WM)}
      {L(102,78,110,96,  5, WL)}
      {L(80,96,  72,148, 8, WM)}
      {L(80,96,  88,148, 8, WM)}
      {L(72,148, 70,188, 7, WM)}
      {L(88,148, 90,188, 7, WM)}
      {L(70,188, 52,192, 5, WL)}
      {L(90,188,108,192, 5, WL)}
      {Jt(80,50,  4, WM)}
      {Jt(80,96,  5, WM)}
      {Jt(72,148, 4, WM)}
      {Jt(88,148, 4, WM)}
    </g>

    {/* ── Frame 2: step forward ── */}
    <g className="fr2">
      {Hd(80, 18)}
      {L(80,30,  80,96,  8, W)}
      {L(80,50,  60,76,  6, WM)}
      {L(60,76,  52,94,  5, WL)}
      {L(80,50, 100,76,  6, WM)}
      {L(100,76,108,94,  5, WL)}
      {/* front leg stepping — ACTIVE */}
      {L(80,96,  54,152, 8, A)}
      {L(54,152, 48,192, 7, A)}
      {L(48,192, 30,194, 5, WL)}
      {Jt(54,152, 6)}
      {/* back leg — passive */}
      {L(80,96, 100,148, 8, WM)}
      {L(100,148,106,192, 7, WM)}
      {L(106,192,122,194, 5, WL)}
      {Jt(80,96,  6)}
      {Jt(100,148,4, WM)}
    </g>

    {/* ── Frame 3: full lunge ── */}
    <g className="fr3">
      {Hd(80, 16)}
      {L(80,28,  80,94,  8, W)}
      {L(80,48,  58,74,  6, WM)}
      {L(58,74,  50,90,  5, WL)}
      {L(80,48, 102,74,  6, WM)}
      {L(102,74,110,90,  5, WL)}
      {/* front leg deep — ACTIVE quads */}
      {L(80,94,  46,156, 8, A)}
      {L(46,156, 42,192, 7, A)}
      {L(42,192, 24,194, 5, WL)}
      {Jt(46,156, 6)}
      {/* back leg — glute active */}
      {L(80,94, 108,144, 8, A)}
      {L(108,144,112,192, 7, WM)}
      {L(112,192,128,194, 5, WL)}
      {Jt(80,94,  7)}
      {Jt(108,144,5, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   JUMPING JACK — active: shoulders + legs (full body)
   viewBox 0 0 190 225 · floor y=198
   Frames: together → mid → full jack
══════════════════════════════════════════════════════════════════════════════ */
const JumpingJackAnim = () => (
  <svg viewBox="0 0 190 225" className="ex-anim">
    {Fl(198, 180)}

    {/* ── Frame 1: feet together, arms down ── */}
    <g className="fr1">
      {Hd(95, 22)}
      {L(95,34,  95,98,  8, W)}
      {L(95,52,  74,80,  6, WM)}
      {L(74,80,  68,98,  5, WL)}
      {L(95,52, 116,80,  6, WM)}
      {L(116,80,122,98,  5, WL)}
      {L(95,98,  87,150, 8, WM)}
      {L(95,98, 103,150, 8, WM)}
      {L(87,150, 85,192, 7, WM)}
      {L(103,150,105,192, 7, WM)}
      {L(85,192, 68,196, 5, WL)}
      {L(105,192,122,196, 5, WL)}
      {Jt(95,52,  4, WM)}
      {Jt(95,98,  5, WM)}
      {Jt(87,150, 4, WM)}
      {Jt(103,150,4, WM)}
    </g>

    {/* ── Frame 2: mid ── */}
    <g className="fr2">
      {Hd(95, 20)}
      {L(95,32,  95,96,  8, W)}
      {/* arms half up — ACTIVE */}
      {L(95,50,  66,68,  6, A)}
      {L(66,68,  54,54,  5, A)}
      {L(95,50, 124,68,  6, A)}
      {L(124,68,136,54,  5, A)}
      {/* legs spreading — ACTIVE */}
      {L(95,96,  70,148, 8, A)}
      {L(95,96, 120,148, 8, A)}
      {L(70,148, 66,192, 7, A)}
      {L(120,148,124,192, 7, A)}
      {L(66,192, 50,196, 5, WL)}
      {L(124,192,140,196, 5, WL)}
      {Jt(66,68,  5)}
      {Jt(124,68, 5)}
      {Jt(70,148, 5)}
      {Jt(120,148,5)}
      {Jt(95,96,  6)}
    </g>

    {/* ── Frame 3: full jack ── */}
    <g className="fr3">
      {Hd(95, 18)}
      {L(95,30,  95,94,  8, W)}
      {/* arms fully overhead — ACTIVE */}
      {L(95,48,  62,34,  6, A)}
      {L(62,34,  52,12,  5, A)}
      {L(95,48, 128,34,  6, A)}
      {L(128,34,138,12,  5, A)}
      {/* legs wide — ACTIVE */}
      {L(95,94,  54,146, 8, A)}
      {L(95,94, 136,146, 8, A)}
      {L(54,146, 50,192, 7, A)}
      {L(136,146,140,192, 7, A)}
      {L(50,192, 32,196, 5, WL)}
      {L(140,192,158,196, 5, WL)}
      <circle cx="90" cy="8" r="6" fill={A}/>
      <circle cx="100" cy="8" r="6" fill={A}/>
      {Jt(62,34,  5)}
      {Jt(128,34, 5)}
      {Jt(54,146, 5)}
      {Jt(136,146,5)}
      {Jt(95,94,  7)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   BICYCLE CRUNCH — active: obliques / core
   viewBox 0 0 230 162 · floor y=138
   Frames: neutral → L elbow to R knee → R elbow to L knee
══════════════════════════════════════════════════════════════════════════════ */
const BicycleCrunchAnim = () => (
  <svg viewBox="0 0 230 162" className="ex-anim">
    {Fl(138, 222)}

    {/* ── Frame 1: neutral ── */}
    <g className="fr1">
      {Hd(115,58,12)}
      {L(115,70, 115,116, 8, W)}
      {/* arms behind head */}
      {L(115,80,  90,70,  5, WM)}
      {L(90,70,   72,58,  4, WL)}
      {L(115,80, 140,70,  5, WM)}
      {L(140,70, 158,58,  4, WL)}
      {/* knees up */}
      {L(115,116, 90,106, 6, WM)}
      {L(90,106,  76,90,  5, WM)}
      {L(115,116, 140,106, 6, WM)}
      {L(140,106, 154,90,  5, WM)}
      {Jt(90,106, 4, WM)}
      {Jt(140,106,4, WM)}
    </g>

    {/* ── Frame 2: L elbow → R knee ── */}
    <g className="fr2">
      {Hd(117,54,12)}
      {L(115,66, 117,112, 8, W)}
      {/* L arm ACTIVE toward R knee */}
      {L(115,78,  80,62,  5, A)}
      {L(80,62,   58,70,  4, A)}
      {/* R arm behind head */}
      {L(115,78, 148,70,  5, WM)}
      {L(148,70, 164,58,  4, WL)}
      {/* R knee driving in — ACTIVE */}
      {L(117,112, 150,116, 6, A)}
      {L(150,116, 166,108, 5, A)}
      {/* L leg extending */}
      {L(113,112,  84,124, 6, WM)}
      {L(84,124,   62,130, 5, WL)}
      {Jt(80,62,   5)}
      {Jt(150,116, 5)}
      {Jt(84,124,  4, WM)}
    </g>

    {/* ── Frame 3: R elbow → L knee ── */}
    <g className="fr3">
      {Hd(113,54,12)}
      {L(115,66, 113,112, 8, W)}
      {/* R arm ACTIVE toward L knee */}
      {L(115,78, 150,62,  5, A)}
      {L(150,62, 172,70,  4, A)}
      {/* L arm behind head */}
      {L(115,78,  82,70,  5, WM)}
      {L(82,70,   68,58,  4, WL)}
      {/* L knee driving in — ACTIVE */}
      {L(113,112,  80,116, 6, A)}
      {L(80,116,   64,108, 5, A)}
      {/* R leg extending */}
      {L(117,112, 146,124, 6, WM)}
      {L(146,124, 168,130, 5, WL)}
      {Jt(150,62,  5)}
      {Jt(80,116,  5)}
      {Jt(146,124, 4, WM)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   MOUNTAIN CLIMBER — active: core, hip flexors, shoulders
   viewBox 0 0 240 142 · floor y=120
   Frames: plank hold → L knee in → R knee in
══════════════════════════════════════════════════════════════════════════════ */
const MountainClimberAnim = () => (
  <svg viewBox="0 0 240 142" className="ex-anim">
    {Fl(120, 232)}

    {/* ── Frame 1: plank ── */}
    <g className="fr1">
      {Hd(26,70,12)}
      {L(38,76,  176,96,  8, W)}
      {L(60,82,   56,106, 7, A)}     {/* L arm */}
      {L(56,106,  46,120, 5, A)}
      {L(96,88,   92,110, 7, A)}     {/* R arm */}
      {L(92,110,  80,120, 5, A)}
      {L(176,96,  196,108, 7, WM)}   {/* back legs both extended */}
      {L(196,108, 210,120, 6, WL)}
      {L(176,96,  200,106, 7, WM)}
      {L(200,106, 216,120, 6, WL)}
      {Jt(56,106,  5)}
      {Jt(92,110,  5)}
      {Jt(196,108, 4, WM)}
      {Jt(200,106, 4, WM)}
    </g>

    {/* ── Frame 2: L knee driven forward ── */}
    <g className="fr2">
      {Hd(26,70,12)}
      {L(38,76,  176,96,  8, W)}
      {L(60,82,   56,106, 7, A)}
      {L(56,106,  46,120, 5, A)}
      {L(96,88,   92,110, 7, A)}
      {L(92,110,  80,120, 5, A)}
      {/* L knee driven in — ACTIVE */}
      {L(176,96,  154,110, 7, A)}
      {L(154,110, 132,106, 6, A)}
      {/* R leg extended */}
      {L(176,96,  200,106, 7, WM)}
      {L(200,106, 216,120, 6, WL)}
      {Jt(56,106,  5)}
      {Jt(92,110,  5)}
      {Jt(154,110, 6)}
      {Jt(200,106, 4, WM)}
    </g>

    {/* ── Frame 3: R knee driven forward ── */}
    <g className="fr3">
      {Hd(26,70,12)}
      {L(38,76,  176,96,  8, W)}
      {L(60,82,   56,106, 7, A)}
      {L(56,106,  46,120, 5, A)}
      {L(96,88,   92,110, 7, A)}
      {L(92,110,  80,120, 5, A)}
      {/* L leg extended */}
      {L(176,96,  196,108, 7, WM)}
      {L(196,108, 210,120, 6, WL)}
      {/* R knee driven in — ACTIVE */}
      {L(176,96,  158,112, 7, A)}
      {L(158,112, 136,108, 6, A)}
      {Jt(56,106,  5)}
      {Jt(92,110,  5)}
      {Jt(196,108, 4, WM)}
      {Jt(158,112, 6)}
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   ANIMATION MAP — exercise name → component
══════════════════════════════════════════════════════════════════════════════ */
const ANIMATION_MAP = {
  'bodyweight squat':         SquatAnim,
  'goblet squat':             SquatAnim,
  'barbell back squat':       SquatAnim,
  'قرفصاء بوزن الجسم':        SquatAnim,
  'قرفصاء الكأس':             SquatAnim,
  'قرفصاء بالبار':            SquatAnim,

  'push-up':                  PushUpAnim,
  'bench press':              PushUpAnim,
  'ضغط البنش':                PushUpAnim,
  'تمرين الضغط':              PushUpAnim,

  'wall push-up':             WallPushUpAnim,
  'تمرين الضغط على الجدار':   WallPushUpAnim,

  'glute bridge':             GluteBridgeAnim,
  'جسر الأرداف':              GluteBridgeAnim,

  'dead bug':                 DeadBugAnim,
  'الدودة الميتة':            DeadBugAnim,

  'plank':                    PlankAnim,
  'بلانك':                    PlankAnim,

  'romanian deadlift':        HingeAnim,
  'deadlift':                 HingeAnim,
  'رفع أرومانية':              HingeAnim,
  'رفع ميت':                  HingeAnim,

  'dumbbell row':             RowAnim,
  'تجديف بالدمبل':            RowAnim,

  'pull-up':                  PullUpAnim,
  'سحب علوي':                 PullUpAnim,

  'overhead press':           PressAnim,
  'ضغط فوق الرأس':            PressAnim,

  'lunge':                    LungeAnim,
  'طعنة':                     LungeAnim,
  'تمرين الطعنة':             LungeAnim,

  'jumping jack':             JumpingJackAnim,
  'jumping jacks':            JumpingJackAnim,
  'قفز النجمة':               JumpingJackAnim,

  'bicycle crunch':           BicycleCrunchAnim,
  'bicycle crunches':         BicycleCrunchAnim,
  'كرنش الدراجة':             BicycleCrunchAnim,

  'mountain climber':         MountainClimberAnim,
  'mountain climbers':        MountainClimberAnim,
  'تسلق الجبل':               MountainClimberAnim,
};

/* ══════════════════════════════════════════════════════════════════════════════
   WRAPPER
══════════════════════════════════════════════════════════════════════════════ */
const ExerciseAnimation = ({ exerciseName }) => {
  const key  = (exerciseName || '').toLowerCase();
  const Anim = ANIMATION_MAP[key] || SquatAnim;
  return (
    <div className="ex-anim-wrap">
      <Anim />
    </div>
  );
};

export default ExerciseAnimation;
