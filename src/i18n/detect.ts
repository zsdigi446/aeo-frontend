import { DEFAULT_LANG, type Lang } from './types';

const STORAGE_KEY = 'aeo_lang';

/**
 * 语言检测优先级：
 * 1. localStorage 中用户手动选择
 * 2. 浏览器语言：包含 zh（不论 zh-CN / zh-TW / zh-Hans）-> 中文
 * 3. 其他所有语言（含 en 及其他）-> 默认英文
 */
export function detectLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;

  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === 'zh-CN' || saved === 'en-US') return saved;

  const nav = (navigator.language || navigator.languages?.[0] || '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh-CN';

  return DEFAULT_LANG;
}

export function saveLang(lang: Lang): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, lang);
}

/** 将语言映射到 <html lang> 属性值 */
export function htmlLangAttr(lang: Lang): string {
  return lang === 'zh-CN' ? 'zh-CN' : 'en';
}
