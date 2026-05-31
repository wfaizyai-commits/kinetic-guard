import React, { useState } from 'react';
import MuscleMap from './MuscleMap';
import { exerciseImageCandidates } from '../lib/workoutSplits';

/**
 * ExerciseImage — shows an illustrated exercise image when one exists at
 * /public/exercises/<img>.(webp|png|jpg); otherwise falls back to the
 * anatomically-correct MuscleMap (NOT a generic animation, which would show
 * the wrong movement). So the gym split looks right immediately, and gains
 * real illustrations later with zero code changes (just drop files in).
 *
 * Props:
 *   img          – image id (e.g. 'bench_press') — also keys the muscle map
 *   exerciseName – alt text
 */
const ExerciseImage = ({ img, exerciseName }) => {
  const candidates = exerciseImageCandidates(img);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);

  if (failed) {
    return <MuscleMap img={img} />;
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
