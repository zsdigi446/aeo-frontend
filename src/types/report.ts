// AEO 报告类型定义 v2 — 对齐 AEO Expert 方法论

export interface DimensionScore {
  name: string;
  score: number;
  max_score: number;
  weight: number;
  key_finding: string;
}

export interface Part1CoreJudgment {
  title: string;
  overview_score: string;
  summary: string;
  judgment: string;
  dimension_summary: string[];
  priority_action: string;
  dimensions: DimensionScore[];
}

export interface Part2Advantages {
  title: string;
  items: string[];
}

export interface Problem {
  id: number;
  title: string;
  detail: string;
}

export interface Part3Problems {
  title: string;
  problems: Problem[];
}

export interface ContentTypeItem {
  type: string;
  covered: boolean;
  priority: string;
  description: string;
}

export interface Part4ContentCoverage {
  title: string;
  description: string;
  covered_count: number;
  total_count: number;
  content_types: ContentTypeItem[];
}

export interface Scenario {
  persona: string;
  funnel: string;
  use_case: string;
  ai_question: string;
  page: string;
}

export interface Part5Opportunities {
  title: string;
  description: string;
  scenarios: Scenario[];
}

export interface PageGroup {
  name: string;
  pages: string[];
}

export interface Part6PriorityPages {
  title: string;
  description: string;
  groups: PageGroup[];
  top5: string[];
}

export interface TemplateItem {
  level: string;
  content: string;
}

export interface TemplateExample {
  page_title: string;
  structure: TemplateItem[];
  geo_template: string;
  eight_elements?: string[];
}

export interface Part7Template {
  title: string;
  description: string;
  example: TemplateExample;
}

export interface Part8Technical {
  title: string;
  summary?: string;
  items: string[];
}

export interface GeoChecklistSection {
  key: string;
  name: string;
  status: 'pass' | 'fail' | 'manual';
  score: number | null;
  findings: string[];
  suggestions: string[];
}

export interface Part10GeoChecklist {
  title: string;
  principle: string;
  passed_count: number;
  auto_count: number;
  geo_score: number;
  sections: GeoChecklistSection[];
}

export interface MeasurementDim {
  name: string;
  description: string;
  prompts: string[];
}

export interface Part9Measurement {
  title: string;
  description: string;
  dimensions: MeasurementDim[];
}

export interface ReportMeta {
  url: string;
  domain: string;
  site_name: string;
  total_score: number;
  grade: string;
  summary: string;
  industry?: string;
}

export interface DimensionDetail {
  name: string;
  score: number;
  weight: number;
  details: string[];
  suggestions: string[];
}

export interface FreeReport {
  meta: ReportMeta;
  part1_core_judgment: Part1CoreJudgment;
  part2_advantages: Part2Advantages;
  part3_problems: Part3Problems;
  part4_content_coverage: Part4ContentCoverage;
  dimension_details: DimensionDetail[];
}

export interface FullReport extends FreeReport {
  part5_opportunities: Part5Opportunities;
  part6_priority_pages: Part6PriorityPages;
  part7_page_template: Part7Template;
  part8_technical: Part8Technical;
  part9_measurement: Part9Measurement;
  part10_geo_checklist: Part10GeoChecklist;
}

export interface AnalyzeResponse {
  success: boolean;
  report_id: string;
  total_score: number;
  grade: string;
  site_name: string;
  report?: FullReport;
}

export interface LockedSectionPreview {
  key: string;
  title: string;
  preview: string[];
}

export interface ReportResponse {
  success: boolean;
  data: FreeReport | FullReport;
  is_full: boolean;
  total_parts?: number;
  free_parts?: number;
  locked_preview?: LockedSectionPreview[];
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  order_id: string;
  amount: number;
  amount_yuan: number;
  status: string;
  is_wechat?: boolean;
  pay_type?: 'native' | 'h5';
  code_url?: string;
  h5_url?: string;
  qr_note?: string;
  error?: string;
}

export interface VerifyResponse {
  success: boolean;
  order_id: string;
  status: string;
}
