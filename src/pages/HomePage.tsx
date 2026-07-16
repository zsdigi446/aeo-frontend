import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import UrlInput from '../components/UrlInput';
import LoadingAnalysis from '../components/LoadingAnalysis';
import LanguageSwitcher from '../components/LanguageSwitcher';
import SEO from '../components/SEO';
import { analyzeUrl } from '../api';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

  async function handleSubmit(url: string) {
    setIsLoading(true);
    setError('');
    try {
      const res = await analyzeUrl(url);
      navigate(`/report/${res.report_id}`);
    } catch (e: any) {
      const detail = e?.response?.data?.detail;
      setError(detail || t.report.analyzeError);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4" role="main">
        <LoadingAnalysis />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <SEO />
      {/* 顶部语言切换 */}
      <div className="absolute top-4 right-4 z-40">
        <LanguageSwitcher />
      </div>

      {/* Hero */}
      <header className="pt-20 pb-16 px-4 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            {t.home.badge}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {t.home.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          {t.home.subtitle}
        </p>

        <UrlInput onSubmit={handleSubmit} isLoading={false} />

        {error && (
          <div className="mt-4 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400">
          {t.home.supportNote}
        </p>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20" aria-label={t.home.featuresTitle}>
        <h2 className="sr-only">{t.home.featuresTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <article className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t.home.f1Title}</h3>
            <p className="text-gray-500 text-sm">{t.home.f1Desc}</p>
          </article>
          <article className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t.home.f2Title}</h3>
            <p className="text-gray-500 text-sm">{t.home.f2Desc}</p>
          </article>
          <article className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t.home.f3Title}</h3>
            <p className="text-gray-500 text-sm">{t.home.f3Desc}</p>
          </article>
        </div>
      </section>

      {/* Value Prop */}
      <section className="bg-white py-16 px-4" aria-label={t.home.freeVsFull}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {t.home.vpTitle}
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            {t.home.vpDesc}
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-2">{t.home.freeTitle}</h3>
              <ul className="text-sm text-gray-500 space-y-1.5">
                {t.home.freeIncluded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
                {t.home.freeLocked.map((item, i) => (
                  <li key={`locked-${i}`} className="text-gray-300 line-through">{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
              <h3 className="font-bold text-gray-800 mb-2">{t.home.paidTitle}</h3>
              <ul className="text-sm text-gray-500 space-y-1.5">
                {t.home.paidIncluded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-400" role="contentinfo">
        <p>{t.home.footerText}</p>
        <p className="mt-1">
          <a href="/sitemap.xml" className="text-blue-500 hover:text-blue-700" title={t.home.sitemap}>{t.home.sitemap}</a>
        </p>
      </footer>
    </div>
  );
}
