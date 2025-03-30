
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
export type Language = 'en' | 'zh-TW' | 'zh-CN';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default language
const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'household-harbor-language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE as Language);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language || DEFAULT_LANGUAGE;
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    // Save language preference to localStorage when it changes
    localStorage.setItem(STORAGE_KEY, language);
    
    // Load translations based on language
    import(`../translations/${language}.ts`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => {
        console.error(`Error loading translations for ${language}:`, error);
        // Fallback to English
        import('../translations/en.ts')
          .then((module) => setTranslations(module.default))
          .catch((e) => console.error('Error loading fallback translations:', e));
      });
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
