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
};
