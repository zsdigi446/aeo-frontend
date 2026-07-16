import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

/**
 * SEO 组件 — 动态设置页面标题和 meta 标签
 * 用于报告页和支付页等动态页面
 */
export default function SEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    const siteName = 'AI搜索优化';

    // 更新页面标题
    if (title) {
      document.title = `${title} | ${siteName}`;
    } else {
      document.title = `${siteName} | AEO/GEO 智能分析工具 — 让 AI 更愿意推荐你的网站`;
    }

    // 更新 og:title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | ${siteName}` : document.title);
    }

    // 更新 description
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }

    // 更新 canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical]);

  return null;
}
