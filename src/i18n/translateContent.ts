/**
 * 报告正文内容翻译器
 *
 * 策略：
 * 1) 先按中文分号「；」把多建议/多分句拆开，逐句翻译后再用 "; " 拼接
 *    —— 解决「一句话只匹配一个模式」导致后半句残留中文的问题
 * 2) 每个子句先查 EXACT 精确字典；查不到再尝试 SKELETONS 骨架正则
 *    （正则捕获 site_name / 数字 / 维度名 等变量，再回填英文模板）
 * 3) 维度名、等级文本等用专门的映射表
 *
 * 覆盖范围：与后端 analyzer/scorer.py、analyzer/reporter.py 的模板一一对应。
 */

// ---------------------------------------------------------------------------
// 维度中文名 -> 英文名（用于「维度名」内嵌在句子里的情况）
// ---------------------------------------------------------------------------
const DIM_NAME_EN: Record<string, string> = {
  '内容结构': 'Content Structure',
  '语义覆盖': 'Semantic Coverage',
  '可信度': 'Credibility',
  '技术基础': 'Technical Basis',
  '页面体验': 'Page Experience',
};

// ---------------------------------------------------------------------------
// 结论等级文本
// ---------------------------------------------------------------------------
const LEVEL_EN: Record<string, string> = {
  '基础不错': 'has a solid foundation',
  '有一定基础，但还有较大提升空间': 'has some foundation but significant room for improvement',
  '需要系统性的 AEO 优化': 'needs systematic AEO optimization',
};

// ---------------------------------------------------------------------------
// 精确字典：整句（或整段，不含变量）直接映射
// ---------------------------------------------------------------------------
const EXACT: Record<string, string> = {
  // ===== Scorer: 内容结构 =====
  '✅ 页面有 H1 标题': '✅ Page has an H1 title',
  '✅ H1 数量合理（1个）': '✅ H1 count is appropriate (1)',
  '建议只保留 1 个 H1 标题，避免 AI 困惑': 'Keep only 1 H1 title to avoid confusing AI',
  '缺少 H1 标题，AI 无法快速判断页面主题': 'Missing H1 title; AI cannot quickly determine the page topic',
  '✅ 检测到 FAQ 结构': '✅ FAQ structure detected',
  '建议添加 FAQ 板块，FAQ 是 AI 引用率最高的内容格式之一': 'Add a FAQ section — FAQ is one of the content formats AI cites most often',
  '✅ 段落长度适中，适合 AI 读取': '✅ Paragraph length is moderate, suitable for AI reading',
  '段落偏短，信息密度可能不足': 'Paragraphs are short; information density may be insufficient',
  '段落偏长，建议拆分为更小的语义块': 'Paragraphs are long; consider splitting into smaller semantic blocks',
  '页面内容较少，AI 可引用的信息量不足': 'Page content is thin; not enough information for AI to cite',
  '页面缺少有效文本段落，AI 无内容可引用': 'Page lacks valid text paragraphs; AI has nothing to cite',
  '✅ 检测到对比/比较类内容': '✅ Comparison-type content detected',
  '建议增加对比类内容（如 A vs B、优缺点对比），AI 偏好引用对比信息': 'Add comparison content (e.g., A vs B, pros/cons); AI prefers citing comparisons',
  '✅ 开头段落简洁，符合「直接回答」模式': '✅ Opening paragraph is concise, fits the "direct answer" pattern',
  '开头段落较长，建议在前 100 字内给出核心答案': 'Opening paragraph is long; provide the core answer within the first 100 characters',
  '✅ 包含定义/解释式内容，适合 AI 直接引用': '✅ Contains definition/explanatory content, suitable for direct AI citation',
  '建议将更多小标题改为用户真实会问的问题格式': 'Turn more subheadings into the questions users actually ask',
  '问题式标题偏少，建议增加到 5 个以上': 'Too few question-style headings; aim for 5 or more',
  '缺少问题式标题，建议围绕用户真实问题重写标题结构': 'Missing question-style headings; rewrite the heading structure around users’ real questions',
  '缺少 H2 子标题，建议按「问题-回答」结构组织内容': 'Missing H2 subheadings; organize content in a "question–answer" structure',
  '建议将部分 H2 改为问题式标题，更容易被 AI 匹配': 'Turn some H2s into question-style headings to match AI queries more easily',
  '建议增加 H3 小标题，细化内容层次': 'Add H3 subheadings to refine the content hierarchy',
  '以下页面按优先级分为四组，建议按顺序逐步实施：': 'The following pages are grouped into four priority tiers; implement them in order:',
  '网站目前在多个维度都有提升空间，建议从内容结构重构和 Schema 部署开始，逐步建立 AI 友好的内容体系。': 'The site has room to improve across multiple dimensions; start with content-structure restructuring and Schema deployment to gradually build an AI-friendly content system.',

  // ===== Scorer: 语义覆盖 =====
  '✅ 场景描述丰富，覆盖多种使用情境': '✅ Rich scenario descriptions covering multiple use cases',
  '建议增加更多具体使用场景描述': 'Add more concrete usage scenario descriptions',
  '严重缺少使用场景描述，建议按「Persona + 场景 + 问题」公式补充': 'Severely lacking scenario descriptions; add them using the "Persona + Scenario + Question" formula',
  '建议明确不同目标人群（如按 B2C/B2B 细分），让 AI 知道「在跟谁说话」': 'Define distinct target audiences (e.g., B2C/B2B segments) so AI knows "who it is talking to"',
  '缺少明确的目标人群描述，AI 难以判断内容适合谁': 'Missing clear target-audience description; AI struggles to judge who the content is for',
  '建议覆盖更多决策阶段内容': 'Cover more decision-stage content',
  '缺少明确的决策阶段内容': 'Missing clear decision-stage content',

  // ===== Scorer: 可信度 =====
  '✅ 检测到作者/团队信息': '✅ Author/team information detected',
  '建议添加作者信息和背景介绍，增强 AI 信任度': 'Add author info and bio to increase AI trust',
  '✅ 检测到发布日期': '✅ Publish date detected',
  '建议添加内容发布时间，AI 更信任有明确时间的内容': 'Add content publish time; AI trusts time-stamped content more',
  '✅ 有关于/团队页面链接': '✅ Has About/team page link',
  '建议添加关于我们页面，介绍公司和团队背景': 'Add an About Us page introducing the company and team',
  '✅ 有联系方式': '✅ Has contact information',
  '建议添加联系信息，增强可信度': 'Add contact info to boost credibility',
  '✅ 检测到用户评价/案例': '✅ User reviews/cases detected',
  '建议添加真实用户案例、评价或数据引用': 'Add real user cases, reviews, or data citations',
  '✅ 检测到数据/研究引用': '✅ Data/research citation detected',
  '建议引用行业数据或研究报告增强权威性': 'Cite industry data or research reports to strengthen authority',

  // ===== Scorer: 技术基础 =====
  '✅ 有 H1 标题（SEO 基础）': '✅ Has H1 title (SEO basics)',
  '缺少 H1 标签': 'Missing H1 tag',
  '✅ 标题层级结构完整': '✅ Heading hierarchy is complete',
  '缺少 H2 标签，标题层级不完整': 'Missing H2 tags; heading hierarchy incomplete',
  '✅ 页面可被索引': '✅ Page is indexable',
  '页面设置了 noindex，AI 和搜索引擎无法收录': 'Page has noindex set; AI and search engines cannot index it',
  '✅ HTTP 状态正常': '✅ HTTP status is normal',
  '✅ 内容层次丰富': '✅ Content hierarchy is rich',
  '建议添加 Schema 结构化数据标记（Product/FAQPage/Article/Organization 等）': 'Add Schema structured-data markup (Product/FAQPage/Article/Organization, etc.)',
  '✅ Meta Description 长度合理': '✅ Meta Description length is reasonable',
  'Meta Description 长度建议在 50-160 字符之间': 'Recommended Meta Description length is 50–160 characters',
  '缺少 Meta Description，建议添加': 'Missing Meta Description; add one',
  '大部分图片缺少 Alt 文本': 'Most images are missing Alt text',

  // ===== Scorer: 页面体验 =====
  '✅ 设置了 Viewport（响应式设计）': '✅ Viewport set (responsive design)',
  '建议添加 Viewport meta 标签，适配移动端': 'Add a Viewport meta tag for mobile adaptation',
  '✅ 主内容量充足': '✅ Main content volume is sufficient',
  '页面主内容偏少': 'Main content is thin',
  '页面内容过少，AI 可引用信息不足': 'Page content is too little; insufficient for AI citation',
  '✅ 页面大小适中': '✅ Page size is moderate',
  '页面内容过大，可能影响加载速度': 'Page content is too large; may affect load speed',
  '✅ 导航结构清晰': '✅ Navigation structure is clear',
  '导航链接较多，建议简化以减少 AI 抓取干扰': 'Too many nav links; simplify to reduce AI crawl interference',

  // ===== Part 2 优势 (无变量的条目) =====
  '包含 FAQ 结构，AI 可直接引用问答内容': 'Contains FAQ structure; AI can directly cite Q&A content',
  '包含对比类内容，这是 AI 引用偏好最高的内容类型之一': 'Contains comparison content — one of the content types AI prefers to cite most',
  '有作者/团队信息展示，增强 AI 信任度': 'Shows author/team info, increasing AI trust',
  '包含用户评价/案例信号，有助于建立可信度': 'Contains user-review/case signals, helping build credibility',
  '页面支持响应式设计（Viewport），移动端体验基础良好': 'Page supports responsive design (Viewport); solid mobile experience',
  '网站已在线可访问，这是 AEO 优化的基础前提': 'The site is online and accessible — the basic prerequisite for AEO optimization',

  // ===== Part 3 固定问题描述 =====
  '网站未检测到 JSON-LD 格式的结构化数据。Schema 是 AI 理解页面内容的关键信号，建议添加 Organization、Product、FAQPage、Article 等类型的 Schema 标记。':
    'No JSON-LD structured data detected on the site. Schema is a key signal for AI to understand page content; add Organization, Product, FAQPage, Article and similar Schema markup.',
  'FAQ 是 AI 引用率最高的内容格式之一。建议在核心页面添加问答结构，直接回答用户最关心的问题。':
    'FAQ is one of the content formats AI cites most often. Add a Q&A structure to core pages to directly answer users’ most pressing questions.',
  'AI 非常偏好引用对比内容（A vs B、优缺点、适用场景对比）。建议创建竞品对比、方案对比等页面。':
    'AI strongly prefers citing comparison content (A vs B, pros/cons, use-case comparisons). Create competitor-comparison and solution-comparison pages.',
  '当前 H2 标题以陈述为主，缺少问题式标题。AI 更偏好能直接匹配用户问题的标题结构。':
    'Current H2 headings are mostly statements, lacking question-style headings. AI prefers heading structures that directly match user questions.',
  '各项指标基本达标，建议进一步深化语义场景覆盖和对比内容建设。':
    'All metrics are basically up to standard; further deepen semantic scenario coverage and comparison content.',
  '网站整体表现良好': 'The site performs well overall',

  // ===== Part 4 / 6 结构层级名 =====
  '开头摘要': 'Opening Summary',
  '对比表': 'Comparison Table',
  '常见问题 (FAQ)': 'FAQ',
  '真实用户案例': 'Real User Cases',

  // ===== Part 6 描述 =====
  '以下是一个示例页面结构，展示如何将普通产品/服务页面改造成 AI 友好的「决策答案页」：':
    'Below is a sample page structure showing how to turn an ordinary product/service page into an AI-friendly "decision answer page":',

  // ===== Part 7 技术建议 (无变量) =====
  '为核心页面添加 Product、FAQPage、Breadcrumb、Organization、Article 等结构化数据标记':
    'Add structured-data markup (Product, FAQPage, Breadcrumb, Organization, Article, etc.) to core pages',
  '添加 Viewport Meta 标签，确保移动端适配': 'Add a Viewport Meta tag to ensure mobile adaptation',
  '为每个页面添加独特的 Meta Description（50-160 字符）': 'Add a unique Meta Description (50–160 chars) to every page',
  '在首页、分类页和产品页首屏增加「直接回答型摘要」，让 AI 更快抓取核心信息':
    'Add a "direct-answer summary" above the fold on the homepage, category and product pages so AI captures core info faster',
  '减少重复导航和促销文本对主内容抓取的干扰，让核心信息更靠前':
    'Reduce repetitive nav and promo text that interferes with main-content crawling; keep core info further up',
  '优化图片 Alt 文本，使用具体、自然的描述而非只重复产品名':
    'Optimize image Alt text with specific, natural descriptions rather than just repeating the product name',
  '为博客和内容页统一添加作者信息、更新时间和数据来源':
    'Uniformly add author info, update time, and data sources to blog and content pages',
  '将信任信号（评价、保障、退换政策）做成可读文本模块，而非仅用图标展示':
    'Turn trust signals (reviews, guarantees, return policies) into readable text modules, not just icons',
  '优化页面加载速度，确保移动端 PageSpeed 评分 ≥ 70':
    'Optimize page load speed; ensure mobile PageSpeed score ≥ 70',

  // ===== Part 8 维度描述 =====
  '每月测试 5-10 个核心问题，检查品牌是否出现在 AI 推荐答案中':
    'Test 5–10 core questions monthly; check whether the brand appears in AI-recommended answers',
  '在 ChatGPT、Perplexity、Gemini 等工具中测试 10-15 个问题，对比竞品出现频率':
    'Test 10–15 questions in tools like ChatGPT, Perplexity, Gemini; compare competitor mention frequency',
  '直接问 AI 关于品牌的问题，检查回答是否准确、完整':
    'Ask AI directly about the brand; check whether answers are accurate and complete',

  // ===== Part 9 结论 =====
  '核心建议：不要把网站仅仅当作展示窗口，而要把它升级为「AI 决策答案库」——在足够多的具体问题里，让 AI 知道什么时候应该推荐你。':
    'Core recommendation: don’t treat your website merely as a showcase — upgrade it into an "AI Decision Answer Library" so that, across enough specific questions, AI knows when to recommend you.',

  // ===== 其他 =====
  '暂无数据': 'No data available',
};

// ---------------------------------------------------------------------------
// 骨架正则：捕获 site_name / 数字 / 维度名 等变量再回填英文模板
// 注意顺序：更具体的模式放在更通用模式之前
// ---------------------------------------------------------------------------
type Rule = [RegExp, string | ((m: string, ...g: string[]) => string)];

const SKELETONS: Rule[] = [
  // ---- 总览 summary（含维度名） ----
  [/^网站 AEO 综合评分 (\d+)\/100（([A-F]) 级），表现最好的维度是「(.+?)」\((\d+)分\)，最需改进的维度是「(.+?)」\((\d+)分\)。$/,
    (_m, total, grade, best, bestScore, worst, worstScore) =>
      `Website AEO overall score ${total}/100 (Grade ${grade}). Best-performing dimension: ${DIM_NAME_EN[best] || best} (${bestScore}); dimension most needing improvement: ${DIM_NAME_EN[worst] || worst} (${worstScore}).`],

  // ---- Part 3 问题标题 ----
  [/^问题 (\d+)：(.+?)维度评分较低（(\d+)分）$/,
    (_m, n, dim, score) => `Issue ${n}: ${DIM_NAME_EN[dim] || dim} dimension scores low (${score}/100)`],
  [/^问题 (\d+)：缺少 Schema 结构化数据$/, (_m, n) => `Issue ${n}: Missing Schema structured data`],
  [/^问题 (\d+)：缺少 FAQ 板块$/, (_m, n) => `Issue ${n}: Missing FAQ section`],
  [/^问题 (\d+)：缺少对比类内容$/, (_m, n) => `Issue ${n}: Missing comparison content`],
  [/^问题 (\d+)：标题缺乏问题式结构$/, (_m, n) => `Issue ${n}: Headings lack question-style structure`],
  // 兼容 translateReport 已做前缀替换的情况
  [/^Issue (\d+):(.+?)维度评分较低（(\d+)分）$/,
    (_m, n, dim, score) => `Issue ${n}: ${DIM_NAME_EN[dim] || dim} dimension scores low (${score}/100)`],
  [/^Issue (\d+):缺少 Schema 结构化数据$/, (_m, n) => `Issue ${n}: Missing Schema structured data`],
  [/^Issue (\d+):缺少 FAQ 板块$/, (_m, n) => `Issue ${n}: Missing FAQ section`],
  [/^Issue (\d+):缺少对比类内容$/, (_m, n) => `Issue ${n}: Missing comparison content`],
  [/^Issue (\d+):标题缺乏问题式结构$/, (_m, n) => `Issue ${n}: Headings lack question-style structure`],

  // ---- Part 4 描述 ----
  [/^基于 (.+?) 的行业特点和现有内容，以下是推荐的 AI 语义场景覆盖矩阵：$/,
    (_m, name) => `Based on ${name}'s industry profile and existing content, here is the recommended AI semantic scenario coverage matrix:`],

  // ---- Part 4 use_case ----
  [/^第一次了解 (.+?)$/, (_m, name) => `First time learning about ${name}`],
  [/^在 (.+?) 和竞品之间选择$/, (_m, name) => `Choosing between ${name} and competitors`],
  [/^需要确认是否适合自己$/, () => `Need to confirm if it fits them`],
  [/^想了解更多功能或场景$/, () => `Want to learn more features or scenarios`],
  [/^不了解产品怎么选，需要购买指南$/, () => `Not sure how to choose; needs a buying guide`],
  [/^想确认性价比，和竞品比较$/, () => `Want to confirm value for money; comparing with competitors`],
  [/^关心材质、工艺、售后保障$/, () => `Cares about material, craftsmanship, after-sales`],
  [/^不知道该买什么，需要礼物推荐$/, () => `Not sure what to buy; needs gift recommendations`],
  [/^想了解新品、升级或补充购买$/, () => `Wants to learn about new products, upgrades`],
  [/^碎片时间浏览，需要快速了解$/, () => `Browsing in spare time; needs a quick overview`],
  [/^预算有限，需要性价比高的工具$/, () => `Limited budget; needs a cost-effective tool`],
  [/^关心安全性、集成能力、ROI$/, () => `Cares about security, integration, ROI`],
  [/^觉得现有工具太贵或不好用$/, () => `Finds current tool too expensive or hard to use`],
  [/^关心 API、文档、技术架构$/, () => `Cares about API, docs, tech architecture`],
  [/^需要简单易用的工具，不想学复杂系统$/, () => `Needs an easy-to-use tool, no complex systems`],
  [/^需要个人能负担的方案$/, () => `Needs an affordable personal plan`],
  [/^想了解某个话题或概念$/, () => `Wants to understand a topic or concept`],
  [/^需要系统性的知识体系$/, () => `Needs a systematic knowledge base`],
  [/^寻找可引用的权威来源$/, () => `Looking for authoritative citable sources`],
  [/^需要确认服务是否适合自己的情况$/, () => `Needs to confirm if the service fits their situation`],
  [/^在几家服务商之间比较$/, () => `Comparing several service providers`],
  [/^关心价格和服务范围$/, () => `Cares about price and service scope`],
  [/^不了解服务流程和预期效果$/, () => `Unfamiliar with service process and expected outcomes`],

  // ---- Part 4 ai_question ----
  [/^(.+?) 是什么？靠谱吗？$/, (_m, name) => `What is ${name}? Is it trustworthy?`],
  [/^(.+?) 和竞品比哪个好？$/, (_m, name) => `Is ${name} better than its competitors?`],
  [/^(.+?) 适合我吗？$/, (_m, name) => `Is ${name} right for me?`],
  [/^(.+?) 还有什么用法？$/, (_m, name) => `What else can you do with ${name}?`],
  [/^(.+?) 的产品适合新手吗？怎么选？$/, (_m, name) => `Is ${name}'s product good for beginners? How to choose?`],
  [/^(.+?) 和竞品比哪个更值得买？$/, (_m, name) => `Is ${name} or its competitors more worth buying?`],
  [/^(.+?) 的产品质量怎么样？有什么保障？$/, (_m, name) => `How is ${name}'s product quality? Any guarantees?`],
  [/^(.+?) 适合送礼吗？有什么推荐？$/, (_m, name) => `Is ${name} good for gifts? Any recommendations?`],
  [/^(.+?) 有什么新品推荐？$/, (_m, name) => `Any new product recommendations from ${name}?`],
  [/^(.+?) 是什么品牌？靠谱吗？$/, (_m, name) => `What brand is ${name}? Is it trustworthy?`],
  [/^(.+?) 适合小团队吗？价格贵不贵？$/, (_m, name) => `Is ${name} good for small teams? Pricey?`],
  [/^(.+?) 企业版有什么功能？安全吗？$/, (_m, name) => `What features does ${name} Enterprise have? Is it secure?`],
  [/^(.+?) 和 XX 比哪个好？迁移麻烦吗？$/, (_m, name) => `Is ${name} better than XX? Is migration difficult?`],
  [/^(.+?) 有 API 吗？技术文档全吗？$/, (_m, name) => `Does ${name} have an API? Are the docs complete?`],
  [/^(.+?) 容易上手吗？需要技术背景吗？$/, (_m, name) => `Is ${name} easy to learn? Need a technical background?`],
  [/^(.+?) 有免费版或个人版吗？$/, (_m, name) => `Does ${name} have a free or personal plan?`],
  [/^(.+?) 上的信息可信吗？$/, (_m, name) => `Is the information on ${name} credible?`],
  [/^(.+?) 有哪些深度内容？$/, (_m, name) => `What in-depth content does ${name} offer?`],
  [/^(.+?) 的内容可以引用吗？$/, (_m, name) => `Can ${name}'s content be cited?`],
  [/^(.+?) 适合我的情况吗？$/, (_m, name) => `Is ${name} right for my situation?`],
  [/^(.+?) 和 XX 服务有什么区别？$/, (_m, name) => `What's the difference between ${name} and XX's service?`],
  [/^(.+?) 的价格是多少？值不值？$/, (_m, name) => `What is ${name}'s pricing? Is it worth it?`],
  [/^(.+?) 的服务流程是怎样的？$/, (_m, name) => `What is ${name}'s service process?`],

  // ---- Part 4 page（具体行业，放在通用「关于」之前） ----
  [/^(.+?) 新手购买指南$/, (_m, name) => `${name} Beginner Buying Guide`],
  [/^(.+?) vs 竞品：性价比对比$/, (_m, name) => `${name} vs Competitors: Value Comparison`],
  [/^(.+?) 品质与售后详解$/, (_m, name) => `${name} Quality & After-sales Explained`],
  [/^(.+?) 礼物选购指南$/, (_m, name) => `${name} Gift Buying Guide`],
  [/^(.+?) 新品与升级指南$/, (_m, name) => `${name} New & Upgrade Guide`],
  [/^关于 (.+?)：品牌故事与承诺$/, (_m, name) => `About ${name}: Brand Story & Promise`],
  [/^(.+?) 小团队方案$/, (_m, name) => `${name} Small Team Plan`],
  [/^(.+?) 企业方案与安全$/, (_m, name) => `${name} Enterprise Plan & Security`],
  [/^(.+?) vs 竞品对比$/, (_m, name) => `${name} vs Competitor Comparison`],
  [/^(.+?) 技术文档与 API$/, (_m, name) => `${name} Docs & API`],
  [/^(.+?) 快速上手指南$/, (_m, name) => `${name} Quick Start Guide`],
  [/^(.+?) 个人\/免费方案$/, (_m, name) => `${name} Personal/Free Plan`],
  [/^关于 (.+?)：编辑方针与可信度$/, (_m, name) => `About ${name}: Editorial Policy & Credibility`],
  [/^(.+?) 内容导航与专题$/, (_m, name) => `${name} Content Navigation & Topics`],
  [/^(.+?) 引用与合作指南$/, (_m, name) => `${name} Citation & Partnership Guide`],
  [/^(.+?) 服务适用场景$/, (_m, name) => `${name} Service Use Cases`],
  [/^(.+?) vs 竞品服务对比$/, (_m, name) => `${name} vs Competitor Services`],
  [/^(.+?) 定价与价值说明$/, (_m, name) => `${name} Pricing & Value`],
  [/^(.+?) 服务流程与案例$/, (_m, name) => `${name} Service Process & Cases`],
  [/^(.+?) vs 竞品$/, (_m, name) => `${name} vs Competitors`],
  [/^(.+?) 适合什么人群$/, (_m, name) => `Who ${name} is best for`],
  [/^(.+?) 进阶指南$/, (_m, name) => `${name} Advanced Guide`],
  [/^(.+?) 适合什么样的用户？完整指南$/, (_m, name) => `${name} Complete Guide: Who It's Best For`],

  // ---- Part 5 优先页面（20 个模板） ----
  [/^(.+?) vs 竞品方案：全面对比$/, (_m, name) => `${name} vs Competitors: Full Comparison`],
  [/^(.+?) 适合什么样的用户？$/, (_m, name) => `Who is ${name} best for?`],
  [/^(.+?) 的优缺点分析$/, (_m, name) => `${name} Pros & Cons Analysis`],
  [/^(.+?) 定价是否合理？价值分析$/, (_m, name) => `Is ${name}'s pricing reasonable? Value analysis`],
  [/^什么时候应该选择 (.+?)？$/, (_m, name) => `When should you choose ${name}?`],
  [/^什么时候不建议使用 (.+?)？$/, (_m, name) => `When should you avoid ${name}?`],
  [/^(.+?) 入门指南：新用户必读$/, (_m, name) => `${name} Beginner Guide: Must-read`],
  [/^(.+?) 和替代方案的区别$/, (_m, name) => `${name} vs Alternatives`],
  [/^(.+?) 最常被问到的 20 个问题$/, (_m, name) => `Top 20 Questions About ${name}`],
  [/^关于 (.+?) 你需要知道的一切$/, (_m, name) => `Everything You Need to Know About ${name}`],
  [/^(.+?) 使用技巧与最佳实践$/, (_m, name) => `${name} Tips & Best Practices`],
  [/^(.+?) 的用户真实评价与案例$/, (_m, name) => `${name} Real User Reviews & Cases`],
  [/^如何最大化 (.+?) 的价值？$/, (_m, name) => `How to Maximize ${name}'s Value?`],
  [/^(.+?) 适合小团队\/个人吗？$/, (_m, name) => `Is ${name} good for small teams/individuals?`],
  [/^(.+?) 的安全性与数据保护$/, (_m, name) => `${name} Security & Data Protection`],
  [/^(.+?) 的更新与未来规划$/, (_m, name) => `${name} Updates & Roadmap`],
  [/^从 XX 迁移到 (.+?) 的指南$/, (_m, name) => `Guide: Migrating from XX to ${name}`],
  [/^(.+?) 与其他工具\/服务的集成$/, (_m, name) => `${name} Integrations with Other Tools/Services`],
  [/^(.+?) 的隐藏功能与高级用法$/, (_m, name) => `${name} Hidden Features & Advanced Usage`],
  [/^选择 (.+?) 的 10 个理由$/, (_m, name) => `10 Reasons to Choose ${name}`],

  // ---- Part 6 模板示例 ----
  [/^直接回答：(.+?) 最适合\[某类人群\]，尤其是当他们\[遇到什么情况\]时。但如果\[某种限制\]，可能不一定是最佳选择。$/,
    (_m, name) => `Direct answer: ${name} is best for [a certain audience], especially when they [encounter a situation]. But if [some limitation], it may not be the best choice.`],
  [/^什么样的用户最适合 (.+?)？$/, (_m, name) => `Who is ${name} best for?`],
  [/^什么情况下不建议使用 (.+?)？$/, (_m, name) => `When should you avoid using ${name}?`],
  [/^(.+?) 和替代方案怎么选？$/, (_m, name) => `How to choose between ${name} and alternatives?`],
  [/^从适合人群、价格、上手难度、核心优势等维度对比$/,
    () => `Compare across dimensions: audience fit, price, ease of use, core advantages`],
  [/^对于【目标人群】，如果他们正在【具体场景】下遇到【具体问题】，那么 (.+?) 是一个合适选择，因为它可以【解决方式】。它尤其适合【更具体情况】，但如果【某种限制】，可能不一定是最佳选择。$/,
    (_m, name) => `For [target audience], if they are facing [specific scenario] and encountering [specific problem], then ${name} is a suitable choice because it can [solution]. It's especially good for [more specific case], but if [some limitation], it may not be the best choice.`],

  // ---- Part 8 描述 & prompts ----
  [/^建议为 (.+?) 建立 AI Answer Share 监测机制，每月固定测试一组核心 prompt，关注三个维度：$/,
    (_m, name) => `Set up an AI Answer Share monitoring mechanism for ${name}, testing a fixed set of core prompts monthly and watching three dimensions:`],
  [/^(.+?) 是什么？$/, (_m, name) => `What is ${name}?`],
  [/^(.+?) 好用吗？$/, (_m, name) => `Is ${name} easy to use?`],
  [/^(.+?) 适合什么类型的用户？$/, (_m, name) => `What type of users is ${name} for?`],
  [/^(.+?) 和竞品有什么区别？$/, (_m, name) => `What's the difference between ${name} and competitors?`],
  [/^最好的\[通用\]工具\/产品推荐$/, () => `Best [general] tool/product recommendations`],
  [/^(.+?) vs 竞品 哪个好？$/, (_m, name) => `${name} vs competitors: which is better?`],
  [/^适合小团队的\[通用\]方案$/, () => `[General] solutions for small teams`],

  // ---- Part 9 结论 ----
  [/^当前最需要改进的是「(.+?)」维度，同时建议深化「(.+?)」的优势，建立更完整的 AI 答案素材库。$/,
    (_m, worst, best) => `The most urgent improvement is the '${DIM_NAME_EN[worst] || worst}' dimension, while deepening the strength of '${DIM_NAME_EN[best] || best}' to build a richer AI answer asset library.`],
  [/^建议优先优化「(.+?)」\((\d+)分\)和内容结构，然后系统性地补充对比内容和 FAQ。$/,
    (_m, worst, score) => `Prioritize optimizing '${DIM_NAME_EN[worst] || worst}' (${score}) and content structure, then systematically add comparison content and FAQ.`],
  [/^(.+?) 的 AEO (.+?)，总分 (\d+)\/100（([A-F]) 级）。$/,
    (_m, name, level, total, grade) => `${name}'s AEO ${LEVEL_EN[level] || level}, total score ${total}/100 (Grade ${grade}).`],

  // ---- 带数字的 scorer 模板 ----
  [/^✅ 页面有 (\d+) 个 H2 子标题$/, (_m, n) => `✅ Page has ${n} H2 subheadings`],
  [/^✅ 发现 (\d+) 个问题式 H2 标题（AI 偏好）$/, (_m, n) => `✅ Found ${n} question-style H2 headings (AI-preferred)`],
  [/^✅ 页面有 (\d+) 个 H3 小标题$/, (_m, n) => `✅ Page has ${n} H3 subheadings`],
  [/^✅ FAQ 包含 (\d+) 个问答项$/, (_m, n) => `✅ FAQ contains ${n} Q&A items`],
  [/^✅ 页面内容较丰富（(\d+) 段）$/, (_m, n) => `✅ Page content is fairly rich (${n} paragraphs)`],
  [/^✅ 发现 (\d+) 个问题式标题，语义覆盖较好$/, (_m, n) => `✅ Found ${n} question-style headings; semantic coverage is good`],
  [/^✅ 发现 (\d+) 个问题式标题$/, (_m, n) => `✅ Found ${n} question-style headings`],
  [/^✅ 包含 (\d+) 个场景关键词$/, (_m, n) => `✅ Contains ${n} scenario keywords`],
  [/^✅ 覆盖 (\d+) 种人群关键词$/, (_m, n) => `✅ Covers ${n} audience-keyword types`],
  [/^✅ 覆盖 (\d+) 个决策阶段（Top\/Mid\/Bottom）$/, (_m, n) => `✅ Covers ${n} decision stages (Top/Mid/Bottom)`],
  [/^✅ 检测到 Schema 标记（(.+?)）$/, (_m, types) => `✅ Schema markup detected (${types})`],
  [/^✅ (\d+)\/(\d+) 图片有 Alt 文本$/, (_m, a, b) => `✅ ${a}/${b} images have Alt text`],
  [/^仅 (\d+)\/(\d+) 图片有 Alt 文本$/, (_m, a, b) => `Only ${a}/${b} images have Alt text`],
  [/^HTTP 状态码 (\d+) 异常$/, (_m, n) => `HTTP status code ${n} is abnormal`],

  // ---- 带变量的 Part 2 优势 ----
  [/^网站有明确的页面标题「(.+?)」，有助于 AI 理解页面主题$/,
    (_m, title) => `Site has a clear page title "${title}", helping AI understand the page topic`],
  [/^已部署 Schema 结构化数据（(.+?)），有助于 AI 解析页面内容$/,
    (_m, types) => `Schema structured data deployed (${types}), helping AI parse page content`],
  [/^页面内容丰富（约 (\d+) 字符），有足够信息供 AI 提取$/,
    (_m, n) => `Page content is rich (~${n} chars), enough information for AI to extract`],

  // ---- 通用兜底：关于 X（必须放在最后，避免抢先匹配具体项） ----
  [/^关于 (.+?)$/, (_m, name) => `About ${name}`],
];

const EXACT_MAP = new Map<string, string>(Object.entries(EXACT));

/** 翻译单个子句（不含分号） */
function translateClause(c: string): string {
  if (!c) return c;
  const exact = EXACT_MAP.get(c);
  if (exact !== undefined) return exact;
  for (const [re, rep] of SKELETONS) {
    if (re.test(c)) {
      return typeof rep === 'function' ? c.replace(re, rep as any) : c.replace(re, rep);
    }
  }
  return c;
}

/** 翻译任意字符串：先按中文分号拆句，逐句翻译后拼接 */
export function translateString(s: string): string {
  if (!s || typeof s !== 'string') return s;
  if (s.includes('；')) {
    return s
      .split('；')
      .map((x) => translateClause(x.trim()))
      .join('; ');
  }
  return translateClause(s);
}

/**
 * 翻译 persona 字段名（固定枚举）
 */
const PERSONA_EN: Record<string, string> = {
  // 电商/零售
  '第一次购买的新用户': 'First-time buyer',
  '预算敏感的消费者': 'Budget-conscious consumer',
  '注重品质的专业用户': 'Quality-focused pro user',
  '给他人买礼物的用户': 'Gift buyer',
  '回头客/老用户': 'Returning customer',
  '移动端浏览用户': 'Mobile browser',
  // SaaS/软件
  '小团队/初创公司创始人': 'Small team / startup founder',
  '企业采购决策者': 'Enterprise procurement decision-maker',
  '从竞品切换的用户': 'User switching from competitors',
  '技术评估者/开发者': 'Technical evaluator / developer',
  '非技术背景的部门主管': 'Non-technical department lead',
  '自由职业者/个人用户': 'Freelancer / individual user',
  // 内容/媒体
  '信息搜索者': 'Information seeker',
  '深度学习者': 'Deep learner',
  '内容创作者': 'Content creator',
  // 服务/咨询
  '有明确需求的客户': 'Client with clear needs',
  '在比较服务商的客户': 'Client comparing providers',
  '预算有限的客户': 'Budget-limited client',
  '第一次使用服务的客户': 'First-time service client',
  // 默认
  '潜在客户': 'Potential customer',
  '对比中的用户': 'User comparing options',
  '即将决策的用户': 'User about to decide',
  '老用户': 'Existing user',
};
export function translatePersona(name: string): string {
  return PERSONA_EN[name] || name;
}

/**
 * 主入口：对完整报告做深度翻译
 */
export function translateReportContent(report: any, lang: 'zh-CN' | 'en-US'): any {
  if (lang === 'zh-CN') return report;

  const r = JSON.parse(JSON.stringify(report));

  // meta.summary
  if (r.meta?.summary) r.meta.summary = translateString(r.meta.summary);

  // ---- Part 1 ----
  if (r.part1_overview) {
    if (r.part1_overview.summary) r.part1_overview.summary = translateString(r.part1_overview.summary);
    if (r.part1_overview.dimensions) {
      r.part1_overview.dimensions = r.part1_overview.dimensions.map((d: any) => ({
        ...d,
        key_finding: translateString(d.key_finding),
      }));
    }
  }

  // ---- Part 2 ----
  if (r.part2_advantages?.items) {
    r.part2_advantages.items = r.part2_advantages.items.map((item: string) => translateString(item));
  }

  // ---- Part 3 ----
  if (r.part3_problems?.problems) {
    r.part3_problems.problems = r.part3_problems.problems.map((p: any) => ({
      ...p,
      title: translateString(p.title),
      detail: translateString(p.detail),
    }));
  }

  // ---- Part 4 ----
  if (r.part4_content_opportunities) {
    if (r.part4_content_opportunities.description) {
      r.part4_content_opportunities.description = translateString(r.part4_content_opportunities.description);
    }
    if (r.part4_content_opportunities.scenarios) {
      r.part4_content_opportunities.scenarios = r.part4_content_opportunities.scenarios.map((sc: any) => ({
        ...sc,
        persona: translatePersona(sc.persona),
        use_case: translateString(sc.use_case),
        ai_question: translateString(sc.ai_question),
        page: translateString(sc.page),
      }));
    }
  }

  // ---- Part 5 ----
  if (r.part5_priority_pages) {
    if (r.part5_priority_pages.description) {
      r.part5_priority_pages.description = translateString(r.part5_priority_pages.description);
    }
    if (r.part5_priority_pages.groups) {
      r.part5_priority_pages.groups = r.part5_priority_pages.groups.map((g: any) => ({
        ...g,
        name: translateString(g.name),
        pages: g.pages.map((p: string) => translateString(p)),
      }));
    }
    if (r.part5_priority_pages.top5) {
      r.part5_priority_pages.top5 = r.part5_priority_pages.top5.map((p: string) => translateString(p));
    }
  }

  // ---- Part 6 ----
  if (r.part6_page_template) {
    if (r.part6_page_template.description) {
      r.part6_page_template.description = translateString(r.part6_page_template.description);
    }
    if (r.part6_page_template.example) {
      const ex = r.part6_page_template.example;
      ex.page_title = translateString(ex.page_title);
      if (ex.structure) {
        ex.structure = ex.structure.map((item: any) => ({
          ...item,
          level: translateString(item.level),
          content: translateString(item.content),
        }));
      }
      ex.geo_template = translateString(ex.geo_template);
    }
  }

  // ---- Part 7 ----
  if (r.part7_technical_suggestions?.items) {
    r.part7_technical_suggestions.items = r.part7_technical_suggestions.items.map((item: string) => translateString(item));
  }

  // ---- Part 8 ----
  if (r.part8_measurement) {
    if (r.part8_measurement.description) {
      r.part8_measurement.description = translateString(r.part8_measurement.description);
    }
    if (r.part8_measurement.dimensions) {
      r.part8_measurement.dimensions = r.part8_measurement.dimensions.map((d: any) => ({
        ...d,
        description: translateString(d.description),
        prompts: d.prompts?.map((p: string) => translateString(p)) ?? d.prompts,
      }));
    }
  }

  // ---- Part 9 ----
  if (r.part9_conclusion) {
    const c = r.part9_conclusion;
    c.overview = translateString(c.overview);
    c.action = translateString(c.action);
    c.summary = translateString(c.summary);
  }

  // ---- dimension_details ----
  if (r.dimension_details) {
    r.dimension_details = r.dimension_details.map((d: any) => ({
      ...d,
      details: d.details?.map((detail: string) => translateString(detail)) ?? d.details,
      suggestions: d.suggestions?.map((sug: string) => translateString(sug)) ?? d.suggestions,
    }));
  }

  return r;
}
