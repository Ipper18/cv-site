"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "pl" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isTyping: boolean;
  triggerTyping: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const storageKey = "cv-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pl");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(storageKey) as Language | null) : null;
    if (stored === "pl" || stored === "en") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, language);
  }, [language]);

  const triggerTyping = () => {
    setIsTyping(true);
    window.setTimeout(() => setIsTyping(false), 650);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: (lang: Language) => {
        triggerTyping();
        setLanguage(lang);
      },
      toggleLanguage: () => {
        triggerTyping();
        setLanguage((prev) => (prev === "pl" ? "en" : "pl"));
      },
      isTyping,
      triggerTyping,
    }),
    [language, isTyping],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}
