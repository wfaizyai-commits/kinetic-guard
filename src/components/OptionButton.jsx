import React from 'react';
import { COLORS } from '../constants/brand';
import './OptionButton.css';

const OptionButton = ({ 
  children, 
  selected, 
  onClick, 
  icon,
  disabled = false 
}) => {
  return (
    <button 
      className={`option-btn ${selected ? 'option-btn--selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="option-btn__icon">{icon}</span>}
      <span className="option-btn__label">{children}</span>
    </button>
  );
};

export default OptionButton;
