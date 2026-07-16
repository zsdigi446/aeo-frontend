import { useI18n, LANGS, LANG_LABELS, type Lang } from '../i18n';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div
      className="inline-flex items-center rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden text-sm font-medium"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((code: Lang) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {LANG_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
