import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { COPY, type Lang, type Copy } from '../lib/i18n'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Copy
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('nn')
  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, t: COPY[lang] }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
