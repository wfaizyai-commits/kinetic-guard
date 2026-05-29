/**
 * countUp.js — animated number counter for FitGuard stats
 */
import { useEffect, useRef, useState } from 'react';

/**
 * React hook: animates a number from 0 → target when `trigger` becomes true.
 * @param {number} target   — final value to count up to
 * @param {number} duration — animation duration in ms (default 1200)
 * @param {boolean} trigger — start animation when this turns true
 */
export const useCountUp = (target, duration = 1200, trigger = true) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const start   = performance.now();
    const animate = (now) => {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(ease * target));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, trigger]);

  return value;
};

/**
 * Plain JS count-up — animates a DOM element's textContent.
 * @param {HTMLElement} el
 * @param {number} target
 * @param {number} duration
 */
export const countUpEl = (el, target, duration = 1000) => {
  if (!el) return;
  const start   = performance.now();
  const animate = (now) => {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (t < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};
