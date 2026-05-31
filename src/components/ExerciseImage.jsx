import { useState, useEffect } from 'react';
import MuscleMap from './MuscleMap';
import './ExerciseImage.css';

/**
 * ExerciseImage — Lyfta-style exercise visual.
 *
 * Resolution order (per exercise `img` id, files live in /public/exercises/):
 *   1. TWO frames  <id>.(webp|png|jpg) + <id>_2.(webp|png|jpg)
 *        → crossfade-loop them → reads as the rep MOVING (start ↔ end).
 *   2. ONE frame   <id>.(webp|png|jpg)
 *        → static illustration.
 *   3. none        → anatomically-correct MuscleMap fallback.
 *
 * Backward compatible: today's single Day-1 images keep working as frame 1.
 * Add a `<id>_2` "opposite end of the rep" pose later to animate, zero code change.
 */

const EXTS = ['webp', 'png', 'jpg', 'jpeg'];
const frameUrls = (id, suffix = '') =>
  id ? EXTS.map((e) => `/exercises/${id}${suffix}.${e}`) : [];

const probe = (url) =>
  new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(url);
    im.onerror = () => resolve(null);
    im.src = url;
  });

const firstThatLoads = async (urls) => {
  for (const u of urls) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await probe(u);
    if (ok) return ok;
  }
  return null;
};

const ExerciseImage = ({ img, exerciseName }) => {
  const [mode, setMode] = useState('detecting'); // detecting | animate | single | map
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setMode('detecting');
    (async () => {
      const first = await firstThatLoads(frameUrls(img));
      if (cancelled) return;
      if (!first) { setMode('map'); return; }
      const second = await firstThatLoads(frameUrls(img, '_2'));
      if (cancelled) return;
      setF1(first);
      if (second) { setF2(second); setMode('animate'); }
      else setMode('single');
    })();
    return () => { cancelled = true; };
  }, [img]);

  // While probing, show the muscle map (never blank, never wrong movement).
  if (mode === 'detecting' || mode === 'map') {
    return <MuscleMap img={img} />;
  }

  if (mode === 'single') {
    return <img src={f1} alt={exerciseName || ''} loading="lazy" className="exercise-image" />;
  }

  // Two-frame crossfade loop
  return (
    <div className="exercise-anim" aria-label={exerciseName || ''}>
      <img src={f1} alt="" className="exercise-anim__frame exercise-anim__frame--1" />
      <img src={f2} alt="" className="exercise-anim__frame exercise-anim__frame--2" />
    </div>
  );
};

export default ExerciseImage;
