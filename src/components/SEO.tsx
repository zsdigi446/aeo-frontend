import { useEffect } from 'react';
import { useI18n } from '../i18n';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const DEFAULT_DESC_ZH =
  'AI搜索优化（AEO/GEO）免费在线分析工具。输入网站URL，获取五维AEO评分和专业优化建议报告。';
const DEFAULT_DESC_EN =
  'Free online AI Search Optimization (AEO/GEO) analyzer. Enter a URL to get a five-dimension AEO score and professional optimization report.';

/**
 * SEO 组件 — 动态设置页面标题和 meta 标签
 * 用于报告页和支付页等动态页面，以及首页默认多语言标题
 */
export default function SEO({ title, description, canonical }: SEOProps) {
  const { lang, t } = useI18n();

  useEffect(() => {
    const siteName = t.common.siteName;
    const zh = lang === 'zh-CN';

    // 默认标题（首页）随语言变化
    const defaultTitle = zh
      ? `${siteName} | AEO/GEO 智能分析工具 — 让 AI 更愿意推荐你的网站`
      : `${siteName} | AEO/GEO Analyzer — Help AI Recommend Your Site`;

    const resolvedTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const resolvedDesc = description || (zh ? DEFAULT_DESC_ZH : DEFAULT_DESC_EN);

    // 更新页面标题
    document.title = resolvedTitle;

    // 更新 og:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', resolvedTitle);

    // 更新 description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', resolvedDesc);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', resolvedDesc);

    // 更新 canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical, lang, t]);

  return null;
}
