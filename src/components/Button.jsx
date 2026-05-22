import React from 'react';
import './Button.css';

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
  return (
    <button
      className={[
        'kg-btn',
        `kg-btn--${variant}`,
        `kg-btn--${size}`,
        fullWidth ? 'kg-btn--full' : '',
        loading ? 'kg-btn--loading' : '',
        className
      ].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
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
