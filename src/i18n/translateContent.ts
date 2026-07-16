/**
 * 报告全文模板翻译器
 *
 * 后端用固定模板生成报告中文内容，前端在英文模式下用正则/模式匹配
 * 将这些已知模板全部替换为英文版本。
 *
 * 设计原则：
 * - 中文是"源语言"，英文通过模式匹配+变量插值生成
 * - 未匹配到的字符串保持原样（兜底）
 * - 所有动态变量（{site_name}, {score}, dim.name 等）原样保留
 */

// ============================================================
// Part 2: Advantages 模板映射
// ============================================================
const ADV_PATTERNS: [RegExp, string][] = [
  // 有标题
  [/^网站有明确的页面标题「(.{0,80})」，有助于 AI 理解页面主题$/,
   'Has a clear page title "$1", helping AI understand the page topic'],
  // Schema
  [/^已部署 Schema 结构化数据（(.+)），有助于 AI 解析页面内容$/,
   'Schema structured data ($1) deployed, helping AI parse page content'],
  // FAQ
  [/^包含 FAQ 结构，AI 可直接引用问答内容$/,
   'Contains FAQ structure — AI can directly cite Q&A content'],
  // 对比内容
  [/^包含对比类内容，这是 AI 引用偏好最高的内容类型之一$/,
   'Contains comparison content — one of the most AI-preferred content types for citations'],
  // 作者信息
  [/^有作者\/团队信息展示，增强 AI 信任度$/,
   'Displays author/team information — enhances AI trust signals'],
  // 用户评价
  [/^包含用户评价\/案例信号，有助于建立可信度$/,
   'Includes user reviews/testimonial signals — helps build credibility'],
  // Viewport
  [/^页面支持响应式设计（Viewport），移动端体验基础良好$/,
   'Responsive design (Viewport meta) supported — solid mobile experience foundation'],
  // 字数丰富
  [/^页面内容丰富（约 (\d+) 字符），有足够信息供 AI 提取$/,
   'Rich page content (~$1 characters), providing sufficient information for AI extraction'],
  // 兜底
  [/^网站已在线可访问，这是 AEO 优化的基础前提$/,
   'Site is publicly accessible online — the foundational prerequisite for AEO optimization'],
];

// ============================================================
// Part 3: Problems 模板映射
// ============================================================

/** 问题标题模板 */
const PROBLEM_TITLE_PATTERNS: [RegExp, string][] = [
  [/^问题 (\d+)：([^维度]+)维度评分较低（(\d+)分）$/,
   'Issue $1:$2 dimension score is low ($2 points)'],
  [/^问题 (\d+)：缺少 Schema 结构化数据$/, 'Issue $1: Missing Schema Structured Data'],
  [/^问题 (\d+)：缺少 FAQ 板块$/, 'Issue $1: Missing FAQ Section'],
  [/^问题 (\d+)：缺少对比类内容$/, 'Issue $1: Missing Comparison Content'],
  [/^问题 (\d+)：标题缺乏问题式结构$/, 'Issue $1: Titles lack question-based structure'],
];

/** 问题详情模板 */
const PROBLEM_DETAIL_PATTERNS: [RegExp, string][] = [
  // Schema 缺失
  [/^网站未检测到 JSON-LD 格式的结构化数据。Schema 是 AI 理解页面内容的关键信号，建议添加 Organization、Product、FAQPage、Article 等类型的 Schema 标记。$/,
   'No JSON-LD format structured data detected on the site. Schema is a key signal for AI to understand page content. Consider adding Schema markup for Organization, Product, FAQPage, Article, and other types.'],
  // FAQ 缺失
  [/^FAQ 是 AI 引用率最高的内容格式之一。建议在核心页面添加问答结构，直接回答用户最关心的问题。$/,
   'FAQ is one of the most highly cited content formats by AI. Consider adding Q&A structures on core pages to directly address users\' top concerns.'],
  // 对比缺失
  [/^AI 非常偏好引用对比内容（A vs B、优缺点、适用场景对比）。建议创建竞品对比、方案对比等页面。$/,
   'AI strongly prefers citing comparison content (A vs B, pros/cons, scenario comparisons). Consider creating competitor comparison pages and solution comparison pages.'],
  // 标题问题
  [/^当前 H2 标题以陈述为主，缺少问题式标题。AI 更偏好能直接匹配用户问题的标题结构。$/,
   'Current H2 headings are primarily declarative, lacking question-based titles. AI prefers title structures that directly match user questions.'],
  // 整体良好
  [/^各项指标基本达标，建议进一步深化语义场景覆盖和对比内容建设。$/,
   'Most indicators are met. Recommend further deepening semantic scenario coverage and comparison content development.'],
  // 维度需优化兜底
  [/^「([^」]+)」需要重点优化$/,
   '"$1" needs focused optimization'],
];

// ============================================================
// Part 4: 场景矩阵字段名映射
// ============================================================
const SCENARIO_FIELD_MAP: Record<string, string> = {
  '第一次购买的新用户': 'First-time buyer',
  '预算敏感的消费者': 'Budget-conscious consumer',
  '注重品质的专业用户': 'Quality-focused professional user',
  '给他人买礼物的用户': 'Gift shopper',
  '回头客/老用户': 'Returning customer / Loyal user',
  '移动端浏览用户': 'Mobile user',
  '小团队/初创公司创始人': 'Small team / Startup founder',
  '企业采购决策者': 'Enterprise procurement decision-maker',
  '从竞品切换的用户': 'User switching from competitor',
  '技术评估者/开发者': 'Technical evaluator / Developer',
  '非技术背景的部门主管': 'Non-technical department manager',
  '自由职业者/个人用户': 'Freelancer / Individual user',
  '信息搜索者': 'Information seeker',
  '深度学习者': 'Deep learner',
  '内容创作者': 'Content creator',
  '有明确需求的客户': 'Customer with clear requirements',
  '在比较服务商的客户': 'Customer comparing service providers',
  '预算有限的客户': 'Budget-limited customer',
  '第一次使用服务的客户': 'First-time service user',
  '潜在客户': 'Potential customer',
  '对比中的用户': 'User in comparison',
  '即将决策的用户': 'User ready to decide',
  '老用户': 'Existing user',
};

// Use case 文本模板映射
const USECASE_PATTERNS: [RegExp, string][] = [
  [/^不了解产品怎么选，需要购买指南$/, "Doesn't know how to choose products, needs buying guide"],
  [/^想确认性价比，和竞品比较$/, 'Wants to confirm value for money, comparing with competitors'],
  [/^关心材质、工艺、售后保障$/, 'Cares about materials, craftsmanship, after-sales support'],
  [/^不知道该买什么，需要礼物推荐$/, "Doesn't know what to buy, needs gift recommendations"],
  [/^想了解新品、升级或补充购买$/, 'Wants to learn about new products, upgrades or add-ons'],
  [/^碎片时间浏览，需要快速了解$/, 'Browsing in spare time, needs quick understanding'],
  [/^预算有限，需要性价比高的工具$/, 'Limited budget, needs cost-effective tools'],
  [/^关心安全性、集成能力、ROI$/, 'Cares about security, integration capabilities, ROI'],
  [/^觉得现有工具太贵或不好用$/, 'Feels current tool is too expensive or not good enough'],
  [/^关心 API、文档、技术架构$/, 'Cares about API, documentation, technical architecture'],
  [/^需要简单易用的工具，不想学复杂系统$/, 'Needs simple, easy-to-use tools, doesn\'t want to learn complex systems'],
  [/^需要个人能负担的方案$/, 'Needs an affordable plan for individuals'],
  [/^想了解某个话题或概念$/, 'Wants to learn about a topic or concept'],
  [/^需要系统性的知识体系$/, 'Needs systematic knowledge framework'],
  [/^寻找可引用的权威来源$/, 'Looking for citable authoritative sources'],
  [/^需要确认服务是否适合自己的情况$/, 'Needs to confirm if the service fits their situation'],
  [/^在几家服务商之间比较$/, 'Comparing between multiple service providers'],
  [/^关心价格和服务范围$/, 'Cares about pricing and service scope'],
  [/^不了解服务流程和预期效果$/, "Doesn't understand service process and expected outcomes"],
  [/^第一次了解 (.+)$/, 'Learning about $1 for the first time'],
  [/^在 (.+) 和竞品之间选择$/, 'Choosing between $1 and competitors'],
  [/^需要确认是否适合自己$/, 'Needs to confirm if it\'s right for them'],
  [/^想了解更多功能或场景$/, 'Wants to learn more features or use cases'],
];

// ============================================================
// Part 7: 技术建议模板
// ============================================================
const TECH_PATTERNS: [RegExp, string][] = [
  [/^为核心页面添加 Product、FAQPage、Breadcrumb、Organization、Article 等结构化数据标记$/,
   'Add structured data markup (Product, FAQPage, Breadcrumb, Organization, Article, etc.) for core pages'],
  [/^添加 Viewport Meta 标签，确保移动端适配$/,
   'Add Viewport Meta tag to ensure mobile responsiveness'],
  [/^为每个页面添加独特的 Meta Description（50-160 字符）$/,
   'Add unique Meta Description (50-160 chars) per page'],
  [/^在首页、分类页和产品页首屏增加「直接回答型摘要」，让 AI 更快抓取核心信息$/,
   'Add "direct-answer summary" above the fold on homepage, category pages, and product pages — helps AI capture core info faster'],
  [/^减少重复导航和促销文本对主内容抓取的干扰，让核心信息更靠前$/,
   'Reduce interference of repetitive navigation and promotional text on main content crawling — push core info forward'],
  [/^优化图片 Alt 文本，使用具体、自然的描述而非只重复产品名$/,
   'Optimize image Alt text — use specific, natural descriptions instead of just repeating product names'],
  [/^为博客和内容页统一添加作者信息、更新时间和数据来源$/,
   'Add author info, update timestamps, and data sources uniformly across blog and content pages'],
  [/^将信任信号（评价、保障、退换政策）做成可读文本模块，而非仅用图标展示$/,
   'Make trust signals (reviews, guarantees, return policies) into readable text modules, not just icon displays'],
  [/^优化页面加载速度，确保移动端 PageSpeed 评分 ≥ 70$/,
   'Optimize page load speed — ensure mobile PageSpeed score ≥ 70'],
];

// ============================================================
// Part 8: 衡量维度描述
// ============================================================
const MEASURE_DESC_PATTERNS: [RegExp, string][] = [
  [/^每月测试 5-10 个核心问题，检查品牌是否出现在 AI 推荐答案中$/,
   'Test 5-10 core questions monthly — check if your brand appears in AI recommended answers'],
  [/^在 ChatGPT、Perplexity、Gemini 等工具中测试 10-15 个问题，对比竞品出现频率$/,
   'Test 10-15 questions across ChatGPT, Perplexity, Gemini etc. — compare appearance frequency vs competitors'],
  [/^直接问 AI 关于品牌的问题，检查回答是否准确、完整$/,
   'Ask AI directly about your brand — check if responses are accurate and complete'],
];

// ============================================================
// Part 9: 结论模板
// ============================================================
const CONCLUSION_LEVEL_TEXT: Record<string, string> = {
  '基础不错': 'has a solid foundation',
  '有一定基础，但还有较大提升空间': 'has some foundation but significant room for improvement',
  '需要系统性的 AEO optimization': 'needs systematic AEO optimization',
};

const CONCLUSION_ACTION_PREFIXES: [RegExp, string][] = [
  [/^当前最需要改进的是「([^」]+)」维度，同时建议深化「([^」]+)」的优势，建立更完整的 AI 答案素材库。$/,
   'The top priority is improving the "$1" dimension while deepening "$2" strengths to build a more complete AI answer asset library.'],
  [/^建议优先优化「([^」]+)」((\d+)分)和内容结构，然后系统性地补充对比内容和 FAQ。$/,
   'Recommend prioritizing optimization of "$1" ($2 points) and content structure, then systematically adding comparison content and FAQs.'],
  [/^网站目前在多个维度都有提升空间，建议从内容结构重构和 Schema 部署开始，逐步建立 AI 友好的内容体系。$/,
   'The site has room for improvement across multiple dimensions. Start with content structure restructuring and Schema deployment to gradually build an AI-friendly content system.'],
];

// CONCLUSION_OVERVIEW_PATTERN is handled inline below with direct replace

// ============================================================
// 维度关键发现（scorer.py 中生成的）
// ============================================================
const DIM_FINDING_PATTERNS: [RegExp, string][] = [
  [/^页面有 (\d+) 个 H2 子标题$/, 'Page has $2 H2 sub-headings'],
  [/^包含 (\d+) 个场景关键词$/, 'Contains $1 scenario keywords'],
  [/^检测到作者\/团队信息$/, 'Author/team information detected'],
  [/^标题层级结构完整$/, 'Heading hierarchy is complete'],
  [/^设置了 Viewport（响应式设计）$/, 'Viewport set up (responsive design)'],
  [/^缺少问题式标题，建议围绕用户真实问题重写标题结构$/,
   'Lacks question-based titles — recommend rewriting title structure around real user questions'],
  [/^建议增加更多具体使用场景描述；建议明确不同目标人群（如按 B2C\/B2B 细分），让 AI 知道「在跟谁说话」$/,
   'Recommend adding more specific use-case descriptions; clearly define target audiences (e.g., B2C/B2B segments) so AI knows who you\'re addressing'],
  [/^缺少 H[12] 标题，AI 无法快速判断页面主[题]；建议将部分 H[23] 改为问题式标题，更容易被 AI 匹配；建议添加 FAQ 板块，FAQ 是 AI 引用率最高的内容格式之一$/,
   'Missing H$1 headings, making it hard for AI to quickly determine the page topic; suggest converting some H$2 headings to question-based format for easier AI matching; add FAQ section — FAQ is among the highest-cited content formats by AI'],
];

// ============================================================
// 公开函数
// ============================================================

/**
 * 对单个字符串尝试所有模式进行翻译
 */
function translateString(s: string): string {
  let result = s;

  // 尝试各种模式集合
  const allPatterns = [
    ...ADV_PATTERNS,
    ...PROBLEM_TITLE_PATTERNS,
    ...PROBLEM_DETAIL_PATTERNS,
    ...USECASE_PATTERNS,
    ...TECH_PATTERNS,
    ...MEASURE_DESC_PATTERNS,
    ...CONCLUSION_ACTION_PREFIXES,
    ...DIM_FINDING_PATTERNS,
  ];

  for (const [pattern, replacement] of allPatterns) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
      break; // 一个字符串通常只匹配一个模式
    }
  }

  return result;
}

/**
 * 翻译 persona 字段名
 */
function translatePersona(name: string): string {
  return SCENARIO_FIELD_MAP[name] || name;
}

/**
 * 主入口：对完整报告做深度翻译
 */
export function translateReportContent(
  report: any,
  lang: 'zh-CN' | 'en-US'
): any {
  if (lang === 'zh-CN') return report;

  // 深拷贝避免修改原始数据
  const r = JSON.parse(JSON.stringify(report));

  // ---- Part 2: Advantages ----
  if (r.part2_advantages?.items) {
    r.part2_advantages.items = r.part2_advantages.items.map(
      (item: string) => translateString(item)
    );
  }

  // ---- Part 3: Problems ----
  if (r.part3_problems?.problems) {
    r.part3_problems.problems = r.part3_problems.problems.map((p: any) => ({
      ...p,
      title: translateString(p.title),
      detail: translateString(p.detail),
    }));
  }

  // ---- Part 4: Scenarios ----
  if (r.part4_content_opportunities?.scenarios) {
    r.part4_content_opportunities.scenarios = r.part4_content_opportunities.scenarios.map(
      (sc: any) => ({
        ...sc,
        persona: translatePersona(sc.persona),
        use_case: translateString(sc.use_case),
      })
    );
  }

  // ---- Part 5: Priority Pages ----
  if (r.part5_priority_pages?.groups) {
    r.part5_priority_pages.groups = r.part5_priority_pages.groups.map((g: any) => ({
      ...g,
      name: translateString(g.name),
    }));
  }

  // ---- Part 7: Technical Suggestions ----
  if (r.part7_technical_suggestions?.items) {
    r.part7_technical_suggestions.items = r.part7_technical_suggestions.items.map(
      (item: string) => translateString(item)
    );
  }

  // ---- Part 8: Measurement ----
  if (r.part8_measurement?.dimensions) {
    r.part8_measurement.dimensions = r.part8_measurement.dimensions.map((d: any) => ({
      ...d,
      description: translateString(d.description),
    }));
  }

  // ---- Part 9: Conclusion ----
  if (r.part9_conclusion) {
    const c = r.part9_conclusion;
    // Overview: 替换等级文本
    c.overview = c.overview.replace(/的 AEO (.+?)，/, (_match: string, level: string) => {
      return `'s AEO ${CONCLUSION_LEVEL_TEXT[level] || level},`;
    });
    // Action
    c.action = translateString(c.action);
    // Summary
    c.summary = translateString(c.summary);
  }

  // ---- Part 1: Dimension key_findings ----
  if (r.dimension_details) {
    r.dimension_details = r.dimension_details.map((d: any) => ({
      ...d,
      details: d.details?.map((detail: string) => translateString(detail)) ?? d.details,
      suggestions: d.suggestions?.map((sug: string) => translateString(sug)) ?? d.suggestions,
    }));
  }
  // part1_overview.dimensions key_finding
  if (r.part1_overview?.dimensions) {
    r.part1_overview.dimensions = r.part1_overview.dimensions.map((d: any) => ({
      ...d,
      key_finding: translateString(d.key_finding),
    }));
  }

  return r;
}
