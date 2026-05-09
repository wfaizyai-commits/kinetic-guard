import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ 
  title, 
  subtitle, 
  children, 
  warning = null 
}) => {
  return (
    <div className="kg-question">
      <div className="kg-question__header">
        <h2 className="kg-question__title">{title}</h2>
        {subtitle && <p className="kg-question__subtitle">{subtitle}</p>}
      </div>
      
      <div className="kg-question__content">
        {children}
      </div>
      
      {warning && (
        <div className="kg-question__warning">
          <span className="kg-question__warning-icon">⚠️</span>
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
