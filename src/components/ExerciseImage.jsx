import React, { useState } from 'react';
import ExerciseAnimation from './ExerciseAnimation';
import { exerciseImageCandidates } from '../lib/workoutSplits';

/**
 * ExerciseImage — shows an illustrated exercise image when one exists at
 * /public/exercises/<img>.(webp|png|jpg); otherwise falls back to the animated
 * Muscle Blueprint character. This lets the gym split ship now and gain
 * illustrations later with zero code changes (just drop files into the folder).
 *
 * Props:
 *   img          – image id (e.g. 'bench_press')
 *   exerciseName – name passed to the blueprint fallback animation
 */
const ExerciseImage = ({ img, exerciseName }) => {
  const candidates = exerciseImageCandidates(img);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);

  if (failed) {
    return <ExerciseAnimation exerciseName={exerciseName} />;
  }

  return (
    <img
      src={candidates[idx]}
      alt={exerciseName || ''}
      loading="lazy"
      className="exercise-image"
      onError={() => {
        if (idx + 1 < candidates.length) setIdx(idx + 1);
        else setFailed(true);
      }}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
};

export default ExerciseImage;
