import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Lang } from './types';
import { detectLang, saveLang, htmlLangAttr } from './detect';
import { zhCN } from './locales/zh-CN';
import { enUS } from './locales/en-US';

// 以中文字典为类型基准，确保两种语言结构一致
type Dict = typeof zhCN;

const DICTS: Record<Lang, Dict> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectLang());

  useEffect(() => {
    // 同步到 <html lang> 和 localStorage
    document.documentElement.lang = htmlLangAttr(lang);
    saveLang(lang);
  }, [lang]);

  const setLang = (next: Lang) => setLangState(next);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
