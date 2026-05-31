import React from 'react';
import { musclesFor } from '../lib/muscles';

/**
 * MuscleMap — anatomically-correct muscle highlighter.
 *
 * Glows EXACTLY the muscles declared in lib/muscles.js for an exercise, so
 * correctness is guaranteed by data (not by an AI image). Primary muscles glow
 * brightest, secondary dimmer. Two simplified body silhouettes (front + back);
 * we render whichever view shows the exercise's primary muscle.
 *
 * Colors follow the active theme: --orange (default) / violet (women's theme).
 */

const BASE = 'var(--muscle-base, rgba(245,239,232,0.16))';
const PRIMARY = 'var(--orange)';
const SECONDARY = 'var(--orange-dim, rgba(255,107,0,0.45))';

const fill = (key, primary, secondary) => {
  if (primary.includes(key)) return PRIMARY;
  if (secondary.includes(key)) return SECONDARY;
  return BASE;
};
const cls = (key, primary) => (primary.includes(key) ? 'mb-active' : undefined);

// ── Front-view muscle shapes (simplified, stylized) ──────────────────────────
const FrontBody = ({ primary, secondary }) => (
  <svg viewBox="0 0 120 200" width="100%" height="100%" aria-hidden="true">
    {/* silhouette */}
    <g fill="rgba(245,239,232,0.05)" stroke="rgba(245,239,232,0.18)" strokeWidth="1.2">
      <circle cx="60" cy="20" r="12" />
      <path d="M44 34 h32 l6 10 v40 l-6 26 h-32 l-6 -26 v-40 z" />
      <path d="M40 44 l-12 6 -6 34 8 4 14 -30 z" />
      <path d="M80 44 l12 6 6 34 -8 4 -14 -30 z" />
      <path d="M46 110 h12 l-2 64 h-12 z" />
      <path d="M74 110 h-12 l2 64 h12 z" />
    </g>
    {/* shoulders / delts */}
    <ellipse cx="40" cy="46" rx="9" ry="7" fill={fill('delts', primary, secondary)} className={cls('delts', primary)} />
    <ellipse cx="80" cy="46" rx="9" ry="7" fill={fill('delts', primary, secondary)} className={cls('delts', primary)} />
    {/* chest */}
    <path d="M46 50 h28 v18 q-14 8 -28 0 z" fill={fill('chest', primary, secondary)} className={cls('chest', primary)} />
    {/* biceps */}
    <ellipse cx="33" cy="66" rx="5.5" ry="12" fill={fill('biceps', primary, secondary)} className={cls('biceps', primary)} transform="rotate(12 33 66)" />
    <ellipse cx="87" cy="66" rx="5.5" ry="12" fill={fill('biceps', primary, secondary)} className={cls('biceps', primary)} transform="rotate(-12 87 66)" />
    {/* forearms */}
    <ellipse cx="26" cy="86" rx="4.5" ry="11" fill={fill('forearms', primary, secondary)} className={cls('forearms', primary)} transform="rotate(12 26 86)" />
    <ellipse cx="94" cy="86" rx="4.5" ry="11" fill={fill('forearms', primary, secondary)} className={cls('forearms', primary)} transform="rotate(-12 94 86)" />
    {/* abs */}
    <rect x="51" y="74" width="18" height="30" rx="5" fill={fill('abs', primary, secondary)} className={cls('abs', primary)} />
    {/* quads */}
    <path d="M47 112 h11 l-2 40 h-9 z" fill={fill('quads', primary, secondary)} className={cls('quads', primary)} />
    <path d="M73 112 h-11 l2 40 h9 z" fill={fill('quads', primary, secondary)} className={cls('quads', primary)} />
  </svg>
);

// ── Back-view muscle shapes ──────────────────────────────────────────────────
const BackBody = ({ primary, secondary }) => (
  <svg viewBox="0 0 120 200" width="100%" height="100%" aria-hidden="true">
    <g fill="rgba(245,239,232,0.05)" stroke="rgba(245,239,232,0.18)" strokeWidth="1.2">
      <circle cx="60" cy="20" r="12" />
      <path d="M44 34 h32 l6 10 v40 l-6 26 h-32 l-6 -26 v-40 z" />
      <path d="M40 44 l-12 6 -6 34 8 4 14 -30 z" />
      <path d="M80 44 l12 6 6 34 -8 4 -14 -30 z" />
      <path d="M46 110 h12 l-2 64 h-12 z" />
      <path d="M74 110 h-12 l2 64 h12 z" />
    </g>
    {/* rear delts */}
    <ellipse cx="40" cy="46" rx="9" ry="7" fill={fill('rearDelts', primary, secondary)} className={cls('rearDelts', primary)} />
    <ellipse cx="80" cy="46" rx="9" ry="7" fill={fill('rearDelts', primary, secondary)} className={cls('rearDelts', primary)} />
    {/* traps */}
    <path d="M50 36 h20 l-4 14 h-12 z" fill={fill('traps', primary, secondary)} className={cls('traps', primary)} />
    {/* lats */}
    <path d="M46 52 h28 l-4 26 q-10 6 -20 0 z" fill={fill('lats', primary, secondary)} className={cls('lats', primary)} />
    {/* mid back overlay */}
    <rect x="52" y="54" width="16" height="20" rx="4" fill={fill('midBack', primary, secondary)} className={cls('midBack', primary)} />
    {/* triceps */}
    <ellipse cx="33" cy="66" rx="5.5" ry="12" fill={fill('triceps', primary, secondary)} className={cls('triceps', primary)} transform="rotate(12 33 66)" />
    <ellipse cx="87" cy="66" rx="5.5" ry="12" fill={fill('triceps', primary, secondary)} className={cls('triceps', primary)} transform="rotate(-12 87 66)" />
    {/* glutes */}
    <path d="M48 104 h24 v14 q-12 8 -24 0 z" fill={fill('glutes', primary, secondary)} className={cls('glutes', primary)} />
    {/* hamstrings */}
    <path d="M47 120 h11 l-2 34 h-9 z" fill={fill('hamstrings', primary, secondary)} className={cls('hamstrings', primary)} />
    <path d="M73 120 h-11 l2 34 h9 z" fill={fill('hamstrings', primary, secondary)} className={cls('hamstrings', primary)} />
    {/* calves */}
    <ellipse cx="51" cy="166" rx="5" ry="11" fill={fill('calves', primary, secondary)} className={cls('calves', primary)} />
    <ellipse cx="69" cy="166" rx="5" ry="11" fill={fill('calves', primary, secondary)} className={cls('calves', primary)} />
  </svg>
);

/**
 * @param {string} img   exercise img id (key in lib/muscles.js)
 * @param {string} view  'front' | 'back' | 'auto' (default auto from primary muscle)
 */
const MuscleMap = ({ img, view = 'auto' }) => {
  const { primary, secondary } = musclesFor(img);
  const resolved = view === 'auto'
    ? (primary.some(m => ['triceps','traps','lats','midBack','rearDelts','glutes','hamstrings','calves'].includes(m)) ? 'back' : 'front')
    : view;

  return (
    <div className="muscle-map">
      {resolved === 'back'
        ? <BackBody primary={primary} secondary={secondary} />
        : <FrontBody primary={primary} secondary={secondary} />}
    </div>
  );
};

export default MuscleMap;
