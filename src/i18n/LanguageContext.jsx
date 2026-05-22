import React, { createContext, useContext, useState } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const toggleLanguage = () => setLang(l => l === 'en' ? 'ar' : 'en');
  return (
    <LanguageContext.Provider value={{ lang, t, isRTL, toggleLanguage }}>
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
