import React from 'react';
import './OptionButton.css';

const OptionButton = ({ label, selected, onClick, icon, disabled = false }) => {
  return (
    <button
      className={['kg-option', selected ? 'kg-option--selected' : ''].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon && <span className="kg-option__icon">{icon}</span>}
      <span className="kg-option__label">{label}</span>
      <span className="kg-option__check">
        {selected && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#00E5FF" />
            <path d="M4.5 8L7 10.5L11.5 6" stroke="#08080E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {!selected && <span className="kg-option__circle" />}
      </span>
    </button>
  );
};

export default OptionButton;
