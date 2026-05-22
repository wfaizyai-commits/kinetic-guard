import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total, label }) => {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="kg-progress">
      {label && (
        <div className="kg-progress__header">
          <span className="kg-progress__label">{label}</span>
          <span className="kg-progress__count">
            {current} / {total}
          </span>
        </div>
      )}
      <div className="kg-progress__track">
        <div
          className="kg-progress__fill"
          style={{ width: `${percent}%` }}
        />
        <div
          className="kg-progress__glow"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
