export type Lang = 'zh-CN' | 'en-US';

export const LANGS: Lang[] = ['zh-CN', 'en-US'];

// 中英文以外默认英文
export const DEFAULT_LANG: Lang = 'en-US';

export const LANG_LABELS: Record<Lang, string> = {
  'zh-CN': '中文',
  'en-US': 'EN',
};
