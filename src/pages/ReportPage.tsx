import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getReport, getWordDownloadUrl } from '../api';
import ScoreCard from '../components/ScoreCard';
import ReportSection from '../components/ReportSection';
import Paywall from '../components/Paywall';
import SEO from '../components/SEO';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useI18n } from '../i18n';
import type { FreeReport, FullReport, LockedSectionPreview } from '../types/report';

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, lang } = useI18n();
  const [rawReport, setRawReport] = useState<FreeReport | FullReport | null>(null);
  const [isFull, setIsFull] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lockedPreview, setLockedPreview] = useState<LockedSectionPreview[]>([]);

  // 报告由后端按 lang 返回（已翻译），直接作为渲染数据源
  const report = rawReport;

  useEffect(() => {
    if (id) {
      const alreadyPaid = sessionStorage.getItem(`aeo_paid_${id}`) === '1' || searchParams.get('paid') === '1';
      loadReport(id, alreadyPaid);
    }
  }, [id, lang]);

  async function loadReport(reportId: string, isPaid: boolean = false) {
    setLoading(true);
    setError('');
    try {
      const res = await getReport(reportId, isPaid ? 'full' : 'free', lang);
      setRawReport(res.data);
      setIsFull(res.is_full);
      setLockedPreview(res.locked_preview || []);
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
  const coreJudgment = report.part1_core_judgment;
  const advantages = report.part2_advantages;
  const problems = report.part3_problems;
  const contentCoverage = report.part4_content_coverage;
  const terms = t.reportTerms;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.report.seoTitle(meta.site_name)}
        description={t.report.seoDesc(meta.site_name, meta.total_score, meta.grade)}
        canonical={`https://aeo.miubox.cn/report/${id}`}
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
                href={getWordDownloadUrl(id!, lang)}
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

        {/* Part 1: Core Judgment */}
        <ReportSection title={coreJudgment.title}>
          {/* 总分概述 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-4">
            <p className="text-2xl font-bold text-blue-700">{coreJudgment.overview_score}</p>
          </div>

          {/* 概况 */}
          <p className="text-gray-600 mb-4">{coreJudgment.summary}</p>

          {/* 核心判断 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-yellow-800 mb-1">{terms.coreJudgmentLabel}</p>
            <p className="text-yellow-700 text-sm">{coreJudgment.judgment}</p>
          </div>

          {/* 维度总结 */}
          {coreJudgment.dimension_summary.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-700 mb-2">{terms.dimensionSummaryLabel}</p>
              <ul className="space-y-1">
                {coreJudgment.dimension_summary.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 优先行动 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-green-800 mb-1">{terms.priorityActionLabel}</p>
            <p className="text-green-700 text-sm">{coreJudgment.priority_action}</p>
          </div>

          {/* 维度表格 */}
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
                {coreJudgment.dimensions.map((dim, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium text-gray-700">{dim.name}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{dim.weight}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${dim.score >= 70 ? 'text-green-600' : dim.score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {dim.score}/{dim.max_score}
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

        {/* Part 4: Content-Type Coverage (NEW in v2) */}
        <ReportSection title={contentCoverage.title}>
          <p className="text-gray-600 text-sm mb-4">{contentCoverage.description}</p>
          <div className="bg-blue-50 rounded-xl px-4 py-2 mb-4 flex items-center gap-2">
            <span className="text-blue-700 font-bold text-sm">
              {terms.coverageLabel}: {contentCoverage.covered_count}/{contentCoverage.total_count}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contentCoverage.content_types.map((ct, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border ${ct.covered ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{ct.covered ? '✅' : '❌'}</span>
                  <span className={`font-bold text-sm ${ct.covered ? 'text-green-800' : 'text-gray-500'}`}>
                    {ct.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{ct.description}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  ct.priority === '高' || ct.priority === 'High'
                    ? 'bg-red-100 text-red-700'
                    : ct.priority === '中' || ct.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {terms.priorityLabel}: {ct.priority}
                </span>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* 未解锁章节预览：展示标题 + 近 3 行内容，其余加遮罩隐藏并提示解锁 */}
        {!isFull && lockedPreview.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 px-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t.report.lockedPreviewTitle}
            </h2>
            {lockedPreview.map((sec) => (
              <LockedTeaser key={sec.key} section={sec} onUnlock={() => navigate(`/payment/${id}`)} />
            ))}
          </div>
        )}

        {/* Paywall */}
        {!isFull && (
          <Paywall onPayClick={() => navigate(`/payment/${id}`)} />
        )}

        {/* Full report sections */}
        {isFull && (
          <>
            {/* Part 5: Opportunities (Persona × Funnel × Use Case) */}
            {('part5_opportunities' in report) && (
              <ReportSection title={(report as FullReport).part5_opportunities.title}>
                <p className="text-gray-600 text-sm mb-4">{(report as FullReport).part5_opportunities.description}</p>
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
                      {(report as FullReport).part5_opportunities.scenarios.map((sc, i) => (
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

            {/* Part 6: Priority Pages */}
            {('part6_priority_pages' in report) && (
              <ReportSection title={(report as FullReport).part6_priority_pages.title}>
                <p className="text-gray-600 text-sm mb-4">{(report as FullReport).part6_priority_pages.description}</p>
                {(report as FullReport).part6_priority_pages.groups.map((group, gi) => (
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
                    {(report as FullReport).part6_priority_pages.top5.join(lang === 'zh-CN' ? '、' : ', ')}
                  </p>
                </div>
              </ReportSection>
            )}

            {/* Part 7: Page Template */}
            {('part7_page_template' in report) && (
              <ReportSection title={(report as FullReport).part7_page_template.title}>
                <p className="text-gray-600 text-sm mb-4">{(report as FullReport).part7_page_template.description}</p>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3">
                    {t.report.examplePageLabel}
                    {(report as FullReport).part7_page_template.example.page_title}
                  </h4>
                  <div className="space-y-2">
                    {(report as FullReport).part7_page_template.example.structure.map((item, i) => {
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
                  {/* Eight Elements Checklist */}
                  {(() => {
                    const eightElements = (report as FullReport).part7_page_template.example.eight_elements;
                    if (!eightElements) return null;
                    return (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs font-bold text-green-800 mb-2">
                        {terms.eightElementsLabel}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {eightElements.map((el, i) => (
                          <span key={i} className="text-xs text-green-700">✅ {el}</span>
                        ))}
                      </div>
                    </div>
                    );
                  })()}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-bold text-blue-800 mb-1">
                      {t.report.geoTemplateLabel}
                    </p>
                    <p className="text-xs text-blue-700">{(report as FullReport).part7_page_template.example.geo_template}</p>
                  </div>
                </div>
              </ReportSection>
            )}

            {/* Part 8: Technical */}
            {('part8_technical' in report) && (
              <ReportSection title={(report as FullReport).part8_technical.title}>
                {('summary' in (report as FullReport).part8_technical) && (report as FullReport).part8_technical.summary && (
                  <p className="text-sm text-gray-600 mb-3">{(report as FullReport).part8_technical.summary}</p>
                )}
                <ul className="space-y-2">
                  {(report as FullReport).part8_technical.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">🔧</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ReportSection>
            )}

            {/* Part 10: GEO Technical Checklist */}
            {('part10_geo_checklist' in report) && (() => {
              const geo = (report as FullReport).part10_geo_checklist;
              return (
                <ReportSection title={geo.title}>
                  <div className="mb-4 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 p-4">
                    <p className="text-sm text-gray-700">{geo.principle}</p>
                    <p className="mt-2 text-sm font-bold text-emerald-700">
                      {t.report.geoScoreLabel.replace('{score}', String(geo.geo_score)).replace('{passed}', String(geo.passed_count)).replace('{total}', String(geo.auto_count))}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {geo.sections.map((sec, i) => {
                      const badge = sec.status === 'pass'
                        ? { text: t.report.geoPass, cls: 'bg-emerald-100 text-emerald-700' }
                        : sec.status === 'fail'
                        ? { text: t.report.geoFail, cls: 'bg-red-100 text-red-700' }
                        : { text: t.report.geoManual, cls: 'bg-amber-100 text-amber-700' };
                      return (
                        <div key={i} className="border border-gray-100 rounded-xl p-3">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-gray-800 text-sm">{sec.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.text}</span>
                          </div>
                          {sec.findings.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {sec.findings.map((f, j) => (
                                <li key={j} className="text-xs text-gray-600 flex items-start gap-1">
                                  <span className="text-gray-400 mt-0.5">•</span>{f}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ReportSection>
              );
            })()}

            {/* Part 9: Measurement */}
            {('part9_measurement' in report) && (
              <ReportSection title={(report as FullReport).part9_measurement.title}>
                <p className="text-gray-600 text-sm mb-4">{(report as FullReport).part9_measurement.description}</p>
                {(report as FullReport).part9_measurement.dimensions.map((dim, i) => (
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

            {/* Download button at bottom */}
            <div className="text-center py-6">
              <a
                href={getWordDownloadUrl(id!, lang)}
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

/** 未解锁章节的预览卡片：展示标题与近 3 行内容，其余内容加遮罩隐藏并提示解锁 */
function LockedTeaser({ section, onUnlock }: { section: LockedSectionPreview; onUnlock: () => void }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        {section.title}
      </h3>
      <ul className="space-y-1 mb-3">
        {section.preview.map((line, i) => (
          <li key={i} className="text-sm text-gray-500 leading-relaxed">{line}</li>
        ))}
      </ul>
      {/* 遮罩隐藏的剩余内容 + 解锁提示 */}
      <div className="relative">
        <div className="space-y-2 opacity-30 select-none pointer-events-none">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/0 via-white/60 to-white/95">
          <button
            onClick={onUnlock}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t.report.lockedPreviewHint}
          </button>
        </div>
      </div>
    </div>
  );
}
