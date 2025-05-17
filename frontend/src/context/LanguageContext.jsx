// src/context/LanguageContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '/config/axiosConfig'; // Adjust this to your axios configuration

// Create Language Context
export const LanguageContext = createContext();

// Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [content, setContent] = useState({});

  // Fetch translations based on the selected language
  const fetchTexts = async (lang) => {
    try {
      const response = await axios.post(`/public/texts`, { lang });
      setContent(response.data.translations);
    } catch (error) {
      console.error('Error fetching texts:', error);
    }
  };

  useEffect(() => {
  //  fetchTexts(language); // Fetch texts whenever language changes
  }, [language]);

  // Change language and update localStorage
  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, content, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
