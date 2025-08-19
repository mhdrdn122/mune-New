import { createContext, useEffect, useState } from 'react';

export const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  // const [language, setLanguage] = useState("ar"); // default language is English
  const [language, setLanguage] = useState(localStorage.getItem('language') );
  
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);
  
  const toggleLanguage = (lan) => {
    setLanguage(lan);
    localStorage.setItem("language", lan);
  };
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
