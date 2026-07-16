import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getReport, getWordDownloadUrl } from '../api';
import ScoreCard from '../components/ScoreCard';
import ReportSection from '../components/ReportSection';
import Paywall from '../components/Paywall';
import SEO from '../components/SEO';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../i18n';
import { translateReport } from '../i18n/translateReport';
import type { FreeReport, FullReport } from '../types/report';

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, lang } = useI18n();
  const [rawReport, setRawReport] = useState<FreeReport | FullReport | null>(null);
  const [isFull, setIsFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 根据当前语言翻译后的报告（切换语言时自动更新）
  const report = useMemo(() => {
    if (!rawReport) return null;
    return translateReport(rawReport, t.reportTerms as any, lang);
  }, [rawReport, t.reportTerms, lang]);

  useEffect(() => {
    if (id) {
      const alreadyPaid = sessionStorage.getItem(`aeo_paid_${id}`) === '1' || searchParams.get('paid') === '1';
      loadReport(id, alreadyPaid);
    }
  }, [id]);

  async function loadReport(reportId: string, isPaid: boolean = false) {
    setLoading(true);
    setError('');
    try {
      const res = await getReport(reportId, isPaid ? 'full' : 'free');
      setRawReport(res.data); // 存原始数据
      setIsFull(res.is_full);
      if (isPaid && res.is_full) {
        sessionStorage.setItem(`aeo_paid_${reportId}`, '1');
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || t.report.loadError);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error || t.common.reportNotFound}</p>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline cursor-pointer">{t.common.backToHome}</button>
      </div>
    );
  }

  const meta = report.meta;
  const overview = report.part1_overview;
  const advantages = report.part2_advantages;
  const problems = report.part3_problems;
  const terms = t.reportTerms;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.report.seoTitle(meta.site_name)}
        description={t.report.seoDesc(meta.site_name, meta.total_score, meta.grade)}
        canonical={`https://aeo.miubox.com/report/${id}`}
      />
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap">
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.common.back}
          </button>
          <h1 className="text-lg font-bold text-gray-800 truncate max-w-xs">{meta.site_name}</h1>
          <div className="flex items-center gap-2 whitespace-nowrap">
            {isFull && (
              <a
                href={getWordDownloadUrl(id!)}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {t.report.downloadWord}
              </a>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Score */}
        <ScoreCard score={meta.total_score} grade={meta.grade} siteName={meta.site_name} />

        {/* Part 1: Overview — 使用翻译后的表头 */}
        <ReportSection title={overview.title}>
          <p className="text-gray-600 mb-4">{overview.summary}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2 text-left rounded-l-lg">{terms.thDimension}</th>
                  <th className="px-4 py-2 text-center">{terms.thWeight}</th>
                  <th className="px-4 py-2 text-center">{terms.thScore}</th>
                  <th className="px-4 py-2 text-left rounded-r-lg">{terms.thKeyFinding}</th>
                </tr>
              </thead>
              <tbody>
                {overview.dimensions.map((dim, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium text-gray-700">{dim.name}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{dim.weight}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${dim.score >= 70 ? 'text-green-600' : dim.score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {dim.score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{dim.key_finding}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>

        {/* Part 2: Advantages */}
        <ReportSection title={advantages.title}>
          <ul className="space-y-2">
            {advantages.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✅</span>
                {item}
              </li>
            ))}
          </ul>
        </ReportSection>

        {/* Part 3: Problems */}
        <ReportSection title={problems.title}>
          <div className="space-y-4">
            {problems.problems.map((prob) => (
              <div key={prob.id} className="bg-red-50 border border-red-100 rounded-xl p-4">
                <h4 className="font-bold text-red-800 text-sm mb-1">{prob.title}</h4>
                <p className="text-red-600 text-xs">{prob.detail}</p>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* Paywall */}
        {!isFull && (
          <Paywall onPayClick={() => navigate(`/payment/${id}`)} />
        )}

        {/* Full report sections */}
        {isFull && (
          <>
            {/* Part 4: Opportunities */}
            {('part4_content_opportunities' in report) && (
              <ReportSection title={(report as FullReport).part4_content_opportunities.title}>
                <p className="text-gray-600 text-sm mb-4">{(report as FullReport).part4_content_opportunities.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-3 py-2 text-left rounded-l-lg">{terms.thPersona}</th>
                        <th className="px-3 py-2 text-center">{terms.thFunnel}</th>
                        <th className="px-3 py-2 text-left">{terms.thUseCase}</th>
                        <th className="px-3 py-2 text-left">{terms.thAIQuestion}</th>
                        <th className="px-3 py-2 text-left rounded-r-lg">{terms.thRecommendedPage}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(report as FullReport).part4_content_opportunities.scenarios.map((sc, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-3 py-2 font-medium text-gray-700">{sc.persona}</td>
                          <td className="px-3 py-2 text-center text-gray-500">{sc.funnel}</td>
                          <td className="px-3 py-2 text-gray-500">{sc.use_case}</td>
                          <td className="px-3 py-2 text-gray-500">{sc.ai_question}</td>
                          <td className="px-3 py-2 text-blue-600">{sc.page}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ReportSection>
            )}

            {/* Part 5: Priority Pages */}
            {('part5_priority_pages' in report) && (
              <ReportSection title={(report as FullReport).part5_priority_pages.title}>
                {(report as FullReport).part5_priority_pages.groups.map((group, gi) => (
                  <div key={gi} className="mb-4">
                    <h4 className="font-bold text-blue-700 text-sm mb-2">{group.name}</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-2">
                      {group.pages.map((page, pi) => (
                        <li key={pi}>{page}</li>
                      ))}
                    </ol>
                  </div>
                ))}
                <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <p className="font-bold text-blue-800 text-sm">
                    {t.report.top5Label}
                    {(report as FullReport).part5_priority_pages.top5.join(lang === 'zh-CN' ? '、' : ', ')}
                  </p>
                </div>
              </ReportSection>
            )}

            {/* Part 6: Template */}
            {('part6_page_template' in report) && (
              <ReportSection title={(report as FullReport).part6_page_template.title}>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3">
                    {t.report.examplePageLabel}
                    {(report as FullReport).part6_page_template.example.page_title}
                  </h4>
                  <div className="space-y-2">
                    {(report as FullReport).part6_page_template.example.structure.map((item, i) => {
                      const isComparison = item.level === '对比表' || item.level === 'Comparison Table';
                      return (
                        <div key={i} className="text-sm">
                          {item.level === 'H1' && <p className="font-bold text-blue-700">📌 {item.content}</p>}
                          {item.level === 'H2' && <p className="text-gray-600 ml-4">• {item.content}</p>}
                          {isComparison && <p className="text-gray-500 ml-4 italic">📊 {item.content}</p>}
                          {item.level !== 'H1' && item.level !== 'H2' && !isComparison && (
                            <p className="text-gray-600 ml-4">{item.content}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-bold text-blue-800 mb-1">
                      {t.report.geoTemplateLabel}
                    </p>
                    <p className="text-xs text-blue-700">{(report as FullReport).part6_page_template.example.geo_template}</p>
                  </div>
                </div>
              </ReportSection>
            )}

            {/* Part 7: Technical */}
            {('part7_technical_suggestions' in report) && (
              <ReportSection title={(report as FullReport).part7_technical_suggestions.title}>
                <ul className="space-y-2">
                  {(report as FullReport).part7_technical_suggestions.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">🔧</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ReportSection>
            )}

            {/* Part 8: Measurement */}
            {('part8_measurement' in report) && (
              <ReportSection title={(report as FullReport).part8_measurement.title}>
                <p className="text-gray-600 text-sm mb-4">{(report as FullReport).part8_measurement.description}</p>
                {(report as FullReport).part8_measurement.dimensions.map((dim, i) => (
                  <div key={i} className="mb-4 bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{dim.name}</h4>
                    <p className="text-gray-500 text-xs mb-2">{dim.description}</p>
                    <div className="space-y-1">
                      {dim.prompts.map((p, j) => (
                        <p key={j} className="text-xs text-gray-400 pl-3 border-l-2 border-blue-200">{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </ReportSection>
            )}

            {/* Part 9: Conclusion */}
            {('part9_conclusion' in report) && (
              <ReportSection title={(report as FullReport).part9_conclusion.title}>
                <p className="font-bold text-gray-800 mb-2">{(report as FullReport).part9_conclusion.overview}</p>
                <p className="text-gray-600 text-sm mb-3">{(report as FullReport).part9_conclusion.action}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm font-medium">{(report as FullReport).part9_conclusion.summary}</p>
                </div>
              </ReportSection>
            )}

            {/* Download button at bottom */}
            <div className="text-center py-6">
              <a
                href={getWordDownloadUrl(id!)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.report.downloadWord}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
