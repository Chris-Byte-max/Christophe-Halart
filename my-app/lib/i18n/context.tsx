'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import fr, { Translations } from './fr';
import nl from './nl';

type Language = 'fr' | 'nl';
interface I18nContextValue { lang: Language; t: Translations; setLang: (lang: Language) => void; }
const I18nContext = createContext<I18nContextValue | null>(null);
const translations: Record<Language, Translations> = { fr, nl };

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');
  const setLang = useCallback((newLang: Language) => setLangState(newLang), []);
  return <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
