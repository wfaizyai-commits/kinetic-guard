import React from 'react';
import './Button.css';

const addRipple = (e) => {
  const btn    = e.currentTarget;
  const circle = document.createElement('span');
  const d      = Math.max(btn.clientWidth, btn.clientHeight);
  const rect   = btn.getBoundingClientRect();
  circle.className = 'ripple-wave';
  circle.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px`;
  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  ...props
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading) { addRipple(e); onClick?.(e); }
  };

  return (
    <button
      className={[
        'kg-btn',
        'btn-ripple',
        `kg-btn--${variant}`,
        `kg-btn--${size}`,
        fullWidth ? 'kg-btn--full' : '',
        loading ? 'kg-btn--loading' : '',
        className
      ].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <span className="kg-btn__spinner" />
      ) : (
        <>
          {icon && <span className="kg-btn__icon">{icon}</span>}
          <span className="kg-btn__label">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
