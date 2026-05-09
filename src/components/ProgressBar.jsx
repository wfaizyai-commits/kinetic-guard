import React from 'react';
import { COLORS } from '../constants/brand';
import './ProgressBar.css';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="kg-progress">
      <div className="kg-progress__header">
        <span className="kg-progress__label">Safety Audit Progress</span>
        <span className="kg-progress__count">{current} of {total}</span>
      </div>
      <div className="kg-progress__track">
        <div 
          className="kg-progress__bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
