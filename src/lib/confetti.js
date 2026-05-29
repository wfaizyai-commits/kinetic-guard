/**
 * confetti.js — lightweight canvas confetti for FitGuard celebrations
 */
export const launchConfetti = (targetEl) => {
  const existing = targetEl?.querySelector?.('.fg-confetti-canvas');
  if (existing) existing.remove();

  const canvas = document.createElement('canvas');
  canvas.className = 'fg-confetti-canvas';
  canvas.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    pointer-events:none; z-index:99999;
  `;
  document.body.appendChild(canvas);
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx    = canvas.getContext('2d');
  const colors = ['#FF6B00','#FFB800','#FF4D6D','#00FF88','#B06AFF','#ffffff','#FF8C38'];
  const count  = 100;

  const pieces = Array.from({ length: count }, () => ({
    x:     Math.random() * canvas.width,
    y:     -20 - Math.random() * 60,
    vx:    (Math.random() - 0.5) * 6,
    vy:    3 + Math.random() * 5,
    rot:   Math.random() * 360,
    vrot:  (Math.random() - 0.5) * 12,
    w:     7 + Math.random() * 9,
    h:     4 + Math.random() * 7,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    shape: Math.random() > 0.4 ? 'rect' : 'circle',
  }));

  let raf;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vrot;
      p.vy  += 0.15;
      if (p.y > canvas.height * 0.7) p.alpha = Math.max(0, p.alpha - 0.025);
      if (p.y < canvas.height + 30 && p.alpha > 0) alive = true;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    if (alive) raf = requestAnimationFrame(draw);
    else canvas.remove();
  };

  cancelAnimationFrame(raf);
  draw();
};
