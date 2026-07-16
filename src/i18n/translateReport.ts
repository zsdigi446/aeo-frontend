/**
 * 报告术语翻译工具
 *
 * 对后端返回的报告数据中已知的固定术语（维度名、章节标题、表头等）
 * 做前端翻译覆盖。动态内容（如具体的关键发现、问题详情）保持原样。
 */
import type { FreeReport, FullReport } from '../types/report';
import type { Lang } from '../i18n/types';

// 维度名映射（中文 → 英文）
const DIM_MAP: Record<string, string> = {
  '内容结构': 'dimContentStructure',
  '语义覆盖': 'dimSemanticCoverage',
  '可信度': 'dimCredibility',
  '技术基础': 'dimTechnicalBasis',
  '页面体验': 'dimPageExperience',
};

export interface ReportTermMap {
  [key: string]: string;
}

/** 构建中文→目标语言的替换映射表 */
function buildReplaceMap(terms: ReportTermMap): Map<string, string> {
  const m = new Map<string, string>();

  // 章节标题
  m.set('一、AEO 健康度评分总览', terms.part1Title);
  m.set('二、网站当前 AEO 优势', terms.part2Title);
  m.set('三、当前最大 AEO 问题', terms.part3Title);
  m.set('四、Persona × Funnel × Use Case 内容机会', terms.part4Title);
  m.set('五、最值得优先做的 AEO 页面', terms.part5Title);
  m.set('六、页面重构模板', terms.part6Title);
  m.set('七、技术与抓取层面建议', terms.part7Title);
  m.set('八、AEO 效果衡量方式', terms.part8Title);
  m.set('九、最终判断', terms.part9Title);

  // 表头
  m.set('维度', terms.thDimension);
  m.set('权重', terms.thWeight);
  m.set('评分', terms.thScore);
  m.set('关键发现', terms.thKeyFinding);

  // 分组名
  m.set('第一组：对比类页面', terms.group1Name);
  m.set('第二组：适合/不适合类页面', terms.group2Name);
  m.set('第三组：场景/用例页面', terms.group3Name);
  m.set('第四组：FAQ/知识库页面', terms.group4Name);

  // 衡量维度
  m.set('AI 可见度', terms.measureDimVisibility);
  m.set('引用份额', terms.measureDimShare);
  m.set('品牌叙事准确度', terms.measureDimAccuracy);

  // 其他固定文本
  m.set('暂无数据', terms.noData);

  return m;
}

/** 翻译单个字符串 */
function translateStr(s: string | undefined | null, map: Map<string, string>): string {
  if (!s) return s ?? '';
  // 先精确匹配整个字符串
  if (map.has(s)) return map.get(s)!;
  // 再尝试部分匹配（如"问题 1："前缀）
  let result = s;
  for (const [zh, en] of map.entries()) {
    if (result.includes(zh)) {
      result = result.replace(zh, en);
    }
  }
  return result;
}

/** 翻译维度名 */
function translateDimName(name: string, terms: ReportTermMap): string {
  const key = DIM_MAP[name];
  return key ? (terms[key] ?? name) : name;
}

/**
 * 对完整报告做术语翻译，返回新对象（不修改原始数据）
 */
export function translateReport(
  report: FreeReport | FullReport,
  terms: ReportTermMap,
  lang: Lang
): FreeReport | FullReport {
  if (lang === 'zh-CN') return report; // 中文无需翻译

  const map = buildReplaceMap(terms);

  // 浅拷贝 + 深度翻译关键字段
  const r = JSON.parse(JSON.stringify(report)) as FreeReport | FullReport;

  // Part 1 标题和维度
  if ('part1_overview' in r && r.part1_overview) {
    r.part1_overview.title = translateStr(r.part1_overview.title, map);
    if (r.part1_overview.dimensions) {
      for (const d of r.part1_overview.dimensions) {
        d.name = translateDimName(d.name, terms);
      }
    }
  }

  // Part 2-9 标题
  for (let i = 2; i <= 9; i++) {
    const key = `part${i}_${['overview','advantages','problems','content_opportunities','priority_pages','page_template','technical_suggestions','measurement','conclusion'][i - 1]}` as keyof FullReport;
    if (key in r && typeof (r as any)[key] === 'object' && (r as any)[key]?.title) {
      (r as any)[key].title = translateStr((r as any)[key].title, map);
    }
  }

  // dimension_details 中的维度名
  if (r.dimension_details) {
    for (const d of r.dimension_details) {
      d.name = translateDimName(d.name, terms);
    }
  }

  // Part 3 问题标题中的 "问题 X：" → "Issue X:"
  if ('part3_problems' in r && r.part3_problems?.problems) {
    for (const p of r.part3_problems.problems) {
      p.title = p.title.replace(/问题\s*(\d+)：/, `${terms.problemPrefix} $1:`);
    }
  }

  // Part 5 分组名
  if ('part5_priority_pages' in r && (r as FullReport).part5_priority_pages?.groups) {
    for (const g of (r as FullReport).part5_priority_pages.groups!) {
      g.name = translateStr(g.name, map);
    }
  }

  // Part 8 衡量维度名
  if ('part8_measurement' in r && (r as FullReport).part8_measurement?.dimensions) {
    for (const d of (r as FullReport).part8_measurement.dimensions!) {
      d.name = translateStr(d.name, map);
    }
  }

  return r;
}
