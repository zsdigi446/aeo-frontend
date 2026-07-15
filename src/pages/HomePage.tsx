import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlInput from '../components/UrlInput';
import LoadingAnalysis from '../components/LoadingAnalysis';
import { analyzeUrl } from '../api';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(url: string) {
    setIsLoading(true);
    setError('');
    try {
      const res = await analyzeUrl(url);
      navigate(`/report/${res.report_id}`);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || '分析失败，请检查网址是否正确或稍后重试';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <LoadingAnalysis />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero */}
      <div className="pt-20 pb-16 px-4 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            AI 搜索引擎优化
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          您的网站，AI 能理解吗？
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          输入您的网站 URL，获取专业的 AEO/GEO 优化分析报告。
          了解 AI 如何看待您的网站，以及如何让 AI 更愿意推荐您。
        </p>

        <UrlInput onSubmit={handleSubmit} isLoading={false} />

        {error && (
          <div className="mt-4 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400">
          支持任意公开可访问的网站 URL，分析过程约需 10-30 秒
        </p>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">五维 AEO 评分</h3>
            <p className="text-gray-500 text-sm">
              从内容结构、语义覆盖、可信度、技术基础、页面体验五个维度全面评估网站 AI 友好度
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">场景覆盖分析</h3>
            <p className="text-gray-500 text-sm">
              基于 Persona × Funnel × Use Case 矩阵，分析您的网站覆盖了多少 AI 搜索场景
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">可操作优化建议</h3>
            <p className="text-gray-500 text-sm">
              不只是评分，更有具体的页面重构模板、内容选题建议和技术优化清单
            </p>
          </div>
        </div>
      </div>

      {/* Value Prop */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            不只是 SEO，而是让 AI 愿意推荐你
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            GEO/AEO 的本质不是让 AI 知道"你是谁"，<br className="hidden md:block" />
            而是让 AI 在足够多的具体问题里知道"什么时候应该推荐你"
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="font-bold text-gray-800 mb-2">📖 免费版</h4>
              <ul className="text-sm text-gray-500 space-y-1.5">
                <li>✅ AEO 综合评分与等级</li>
                <li>✅ 五维分项评分</li>
                <li>✅ 网站优势分析</li>
                <li>✅ 当前主要问题诊断</li>
                <li className="text-gray-300 line-through">完整 9 部分报告</li>
                <li className="text-gray-300 line-through">Word 报告下载</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
              <h4 className="font-bold text-gray-800 mb-2">🔓 完整版 ¥1.99</h4>
              <ul className="text-sm text-gray-500 space-y-1.5">
                <li>✅ AEO 综合评分与等级</li>
                <li>✅ 五维分项评分</li>
                <li>✅ 网站优势分析</li>
                <li>✅ 当前主要问题诊断</li>
                <li>✅ 语义场景覆盖矩阵</li>
                <li>✅ 20 个优先页面选题</li>
                <li>✅ 页面重构模板</li>
                <li>✅ 技术优化清单</li>
                <li>✅ 效果衡量方案</li>
                <li>✅ Word 报告下载</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-sm text-gray-400">
        AEO Analyzer — 让 AI 更懂你的网站
      </div>
    </div>
  );
}
