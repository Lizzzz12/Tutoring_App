// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationKA from './locales/ka/translation.json';

const resources = {
  en: { translation: translationEN },
  ka: { translation: translationKA },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en', // load saved language or default to 'en'
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Save language changes to localStorage automatically
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
