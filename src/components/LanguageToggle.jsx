import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { t, toggleLanguage } = useLanguage();
  return (
    <button className="lang-toggle" onClick={toggleLanguage} type="button">
      <span className="lang-toggle__globe">🌐</span>
      <span className="lang-toggle__text">{t.language.toggle}</span>
    </button>
  );
};

export default LanguageToggle;
