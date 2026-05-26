import React from 'react';
import './ExerciseAnimation.css';

/*
  Illustrated character animations — gym-poster style.
  Body parts are thick rounded strokes (strokeLinecap="round") to give
  the "filled limb" look.  Active / highlighted muscles are rendered
  in the FitGuard orange (#FF6B00); the rest of the body uses a
  dark-grey (#3E3E52).  All existing CSS keyframe class names are kept
  intact so the motion timing is unchanged.
*/

// ── Design tokens ─────────────────────────────────────────────────────────────
const B  = '#3E3E52';          // body base (dark grey)
const A  = '#FF6B00';          // active muscle (orange)
const BL = '#2C2C3A';          // body shadow / depth layer
const cap = { strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

// Stroke helper: returns style for a body segment
const seg  = (color, w) => ({ stroke: color, strokeWidth: String(w), ...cap });
const bSeg = (w) => seg(B, w);   // inactive limb
const aSeg = (w) => seg(A, w);   // active / highlighted muscle

// Head helper (filled ellipse)
const headStyle = (color = B) => ({
  fill: color,
  stroke: 'rgba(255,255,255,0.12)',
  strokeWidth: '1.5',
});

// Small depth-layer beneath a limb (drawn first, 2px wider, darker)
const depthSeg = (w) => seg(BL, w + 3);

/* ══════════════════════════════════════════════════════════════════════════════
   SQUAT
   Active: quads (thighs) + glutes
   Position: mid-squat, arms extended forward for balance
══════════════════════════════════════════════════════════════════════════════ */
const SquatAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim ex-anim--squat">
    {/* Floor */}
    <line x1="16" y1="195" x2="144" y2="195" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    {/* Ghost silhouette at squat depth */}
    <g className="squat-ghost" opacity="0">
      <circle cx="80" cy="72" r="13" fill="rgba(255,107,0,0.18)" stroke="rgba(255,107,0,0.35)" strokeWidth="1.5"/>
      <line x1="80" y1="85" x2="80" y2="122" stroke="rgba(255,107,0,0.22)" strokeWidth="14" {...cap}/>
      <line x1="68" y1="122" x2="44" y2="155" stroke="rgba(255,107,0,0.22)" strokeWidth="12" {...cap}/>
      <line x1="92" y1="122" x2="116" y2="155" stroke="rgba(255,107,0,0.22)" strokeWidth="12" {...cap}/>
      <line x1="44" y1="155" x2="38" y2="192" stroke="rgba(255,107,0,0.22)" strokeWidth="10" {...cap}/>
      <line x1="116" y1="155" x2="122" y2="192" stroke="rgba(255,107,0,0.22)" strokeWidth="10" {...cap}/>
    </g>

    {/* Main figure */}
    <g className="squat-body">
      {/* Head */}
      <circle cx="80" cy="28" r="14" {...headStyle(B)}/>

      {/* Neck */}
      <line x1="80" y1="41" x2="80" y2="52" {...bSeg(9)}/>

      {/* Torso (slight forward lean at squat) */}
      <line x1="80" y1="41" x2="80" y2="52" {...depthSeg(9)}/>
      <line x1="80" y1="52" x2="78" y2="102" {...depthSeg(14)}/>
      <line x1="80" y1="52" x2="78" y2="102" {...bSeg(14)}/>

      {/* Arms extended forward for balance */}
      {/* L upper arm */}
      <line x1="72" y1="64" x2="50" y2="72" {...depthSeg(10)}/>
      <line x1="72" y1="64" x2="50" y2="72" {...bSeg(10)}/>
      {/* L forearm */}
      <line x1="50" y1="72" x2="34" y2="70" {...bSeg(8)}/>

      {/* R upper arm */}
      <line x1="86" y1="64" x2="108" y2="72" {...depthSeg(10)}/>
      <line x1="86" y1="64" x2="108" y2="72" {...bSeg(10)}/>
      {/* R forearm */}
      <line x1="108" y1="72" x2="124" y2="70" {...bSeg(8)}/>

      {/* ── ACTIVE: thighs + shins (quads) ── */}
      {/* L thigh */}
      <line x1="68" y1="102" x2="46" y2="148" {...depthSeg(13)}/>
      <line x1="68" y1="102" x2="46" y2="148" {...aSeg(13)}/>
      {/* R thigh */}
      <line x1="90" y1="102" x2="112" y2="148" {...depthSeg(13)}/>
      <line x1="90" y1="102" x2="112" y2="148" {...aSeg(13)}/>
      {/* L shin */}
      <line x1="46" y1="148" x2="40" y2="192" {...aSeg(11)}/>
      {/* R shin */}
      <line x1="112" y1="148" x2="118" y2="192" {...aSeg(11)}/>

      {/* Feet */}
      <line x1="40" y1="192" x2="24" y2="195" {...bSeg(8)}/>
      <line x1="118" y1="192" x2="134" y2="195" {...bSeg(8)}/>

      {/* Knee joint dots */}
      <circle cx="46" cy="148" r="5" fill={A}/>
      <circle cx="112" cy="148" r="5" fill={A}/>
      {/* Hip joint */}
      <circle cx="79" cy="102" r="6" fill={B} stroke={A} strokeWidth="2"/>
    </g>

    {/* Motion arrow */}
    <g className="squat-arrow" opacity="0.55">
      <line x1="140" y1="58" x2="140" y2="168" stroke={A} strokeWidth="1.5" strokeDasharray="4 4"/>
      <polygon points="135,166 140,178 145,166" fill={A}/>
      <polygon points="135,60 140,48 145,60" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   PUSH-UP
   Active: chest (pec area across torso), shoulders, triceps (back of upper arm)
   Position: top of push-up, arms extended
══════════════════════════════════════════════════════════════════════════════ */
const PushUpAnim = () => (
  <svg viewBox="0 0 220 150" className="ex-anim ex-anim--pushup">
    <line x1="8" y1="128" x2="212" y2="128" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="pushup-body">
      {/* Head */}
      <circle cx="24" cy="64" r="13" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="36" y1="66" x2="48" y2="70" {...bSeg(8)}/>

      {/* Torso — diagonal, ACTIVE (chest) */}
      <line x1="48" y1="70" x2="158" y2="98" {...depthSeg(15)}/>
      <line x1="48" y1="70" x2="158" y2="98" {...aSeg(15)}/>

      {/* Front arm (near side) — upper arm active (tricep/shoulder) */}
      <line x1="68" y1="76" x2="64" y2="110" {...depthSeg(11)}/>
      <line x1="68" y1="76" x2="64" y2="110" {...aSeg(11)}/>
      {/* Front forearm */}
      <line x1="64" y1="110" x2="54" y2="128" {...aSeg(9)}/>

      {/* Back arm */}
      <line x1="105" y1="87" x2="101" y2="118" {...depthSeg(11)}/>
      <line x1="105" y1="87" x2="101" y2="118" {...aSeg(11)}/>
      <line x1="101" y1="118" x2="91" y2="128" {...aSeg(9)}/>

      {/* Legs — inactive */}
      <line x1="158" y1="98" x2="186" y2="110" {...bSeg(12)}/>
      <line x1="186" y1="110" x2="206" y2="128" {...bSeg(10)}/>

      {/* Joint dots */}
      <circle cx="64" cy="110" r="5" fill={A}/>
      <circle cx="101" cy="118" r="5" fill={A}/>
    </g>

    {/* Arrow */}
    <g className="pushup-arrow" opacity="0.55">
      <line x1="22" y1="88" x2="22" y2="120" stroke={A} strokeWidth="1.5" strokeDasharray="3 3"/>
      <polygon points="17,90 22,78 27,90" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   GLUTE BRIDGE
   Active: glutes (hips), hamstrings (back of thighs)
   Position: hips raised, lying on back
══════════════════════════════════════════════════════════════════════════════ */
const GluteBridgeAnim = () => (
  <svg viewBox="0 0 220 160" className="ex-anim ex-anim--bridge">
    <line x1="8" y1="142" x2="212" y2="142" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="bridge-hips">
      {/* Head on floor */}
      <circle cx="28" cy="110" r="13" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="41" y1="108" x2="52" y2="105" {...bSeg(8)}/>

      {/* Upper back / torso — going up toward hips */}
      <line x1="52" y1="105" x2="108" y2="88" {...depthSeg(14)}/>
      <line x1="52" y1="105" x2="108" y2="88" {...bSeg(14)}/>

      {/* Arms flat on ground (support) */}
      <line x1="58" y1="108" x2="52" y2="138" {...bSeg(9)}/>
      <line x1="72" y1="105" x2="66" y2="138" {...bSeg(9)}/>

      {/* ── ACTIVE: glutes / hips ── */}
      <circle cx="108" cy="88" r="9" fill={A} opacity="0.9"/>

      {/* ── ACTIVE: hamstrings (back of thighs) ── */}
      {/* L thigh */}
      <line x1="100" y1="92" x2="122" y2="118" {...depthSeg(13)}/>
      <line x1="100" y1="92" x2="122" y2="118" {...aSeg(13)}/>
      {/* L shin (inactive) */}
      <line x1="122" y1="118" x2="126" y2="142" {...bSeg(11)}/>

      {/* R thigh */}
      <line x1="116" y1="90" x2="148" y2="112" {...depthSeg(13)}/>
      <line x1="116" y1="90" x2="148" y2="112" {...aSeg(13)}/>
      {/* R shin */}
      <line x1="148" y1="112" x2="156" y2="142" {...bSeg(11)}/>

      {/* Knee joints */}
      <circle cx="122" cy="118" r="5" fill={B} stroke={A} strokeWidth="1.5"/>
      <circle cx="148" cy="112" r="5" fill={B} stroke={A} strokeWidth="1.5"/>
    </g>

    {/* Arrow */}
    <g className="bridge-arrow" opacity="0.55">
      <line x1="108" y1="48" x2="108" y2="80" stroke={A} strokeWidth="1.5" strokeDasharray="3 3"/>
      <polygon points="103,50 108,38 113,50" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   PLANK
   Active: core (entire torso highlighted), shoulders
   Position: forearm plank
══════════════════════════════════════════════════════════════════════════════ */
const PlankAnim = () => (
  <svg viewBox="0 0 230 140" className="ex-anim ex-anim--plank">
    <line x1="8" y1="118" x2="222" y2="118" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="plank-body">
      {/* Head */}
      <circle cx="28" cy="74" r="13" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="40" y1="76" x2="52" y2="80" {...bSeg(8)}/>

      {/* Torso — ACTIVE (core) */}
      <line x1="52" y1="80" x2="178" y2="96" {...depthSeg(15)}/>
      <line x1="52" y1="80" x2="178" y2="96" {...aSeg(15)}/>

      {/* Front forearm (on ground) — ACTIVE shoulder */}
      <line x1="62" y1="84" x2="60" y2="105" {...aSeg(11)}/>
      <line x1="60" y1="105" x2="50" y2="118" {...aSeg(9)}/>

      {/* Back forearm */}
      <line x1="95" y1="89" x2="93" y2="110" {...aSeg(11)}/>
      <line x1="93" y1="110" x2="83" y2="118" {...aSeg(9)}/>

      {/* Legs */}
      <line x1="178" y1="96" x2="200" y2="108" {...bSeg(12)}/>
      <line x1="200" y1="108" x2="218" y2="118" {...bSeg(10)}/>

      {/* Elbow joints */}
      <circle cx="60" cy="105" r="5" fill={A}/>
      <circle cx="93" cy="110" r="5" fill={A}/>
    </g>

    {/* Core pulse ring */}
    <circle cx="128" cy="88" r="0" className="plank-pulse" fill="rgba(255,107,0,0.18)"/>

    {/* HOLD label */}
    <text x="115" y="133" textAnchor="middle" fontSize="9.5" fill="rgba(255,107,0,0.7)"
      fontFamily="Montserrat,sans-serif" fontWeight="700" letterSpacing="1.5">HOLD</text>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   HIP HINGE (Deadlift / RDL)
   Active: hamstrings (back of thighs), glutes, lower back (torso)
   Position: standing, hinging forward from hips
══════════════════════════════════════════════════════════════════════════════ */
const HingeAnim = () => (
  <svg viewBox="0 0 160 220" className="ex-anim ex-anim--hinge">
    <line x1="16" y1="195" x2="144" y2="195" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="hinge-body">
      {/* Head */}
      <circle cx="80" cy="28" r="14" {...headStyle(B)}/>

      {/* Torso — ACTIVE (erector spinae / lower back) */}
      <line x1="80" y1="42" x2="80" y2="100" {...depthSeg(15)}/>
      <line x1="80" y1="42" x2="80" y2="100" {...aSeg(15)}/>

      {/* Arms hanging */}
      <line x1="68" y1="58" x2="52" y2="78" {...bSeg(10)}/>
      <line x1="52" y1="78" x2="46" y2="102" {...bSeg(9)}/>
      <line x1="92" y1="58" x2="108" y2="78" {...bSeg(10)}/>
      <line x1="108" y1="78" x2="114" y2="102" {...bSeg(9)}/>
      {/* Elbow joints */}
      <circle cx="52" cy="78" r="4" fill={B} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <circle cx="108" cy="78" r="4" fill={B} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>

      {/* ── ACTIVE: hamstrings (back of thighs) ── */}
      {/* L thigh */}
      <line x1="68" y1="100" x2="62" y2="150" {...depthSeg(13)}/>
      <line x1="68" y1="100" x2="62" y2="150" {...aSeg(13)}/>
      {/* R thigh */}
      <line x1="92" y1="100" x2="98" y2="150" {...depthSeg(13)}/>
      <line x1="92" y1="100" x2="98" y2="150" {...aSeg(13)}/>

      {/* Shins — inactive */}
      <line x1="62" y1="150" x2="54" y2="192" {...bSeg(11)}/>
      <line x1="98" y1="150" x2="106" y2="192" {...bSeg(11)}/>

      {/* Feet */}
      <line x1="54" y1="192" x2="38" y2="195" {...bSeg(8)}/>
      <line x1="106" y1="192" x2="122" y2="195" {...bSeg(8)}/>

      {/* Hip joint */}
      <circle cx="80" cy="100" r="7" fill={A}/>
      {/* Knee joints */}
      <circle cx="62" cy="150" r="5" fill={B} stroke={A} strokeWidth="1.5"/>
      <circle cx="98" cy="150" r="5" fill={B} stroke={A} strokeWidth="1.5"/>
    </g>

    {/* Arc arrow showing hip hinge direction */}
    <g className="hinge-arrow" opacity="0.55">
      <path d="M 112 90 Q 132 58 112 38" stroke={A} strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
      <polygon points="108,41 116,30 119,43" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   DUMBBELL ROW
   Active: back (upper torso), bicep (pulling arm upper arm)
   Position: bent-over row stance
══════════════════════════════════════════════════════════════════════════════ */
const RowAnim = () => (
  <svg viewBox="0 0 210 185" className="ex-anim ex-anim--row">
    <line x1="8" y1="156" x2="202" y2="156" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="row-body">
      {/* Head */}
      <circle cx="32" cy="66" r="13" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="44" y1="70" x2="54" y2="74" {...bSeg(8)}/>

      {/* Torso tilted forward — ACTIVE (back muscles) */}
      <line x1="54" y1="74" x2="118" y2="100" {...depthSeg(15)}/>
      <line x1="54" y1="74" x2="118" y2="100" {...aSeg(15)}/>

      {/* Support arm (straight down to floor) */}
      <line x1="68" y1="81" x2="64" y2="118" {...bSeg(10)}/>
      <line x1="64" y1="118" x2="50" y2="156" {...bSeg(9)}/>
      <circle cx="64" cy="118" r="4" fill={B} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>

      {/* Pulling arm — ACTIVE (bicep / upper arm) */}
      <line x1="82" y1="88" x2="82" y2="118" {...depthSeg(11)}/>
      <line x1="82" y1="88" x2="82" y2="118" {...aSeg(11)} className="row-arm"/>
      <line x1="82" y1="118" x2="68" y2="134" {...aSeg(9)} className="row-forearm"/>

      {/* Dumbbell */}
      <circle cx="64" cy="138" r="6" fill={A} opacity="0.85"/>
      <line x1="58" y1="138" x2="70" y2="138" stroke={A} strokeWidth="4" strokeLinecap="round"/>

      {/* Legs */}
      <line x1="110" y1="100" x2="126" y2="132" {...bSeg(12)}/>
      <line x1="126" y1="132" x2="130" y2="156" {...bSeg(10)}/>
      <line x1="118" y1="102" x2="148" y2="120" {...bSeg(12)}/>
      <line x1="148" y1="120" x2="156" y2="156" {...bSeg(10)}/>

      {/* Elbow joint */}
      <circle cx="82" cy="118" r="5" fill={A}/>
      {/* Knee joints */}
      <circle cx="126" cy="132" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <circle cx="148" cy="120" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
    </g>

    {/* Pull arrow */}
    <g className="row-arrow" opacity="0.55">
      <line x1="82" y1="98" x2="82" y2="62" stroke={A} strokeWidth="1.5" strokeDasharray="3 3"/>
      <polygon points="77,64 82,50 87,64" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   PULL-UP
   Active: lats (torso side), biceps (upper arms)
   Position: hanging, mid-pull
══════════════════════════════════════════════════════════════════════════════ */
const PullUpAnim = () => (
  <svg viewBox="0 0 160 245" className="ex-anim ex-anim--pullup">
    {/* Bar */}
    <rect x="12" y="14" width="136" height="10" rx="5" fill="#4A4A5A"/>
    <line x1="22" y1="8" x2="22" y2="24" stroke="#3A3A4A" strokeWidth="5" strokeLinecap="round"/>
    <line x1="138" y1="8" x2="138" y2="24" stroke="#3A3A4A" strokeWidth="5" strokeLinecap="round"/>

    <g className="pullup-body">
      {/* Hands gripping bar */}
      <circle cx="50" cy="20" r="7" fill={A}/>
      <circle cx="110" cy="20" r="7" fill={A}/>

      {/* ── ACTIVE: biceps / upper arms ── */}
      {/* L upper arm */}
      <line x1="50" y1="20" x2="56" y2="56" {...depthSeg(12)}/>
      <line x1="50" y1="20" x2="56" y2="56" {...aSeg(12)}/>
      {/* R upper arm */}
      <line x1="110" y1="20" x2="104" y2="56" {...depthSeg(12)}/>
      <line x1="110" y1="20" x2="104" y2="56" {...aSeg(12)}/>

      {/* Forearms */}
      <line x1="56" y1="56" x2="66" y2="74" {...bSeg(10)}/>
      <line x1="104" y1="56" x2="94" y2="74" {...bSeg(10)}/>
      {/* Elbow joints */}
      <circle cx="56" cy="56" r="5" fill={A}/>
      <circle cx="104" cy="56" r="5" fill={A}/>

      {/* Head */}
      <circle cx="80" cy="86" r="14" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="80" y1="100" x2="80" y2="108" {...bSeg(9)}/>

      {/* Torso — ACTIVE (lats) */}
      <line x1="80" y1="108" x2="80" y2="158" {...depthSeg(16)}/>
      <line x1="80" y1="108" x2="80" y2="158" {...aSeg(16)}/>

      {/* Legs */}
      <line x1="72" y1="158" x2="68" y2="200" {...bSeg(12)}/>
      <line x1="68" y1="200" x2="64" y2="232" {...bSeg(10)}/>
      <line x1="88" y1="158" x2="92" y2="200" {...bSeg(12)}/>
      <line x1="92" y1="200" x2="96" y2="232" {...bSeg(10)}/>

      {/* Knee joints */}
      <circle cx="68" cy="200" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <circle cx="92" cy="200" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

      {/* Hip */}
      <circle cx="80" cy="158" r="6" fill={B} stroke={A} strokeWidth="1.5"/>
    </g>

    {/* Up arrow */}
    <g className="pullup-arrow" opacity="0.55">
      <line x1="144" y1="90" x2="144" y2="42" stroke={A} strokeWidth="1.5" strokeDasharray="3 3"/>
      <polygon points="139,44 144,30 149,44" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   OVERHEAD PRESS
   Active: shoulders (deltoids), triceps (upper arms)
   Position: standing, bar at shoulder level about to press
══════════════════════════════════════════════════════════════════════════════ */
const PressAnim = () => (
  <svg viewBox="0 0 168 228" className="ex-anim ex-anim--press">
    <line x1="16" y1="200" x2="152" y2="200" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="press-body">
      {/* Head */}
      <circle cx="84" cy="28" r="14" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="84" y1="42" x2="84" y2="52" {...bSeg(9)}/>

      {/* Torso — inactive */}
      <line x1="84" y1="52" x2="84" y2="106" {...depthSeg(14)}/>
      <line x1="84" y1="52" x2="84" y2="106" {...bSeg(14)}/>

      {/* ── ACTIVE: deltoids + triceps (arms pressing up) ── */}
      {/* L upper arm */}
      <line x1="76" y1="60" x2="44" y2="65" {...depthSeg(12)} className="press-upper-l"/>
      <line x1="76" y1="60" x2="44" y2="65" {...aSeg(12)} className="press-upper-l"/>
      {/* L forearm */}
      <line x1="44" y1="65" x2="36" y2="46" {...aSeg(10)} className="press-lower-l"/>

      {/* R upper arm */}
      <line x1="92" y1="60" x2="124" y2="65" {...depthSeg(12)} className="press-upper-r"/>
      <line x1="92" y1="60" x2="124" y2="65" {...aSeg(12)} className="press-upper-r"/>
      {/* R forearm */}
      <line x1="124" y1="65" x2="132" y2="46" {...aSeg(10)} className="press-lower-r"/>

      {/* Barbell */}
      <line x1="18" y1="44" x2="150" y2="44" stroke={A} strokeWidth="5" strokeLinecap="round" className="press-bar"/>
      <circle cx="18" cy="44" r="8" fill={A} opacity="0.8" className="press-bar"/>
      <circle cx="150" cy="44" r="8" fill={A} opacity="0.8" className="press-bar"/>

      {/* Elbow joints */}
      <circle cx="44" cy="65" r="5" fill={A}/>
      <circle cx="124" cy="65" r="5" fill={A}/>

      {/* Legs */}
      <line x1="76" y1="106" x2="68" y2="154" {...bSeg(12)}/>
      <line x1="68" y1="154" x2="62" y2="198" {...bSeg(10)}/>
      <line x1="92" y1="106" x2="100" y2="154" {...bSeg(12)}/>
      <line x1="100" y1="154" x2="106" y2="198" {...bSeg(10)}/>

      {/* Hip joint */}
      <circle cx="84" cy="106" r="5" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      {/* Knee joints */}
      <circle cx="68" cy="154" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <circle cx="100" cy="154" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
    </g>

    {/* Arrow up */}
    <g className="press-arrow" opacity="0.55">
      <line x1="152" y1="42" x2="152" y2="10" stroke={A} strokeWidth="1.5" strokeDasharray="3 3"/>
      <polygon points="147,12 152,0 157,12" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   WALL PUSH-UP
   Active: chest (torso), front shoulder (upper arms)
   Position: leaning into wall, arms slightly bent
══════════════════════════════════════════════════════════════════════════════ */
const WallPushUpAnim = () => (
  <svg viewBox="0 0 188 228" className="ex-anim ex-anim--wallpushup">
    {/* Wall */}
    <rect x="158" y="8" width="12" height="212" rx="4" fill="#2E2E3E"/>
    <line x1="8" y1="200" x2="170" y2="200" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="wallpushup-body">
      {/* Head */}
      <circle cx="48" cy="52" r="14" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="48" y1="66" x2="48" y2="76" {...bSeg(9)}/>

      {/* Torso — ACTIVE (chest / pec) */}
      <line x1="48" y1="76" x2="48" y2="124" {...depthSeg(14)}/>
      <line x1="48" y1="76" x2="48" y2="124" {...aSeg(14)}/>

      {/* ── ACTIVE: arms reaching toward wall (shoulder / tricep) ── */}
      {/* L upper arm */}
      <line x1="40" y1="84" x2="88" y2="76" {...depthSeg(11)} className="wpu-upper-l"/>
      <line x1="40" y1="84" x2="88" y2="76" {...aSeg(11)} className="wpu-upper-l"/>
      {/* L forearm */}
      <line x1="88" y1="76" x2="148" y2="78" {...aSeg(9)} className="wpu-lower-l"/>

      {/* R upper arm */}
      <line x1="56" y1="84" x2="100" y2="96" {...depthSeg(11)} className="wpu-upper-r"/>
      <line x1="56" y1="84" x2="100" y2="96" {...aSeg(11)} className="wpu-upper-r"/>
      {/* R forearm */}
      <line x1="100" y1="96" x2="148" y2="96" {...aSeg(9)} className="wpu-lower-r"/>

      {/* Hand contacts on wall */}
      <circle cx="148" cy="78" r="6" fill={A}/>
      <circle cx="148" cy="96" r="6" fill={A}/>

      {/* Elbow joints */}
      <circle cx="88" cy="76" r="4" fill={A}/>
      <circle cx="100" cy="96" r="4" fill={A}/>

      {/* Legs — standing, slight lean */}
      <line x1="40" y1="124" x2="32" y2="170" {...bSeg(12)}/>
      <line x1="32" y1="170" x2="26" y2="200" {...bSeg(10)}/>
      <line x1="56" y1="124" x2="64" y2="170" {...bSeg(12)}/>
      <line x1="64" y1="170" x2="68" y2="200" {...bSeg(10)}/>

      {/* Hip */}
      <circle cx="48" cy="124" r="6" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      {/* Knee joints */}
      <circle cx="32" cy="170" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <circle cx="64" cy="170" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
    </g>

    {/* Push arrow toward wall */}
    <g className="wpu-arrow" opacity="0.55">
      <line x1="108" y1="56" x2="140" y2="56" stroke={A} strokeWidth="1.5" strokeDasharray="3 3"/>
      <polygon points="138,51 150,56 138,61" fill={A}/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   DEAD BUG
   Active: core (torso), opposite arm + leg pair
   Position: lying on back, one arm + opposite leg extended
══════════════════════════════════════════════════════════════════════════════ */
const DeadBugAnim = () => (
  <svg viewBox="0 0 230 165" className="ex-anim ex-anim--deadbug">
    <line x1="8" y1="140" x2="222" y2="140" stroke="rgba(255,107,0,0.25)" strokeWidth="2"/>

    <g className="deadbug-body">
      {/* Head */}
      <circle cx="112" cy="90" r="13" {...headStyle(B)}/>
      {/* Neck */}
      <line x1="112" y1="103" x2="112" y2="112" {...bSeg(8)}/>

      {/* Torso — ACTIVE (core) */}
      <line x1="112" y1="112" x2="112" y2="136" {...depthSeg(15)}/>
      <line x1="112" y1="112" x2="112" y2="136" {...aSeg(15)}/>

      {/* ── ACTIVE: extending left arm ── */}
      <line x1="112" y1="116" x2="76" y2="104" {...depthSeg(11)} className="db-arm-l"/>
      <line x1="112" y1="116" x2="76" y2="104" {...aSeg(11)} className="db-arm-l"/>
      <line x1="76" y1="104" x2="54" y2="82" {...aSeg(9)} className="db-forearm-l"/>
      <circle cx="76" cy="104" r="4" fill={A}/>

      {/* Inactive right arm (resting) */}
      <line x1="112" y1="116" x2="148" y2="108" {...bSeg(11)} className="db-arm-r"/>
      <line x1="148" y1="108" x2="166" y2="122" {...bSeg(9)} className="db-forearm-r"/>
      <circle cx="148" cy="108" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

      {/* ── ACTIVE: extending right leg (opposite to active arm) ── */}
      <line x1="116" y1="136" x2="144" y2="136" {...depthSeg(12)} className="db-leg-r"/>
      <line x1="116" y1="136" x2="144" y2="136" {...aSeg(12)} className="db-leg-r"/>
      <line x1="144" y1="136" x2="172" y2="140" {...aSeg(10)} className="db-shin-r"/>
      <circle cx="144" cy="136" r="4" fill={A}/>

      {/* Inactive left leg (bent, at rest) */}
      <line x1="108" y1="136" x2="86" y2="120" {...bSeg(12)} className="db-leg-l"/>
      <line x1="86" y1="120" x2="64" y2="104" {...bSeg(10)} className="db-shin-l"/>
      <circle cx="86" cy="120" r="4" fill={B} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
    </g>
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════════════
   MAP: exercise name → animation component
══════════════════════════════════════════════════════════════════════════════ */
const ANIMATION_MAP = {
  // Squats
  'bodyweight squat':     SquatAnim,
  'goblet squat':         SquatAnim,
  'barbell back squat':   SquatAnim,
  'قرفصاء بوزن الجسم':    SquatAnim,
  'قرفصاء الكأس':         SquatAnim,
  'قرفصاء بالبار':        SquatAnim,
  // Push-ups
  'push-up':              PushUpAnim,
  'bench press':          PushUpAnim,
  'ضغط البنش':            PushUpAnim,
  'تمرين الضغط':          PushUpAnim,
  // Wall push-up
  'wall push-up':         WallPushUpAnim,
  'تمرين الضغط على الجدار': WallPushUpAnim,
  // Glute bridge
  'glute bridge':         GluteBridgeAnim,
  'جسر الأرداف':          GluteBridgeAnim,
  // Dead bug
  'dead bug':             DeadBugAnim,
  'الدودة الميتة':        DeadBugAnim,
  // Plank
  'plank':                PlankAnim,
  'بلانك':                PlankAnim,
  // Hinge
  'romanian deadlift':    HingeAnim,
  'deadlift':             HingeAnim,
  'رفع أرومانية':          HingeAnim,
  'رفع ميت':              HingeAnim,
  // Row
  'dumbbell row':         RowAnim,
  'تجديف بالدمبل':        RowAnim,
  // Pull-up
  'pull-up':              PullUpAnim,
  'سحب علوي':             PullUpAnim,
  // Press
  'overhead press':       PressAnim,
  'ضغط فوق الرأس':        PressAnim,
};

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
