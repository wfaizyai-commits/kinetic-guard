import React from 'react';
import { COLORS } from '../constants/brand';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  size = 'medium',
  icon: Icon,
  fullWidth = false
}) => {
  const classNames = [
    'kg-button',
    `kg-button--${variant}`,
    `kg-button--${size}`,
    fullWidth ? 'kg-button--full' : '',
    disabled ? 'kg-button--disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classNames} 
      onClick={onClick} 
      disabled={disabled}
    >
      {Icon && <Icon className="kg-button__icon" size={20} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
