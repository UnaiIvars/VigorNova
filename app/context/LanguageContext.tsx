"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Language } from '../i18n/dictionaries';

type LanguageContextType = {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: keyof typeof dictionaries['es']) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem('vigornova_lang') as Language;
    if (storedLang && (storedLang === 'es' || storedLang === 'en')) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('vigornova_lang', lang);
  };

  const t = (key: keyof typeof dictionaries['es']): string => {
    if (!mounted) return dictionaries['es'][key] || key;
    return dictionaries[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
