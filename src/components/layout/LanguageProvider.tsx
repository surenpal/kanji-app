"use client";

import { createContext, useContext, useState } from "react";

export type Lang = "en" | "ne";

const LangContext = createContext<{
  lang: Lang;
  toggleLang: () => void;
}>({ lang: "en", toggleLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ne" : "en"));

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
