export const zhCN = {
  common: {
    siteName: 'AI搜索优化',
    back: '返回',
    backToHome: '返回首页',
    reportNotFound: '报告不存在',
    loading: '加载中...',
  },
  home: {
    badge: 'AI 搜索引擎优化',
    title: '您的网站，AI 能理解吗？',
    subtitle: '输入您的网站 URL，获取专业的 AEO/GEO 优化分析报告。了解 AI 如何看待您的网站，以及如何让 AI 更愿意推荐您。',
    inputPlaceholder: '输入网站 URL，例如 https://example.com',
    analyze: '开始分析',
    analyzing: '分析中...',
    supportNote: '支持任意公开可访问的网站 URL，分析过程约需 10-30 秒',
    // 功能特性
    featuresTitle: 'AI搜索优化核心功能',
    f1Title: '五维 AEO 评分',
    f1Desc: '从内容结构、决策内容、可信度、技术基础、页面体验五个维度全面评估网站 AI 友好度',
    f2Title: '内容类型覆盖分析',
    f2Desc: '分析网站是否覆盖了对比、替代品、适合/不适合、场景用例、FAQ 等 AI 偏好引用的内容类型',
    f3Title: '可操作优化建议',
    f3Desc: '不只是评分，更有具体的页面重构模板、内容选题建议和技术优化清单',
    // 价值主张
    vpTitle: '不只是 SEO，而是让 AI 愿意推荐你',
    vpDesc: 'GEO/AEO 的本质不是让 AI 知道"你是谁"，而是让 AI 在足够多的具体问题里知道"什么时候应该推荐你"',
    // 套餐
    freeTitle: '📖 免费版',
    paidTitle: '🔓 完整版 ¥1.99',
    freeIncluded: [
      '✅ AEO 综合评分与等级',
      '✅ 五维分项评分',
      '✅ 网站优势分析',
      '✅ 当前主要问题诊断',
      '✅ 内容类型覆盖分析',
    ],
    freeLocked: [
      '完整 9 部分报告',
      'Word 报告下载',
    ],
    paidIncluded: [
      '✅ AEO 综合评分与等级',
      '✅ 五维分项评分',
      '✅ 网站优势分析',
      '✅ 当前主要问题诊断',
      '✅ 内容类型覆盖分析',
      '✅ 语义场景覆盖矩阵',
      '✅ 20 个优先页面选题',
      '✅ 页面重构模板',
      '✅ 技术优化清单',
      '✅ 效果衡量方案',
      '✅ Word 报告下载',
    ],
    footerText: 'AI搜索优化（aeo.miubox.cn）— 让 AI 更懂你的网站',
    sitemap: '站点地图',
    freeVsFull: '免费版与完整版对比',
  },
  report: {
    analyzeError: '分析失败，请检查网址是否正确或稍后重试',
    loadError: '加载报告失败',
    rateLimitSuggestion: '提示：目标网站临时拒绝了请求，可能是反爬/限流机制触发。建议等待 30 秒后重试，或尝试分析其他页面。',
    downloadWord: '下载 Word 报告',
    gradeLevel: (grade: string) => `${grade} 级`,
    gradeDesc: (grade: string): string => {
      switch (grade) {
        case 'A': return '网站 AEO 表现优秀，AI 容易理解和引用';
        case 'B': return '网站 AEO 基础良好，有明确优化空间';
        case 'C': return '网站 AEO 有较大提升空间，建议系统性优化';
        case 'D': return '网站需要重点进行 AEO 优化改造';
        default: return '网站急需全面的 AEO 优化';
      }
    },
    seoTitle: (site: string) => `${site} AEO 分析报告`,
    seoDesc: (site: string, score: number, grade: string) =>
      `${site} 的AI搜索优化(AEO/GEO)分析报告。综合评分 ${score}/100（${grade}级），五维分项评估，附详细优化建议。`,
    top5Label: '优先级最高的 5 篇：',
    examplePageLabel: '示例页面：',
    geoTemplateLabel: 'GEO/AEO 内容模板：',
  },
  paywall: {
    title: '解锁完整报告',
    viewedFree: '您已查看免费部分（前 4/9 部分）',
    payHint: '支付后即可查看完整 9 部分报告并下载 Word 版本',
    price: '¥1.99',
    unlock: '立即解锁完整报告',
    payMethods: '支持微信/支付宝扫码支付',
  },
  payment: {
    invalidId: '无效的报告 ID',
    title: '扫码支付解锁完整报告',
    amountHint: '支付后即可查看完整 9 部分报告 + 下载 Word 版',
    qrNote: '请使用微信或支付宝扫描二维码完成支付',
    qrWallets: '微信 / 支付宝',
    orderPrefix: '订单号：',
    demoNote: '演示环境 — 点击下方按钮模拟支付',
    simulate: '模拟支付成功',
    back: '返回报告',
    success: '支付成功！',
    redirecting: '正在跳转到完整报告...',
    createOrderFail: '创建订单失败',
    payFail: '支付失败',
  },
  loading: {
    title: '正在分析您的网站',
    steps: [
      { label: '正在访问目标网站...', icon: '🌐' },
      { label: '分析页面结构...', icon: '🔍' },
      { label: '检测 Schema 标记...', icon: '📋' },
      { label: '评估内容质量...', icon: '📝' },
      { label: '生成优化报告...', icon: '📊' },
    ],
    waitNote: '这可能需要 10-30 秒，请耐心等待',
  },
  lang: {
    switchLabel: '语言',
  },
  // ===== 报告正文中的固定术语翻译（维度名、章节标题、表头等） =====
  reportTerms: {
    // Part 1: Core Judgment
    part1Title: '一、核心判断',
    coreJudgmentLabel: '🔍 核心判断',
    dimensionSummaryLabel: '维度分析摘要',
    priorityActionLabel: '⚡ 优先行动',
    // 新五维度名 (v2)
    dimContentStructure: '内容结构',
    dimDecisionContent: '决策内容',
    dimCredibility: '可信度',
    dimTechnicalBasis: '技术基础',
    dimPageExperience: '页面体验',
    // 表头
    thDimension: '维度',
    thWeight: '权重',
    thScore: '评分',
    thKeyFinding: '关键发现',
    // Part 2-9 章节标题 (v2 编号)
    part2Title: '二、网站当前 AEO 优势',
    part3Title: '三、当前最大 AEO 问题',
    part4Title: '四、内容类型覆盖分析',
    part5Title: '五、Persona × Funnel × Use Case 内容机会',
    part6Title: '六、最值得优先做的 AEO 页面',
    part7Title: '七、页面重构模板',
    part8Title: '八、技术与抓取层面建议',
    part9Title: '九、AEO 效果衡量方式',
    // Part 4: Content Coverage
    coverageLabel: '内容类型覆盖',
    priorityLabel: '优先级',
    // Part 5-9 子标题
    scenarioDescPrefix: '基于',
    scenarioDescSuffix: '的行业特点和现有内容，以下是推荐的 AI 语义场景覆盖矩阵：',
    priorityPagesDesc: '以下页面按优先级分为四组，建议按顺序逐步实施：',
    group1Name: '第一组：对比类页面',
    group2Name: '第二组：适合/不适合类页面',
    group3Name: '第三组：场景/用例页面',
    group4Name: '第四组：FAQ/知识库页面',
    templateDesc: '以下是一个示例页面结构，展示如何将普通产品/服务页面改造成 AI 友好的「决策答案页」：',
    eightElementsLabel: '八大 AI 可引用元素检查清单',
    techItemSchema: '为核心页面添加 Product、FAQPage、Breadcrumb、Organization、Article 等结构化数据标记',
    techItemViewport: '添加 Viewport Meta 标签，确保移动端适配',
    techItemMetaDesc: '为每个页面添加独特的 Meta Description（50-160 字符）',
    measurementDescPrefix: '建议为',
    measurementDescSuffix: '建立 AI Answer Share 监测机制，每月固定测试一组核心 prompt，关注三个维度：',
    measureDimVisibility: 'AI 可见度',
    measureDimShare: '引用份额',
    measureDimAccuracy: '品牌叙事准确度',
    measureVisibilityDesc: '每月测试 5-10 个核心问题，检查品牌是否出现在 AI 推荐答案中',
    measureShareDesc: '在 ChatGPT、Perplexity、Gemini 等工具中测试 10-15 个问题，对比竞品出现频率',
    measureAccuracyDesc: '直接问 AI 关于品牌的问题，检查回答是否准确、完整',
    // 问题前缀
    problemPrefix: '问题',
    noData: '暂无数据',
    // 场景表头
    thPersona: '用户画像',
    thFunnel: '漏斗阶段',
    thUseCase: '使用场景',
    thAIQuestion: 'AI 可能提问',
    thRecommendedPage: '推荐页面',
  },
};
