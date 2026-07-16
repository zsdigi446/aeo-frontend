export const enUS = {
  common: {
    siteName: 'AI Search Optimizer',
    back: 'Back',
    backToHome: 'Back to Home',
    reportNotFound: 'Report not found',
    loading: 'Loading...',
  },
  home: {
    badge: 'AI Search Engine Optimization',
    title: 'Can AI understand your website?',
    subtitle: 'Enter your website URL to get a professional AEO/GEO optimization report. Understand how AI sees your site and how to make AI recommend you.',
    inputPlaceholder: 'Enter website URL, e.g. https://example.com',
    analyze: 'Start Analysis',
    analyzing: 'Analyzing...',
    supportNote: 'Any publicly accessible website URL is supported. Analysis takes about 10-30 seconds.',
    // Features
    featuresTitle: 'Core Features of AI Search Optimization',
    f1Title: 'Five-Dimension AEO Score',
    f1Desc: 'Comprehensively evaluate your site\'s AI-friendliness across five dimensions: content structure, semantic coverage, credibility, technical foundation, and page experience',
    f2Title: 'Scenario Coverage Analysis',
    f2Desc: 'Based on the Persona × Funnel × Use Case matrix, analyze how many AI search scenarios your site covers',
    f3Title: 'Actionable Optimization Advice',
    f3Desc: 'Not just scores, but concrete page reconstruction templates, content topic ideas, and technical optimization checklists',
    // Value proposition
    vpTitle: 'Not just SEO — make AI want to recommend you',
    vpDesc: 'The essence of GEO/AEO is not letting AI know "who you are", but letting AI know "when to recommend you" across enough specific questions',
    // Plans
    freeTitle: '📖 Free Version',
    paidTitle: '🔓 Full Version ¥1.99',
    freeIncluded: [
      '✅ AEO overall score & grade',
      '✅ Five-dimension breakdown',
      '✅ Site strengths analysis',
      '✅ Current issues diagnosis',
    ],
    freeLocked: [
      'Full 9-part report',
      'Word report download',
    ],
    paidIncluded: [
      '✅ AEO overall score & grade',
      '✅ Five-dimension breakdown',
      '✅ Site strengths analysis',
      '✅ Current issues diagnosis',
      '✅ Semantic scenario coverage matrix',
      '✅ 20 priority page topics',
      '✅ Page reconstruction templates',
      '✅ Technical optimization checklist',
      '✅ Effect measurement plan',
      '✅ Word report download',
    ],
    footerText: 'AI Search Optimizer (aeo.miubox.com) — Help AI understand your website',
    sitemap: 'Sitemap',
  },
  report: {
    analyzeError: 'Analysis failed. Please check the URL or try again later.',
    loadError: 'Failed to load report',
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
  },
  paywall: {
    title: 'Unlock the Full Report',
    viewedFree: 'You have viewed the free portion (first 3/9 parts)',
    payHint: 'After payment, view the full 9-part report and download the Word version',
    price: '¥1.99',
    unlock: 'Unlock Full Report Now',
    payMethods: 'Supports WeChat / Alipay QR payment',
  },
  payment: {
    invalidId: 'Invalid report ID',
    title: 'Scan to Unlock the Full Report',
    amountHint: 'After payment: full 9-part report + Word download',
    qrNote: 'Please scan the QR code with WeChat or Alipay to complete payment',
    qrWallets: 'WeChat / Alipay',
    orderPrefix: 'Order ID: ',
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
    // Part 1
    part1Title: 'I. AEO Health Score Overview',
    // Dimension names
    dimContentStructure: 'Content Structure',
    dimSemanticCoverage: 'Semantic Coverage',
    dimCredibility: 'Credibility',
    dimTechnicalBasis: 'Technical Foundation',
    dimPageExperience: 'Page Experience',
    // Table headers
    thDimension: 'Dimension',
    thWeight: 'Weight',
    thScore: 'Score',
    thKeyFinding: 'Key Finding',
    // Part 2-9 section titles
    part2Title: 'II. Current AEO Strengths',
    part3Title: 'III. Top AEO Issues',
    part4Title: 'IV. Persona × Funnel × Use Case Content Opportunities',
    part5Title: 'V. Top-Priority AEO Pages to Build',
    part6Title: 'VI. Page Restructuring Template',
    part7Title: 'VII. Technical & Crawl Recommendations',
    part8Title: 'VIII. AEO Effect Measurement Methods',
    part9Title: 'IX. Final Verdict',
    // Part 4-8 sub-headings
    scenarioDescPrefix: 'Based on',
    scenarioDescSuffix: "'s industry profile and existing content, here is the recommended AI semantic scenario coverage matrix:",
    priorityPagesDesc: 'The following pages are grouped into four priority levels — implement them in order:',
    group1Name: 'Group 1: Comparison Pages',
    group2Name: 'Group 2: Best For / Not For Pages',
    group3Name: 'Group 3: Scenario / Use-Case Pages',
    group4Name: 'Group 4: FAQ / Knowledge Base Pages',
    templateDesc: "Below is an example page structure showing how to transform a standard product/service page into an AI-friendly 'Decision Answer Page':",
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
    conclusionSummaryPrefix: "Key recommendation: don't treat your website as just a display window — upgrade it into an 'AI Decision Answer Library' so that in enough specific questions, AI knows when to recommend you.",
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
