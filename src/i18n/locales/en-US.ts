export const enUS = {
  common: {
    siteName: 'AI Search Optimization',
    back: 'Back',
    backToHome: 'Back to Home',
    reportNotFound: 'Report not found',
    loading: 'Loading...',
  },
  home: {
    badge: 'AI Search Engine Optimization',
    title: 'Can AI understand your website?',
    subtitle: 'Enter your website URL to get a professional AEO/GEO optimization analysis report. Learn how AI perceives your site and how to make AI more likely to recommend you.',
    inputPlaceholder: 'Enter website URL, e.g. https://example.com',
    analyze: 'Analyze Now',
    analyzing: 'Analyzing...',
    supportNote: 'Supports any publicly accessible website URL. Analysis takes approximately 10-30 seconds.',
    // Features
    featuresTitle: 'Core Features',
    f1Title: 'Five-Dimension AEO Score',
    f1Desc: 'Comprehensive AI-friendliness assessment across Content Structure, Decision Content, Credibility, Technical Foundation, and Page Experience',
    f2Title: 'Content-Type Coverage Analysis',
    f2Desc: 'Analyze whether your site covers comparison, alternatives, best-for/not-for, use-case, FAQ, and other AI-preferred content types',
    f3Title: 'Actionable Optimization Advice',
    f3Desc: 'Beyond scores — get specific page restructuring templates, content topic suggestions, and technical optimization checklists',
    // Value Proposition
    vpTitle: "It's not just SEO — it's about making AI want to recommend you",
    vpDesc: "The essence of GEO/AEO isn't making AI know 'who you are' — it's making AI know 'when to recommend you' across enough specific questions",
    // Pricing
    freeTitle: '📖 Free Version',
    paidTitle: '🔓 Full Version ¥99',
    freeIncluded: [
      '✅ AEO Overall Score & Grade',
      '✅ Five-Dimension Breakdown',
      '✅ Website Strengths Analysis',
      '✅ Key Issues Diagnosis',
      '✅ Content-Type Coverage Analysis',
    ],
    freeLocked: [
      'Full 10-Part Report',
      'Word Report Download',
    ],
    paidIncluded: [
      '✅ AEO Overall Score & Grade',
      '✅ Five-Dimension Breakdown',
      '✅ Website Strengths Analysis',
      '✅ Key Issues Diagnosis',
      '✅ Content-Type Coverage Analysis',
      '✅ Semantic Scenario Coverage Matrix',
      '✅ 20 Priority Page Topics',
      '✅ Page Restructuring Template',
      '✅ Technical Optimization Checklist',
      '✅ Effect Measurement Plan',
      '✅ Word Report Download',
    ],
    footerText: 'AI Search Optimization (aeo.miubox.cn) — Make AI Understand Your Website Better',
    sitemap: 'Sitemap',
    freeVsFull: 'Free vs Full Comparison',
  },
  report: {
    analyzeError: 'Analysis failed. Please check the URL or try again later.',
    loadError: 'Failed to load report',
    rateLimitSuggestion: 'Tip: The target website temporarily blocked the request, likely due to anti-bot/rate limiting. Please wait 30 seconds and retry, or try analyzing a different page.',
    downloadWord: 'Download Word Report',
    gradeLevel: (grade: string) => `Grade ${grade}`,
    gradeDesc: (grade: string): string => {
      switch (grade) {
        case 'A': return 'Excellent AEO performance — AI can easily understand and cite your site';
        case 'B': return 'Solid AEO foundation with clear room for improvement';
        case 'C': return 'Significant AEO improvement potential — systematic optimization recommended';
        case 'D': return 'Your site needs focused AEO optimization work';
        default: return 'Your site urgently needs comprehensive AEO optimization';
      }
    },
    seoTitle: (site: string) => `${site} AEO Analysis Report`,
    seoDesc: (site: string, score: number, grade: string) =>
      `${site} AI Search Optimization (AEO/GEO) analysis report. Overall score ${score}/100 (Grade ${grade}), five-dimension breakdown with detailed optimization advice.`,
    top5Label: 'Top 5 Priority Pages: ',
    examplePageLabel: 'Example Page: ',
    geoTemplateLabel: 'GEO/AEO Content Template: ',
    // Part 10: GEO Technical Checklist
    geoScoreLabel: 'GEO Technical Compliance Score: {score}/100 ({passed}/{total} auto-checks passed)',
    geoPass: 'Pass',
    geoFail: 'Needs Work',
    geoManual: 'Manual Check',
    // Locked report preview
    lockedPreviewTitle: 'The full report also includes (partial preview)',
    lockedPreviewHint: 'Unlock to view the full content',
  },
  paywall: {
    title: 'Unlock the Full Report',
    viewedFree: 'You have viewed the free portion (first 4/10 parts)',
    payHint: 'After payment, view the full 10-part report and download the Word version',
    price: '¥99',
    unlock: 'Unlock Full Report Now',
    payMethods: 'Supports WeChat Pay',
  },
  payment: {
    invalidId: 'Invalid report ID',
    title: 'Scan to Unlock the Full Report',
    amountHint: 'After payment: full 10-part report + Word download',
    qrNote: 'Please scan the QR code with WeChat to complete payment',
    qrWallets: 'WeChat Pay',
    orderPrefix: 'Order ID: ',
    wechatPayNow: 'Pay with WeChat Now',
    demoNote: 'Demo environment — click the button below to simulate payment',
    simulate: 'Simulate Successful Payment',
    back: 'Back to Report',
    success: 'Payment Successful!',
    redirecting: 'Redirecting to full report...',
    createOrderFail: 'Failed to create order',
    payFail: 'Payment failed',
  },
  loading: {
    title: 'Analyzing Your Website',
    steps: [
      { label: 'Visiting target website...', icon: '🌐' },
      { label: 'Analyzing page structure...', icon: '🔍' },
      { label: 'Detecting Schema markup...', icon: '📋' },
      { label: 'Evaluating content quality...', icon: '📝' },
      { label: 'Generating optimization report...', icon: '📊' },
    ],
    waitNote: 'This may take 10-30 seconds, please wait',
  },
  lang: {
    switchLabel: 'Language',
  },
  // ===== Report fixed-term translations (dimension names, section titles, table headers) =====
  reportTerms: {
    // Part 1: Core Judgment
    part1Title: 'I. Core Judgment',
    coreJudgmentLabel: '🔍 Core Judgment',
    dimensionSummaryLabel: 'Dimension Analysis Summary',
    priorityActionLabel: '⚡ Priority Action',
    // New five-dimension names (v2)
    dimContentStructure: 'Content Structure',
    dimDecisionContent: 'Decision Content',
    dimCredibility: 'Credibility',
    dimTechnicalBasis: 'Technical Foundation',
    dimPageExperience: 'Page Experience',
    // Table headers
    thDimension: 'Dimension',
    thWeight: 'Weight',
    thScore: 'Score',
    thKeyFinding: 'Key Finding',
    // Part 2-9 section titles (v2 numbering)
    part2Title: 'II. Current AEO Strengths',
    part3Title: 'III. Top AEO Issues',
    part4Title: 'IV. Content-Type Coverage Analysis',
    part5Title: 'V. Persona × Funnel × Use Case Content Opportunities',
    part6Title: 'VI. Top-Priority AEO Pages to Build',
    part7Title: 'VII. Page Restructuring Template',
    part8Title: 'VIII. Technical & Crawl Recommendations',
    part9Title: 'IX. AEO Effect Measurement Methods',
    // Part 4: Content Coverage
    coverageLabel: 'Content-Type Coverage',
    priorityLabel: 'Priority',
    // Part 5-9 sub-headings
    scenarioDescPrefix: 'Based on',
    scenarioDescSuffix: "'s industry profile and existing content, here is the recommended AI semantic scenario coverage matrix:",
    priorityPagesDesc: 'The following pages are grouped into four priority levels — implement them in order:',
    group1Name: 'Group 1: Comparison Pages',
    group2Name: 'Group 2: Best For / Not For Pages',
    group3Name: 'Group 3: Scenario / Use-Case Pages',
    group4Name: 'Group 4: FAQ / Knowledge Base Pages',
    templateDesc: "Below is an example page structure showing how to transform a standard product/service page into an AI-friendly 'Decision Answer Page':",
    eightElementsLabel: 'Eight AI-Citable Elements Checklist',
    techItemSchema: 'Add structured data markup (Product, FAQPage, Breadcrumb, Organization, Article, etc.) for core pages',
    techItemViewport: 'Add Viewport Meta tag for mobile responsiveness',
    techItemMetaDesc: 'Add unique Meta Description (50-160 chars) per page',
    measurementDescPrefix: 'We recommend establishing an AI Answer Share monitoring mechanism for',
    measurementDescSuffix: ', testing a set of core prompts monthly across three dimensions:',
    measureDimVisibility: 'AI Visibility',
    measureDimShare: 'Citation Share',
    measureDimAccuracy: 'Brand Narrative Accuracy',
    measureVisibilityDesc: 'Test 5-10 core questions monthly — check if your brand appears in AI recommended answers',
    measureShareDesc: 'Test 10-15 questions in ChatGPT, Perplexity, Gemini etc. — compare appearance frequency vs competitors',
    measureAccuracyDesc: 'Ask AI directly about your brand — check if responses are accurate and complete',
    // Problem prefix
    problemPrefix: 'Issue',
    noData: 'No data available',
    // Scenario table headers
    thPersona: 'Persona',
    thFunnel: 'Funnel Stage',
    thUseCase: 'Use Case',
    thAIQuestion: 'Likely AI Question',
    thRecommendedPage: 'Recommended Page',
  },
};
