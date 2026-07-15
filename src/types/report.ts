// AEO 报告类型定义

export interface DimensionScore {
  name: string;
  score: number;
  max_score: number;
  weight: number;
  key_finding: string;
}

export interface Part1Overview {
  title: string;
  total_score: number;
  grade: string;
  summary: string;
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

export interface Scenario {
  persona: string;
  funnel: string;
  use_case: string;
  ai_question: string;
  page: string;
}

export interface Part4Opportunities {
  title: string;
  description: string;
  scenarios: Scenario[];
}

export interface PageGroup {
  name: string;
  pages: string[];
}

export interface Part5PriorityPages {
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
}

export interface Part6Template {
  title: string;
  description: string;
  example: TemplateExample;
}

export interface Part7Technical {
  title: string;
  items: string[];
}

export interface MeasurementDim {
  name: string;
  description: string;
  prompts: string[];
}

export interface Part8Measurement {
  title: string;
  description: string;
  dimensions: MeasurementDim[];
}

export interface Part9Conclusion {
  title: string;
  overview: string;
  action: string;
  summary: string;
}

export interface ReportMeta {
  url: string;
  domain: string;
  site_name: string;
  total_score: number;
  grade: string;
  summary: string;
}

export interface FreeReport {
  meta: ReportMeta;
  part1_overview: Part1Overview;
  part2_advantages: Part2Advantages;
  part3_problems: Part3Problems;
  dimension_details: DimensionDetail[];
}

export interface DimensionDetail {
  name: string;
  score: number;
  weight: number;
  details: string[];
  suggestions: string[];
}

export interface FullReport {
  meta: ReportMeta;
  part1_overview: Part1Overview;
  part2_advantages: Part2Advantages;
  part3_problems: Part3Problems;
  part4_content_opportunities: Part4Opportunities;
  part5_priority_pages: Part5PriorityPages;
  part6_page_template: Part6Template;
  part7_technical_suggestions: Part7Technical;
  part8_measurement: Part8Measurement;
  part9_conclusion: Part9Conclusion;
  dimension_details: DimensionDetail[];
}

export interface AnalyzeResponse {
  success: boolean;
  report_id: string;
  total_score: number;
  grade: string;
  site_name: string;
}

export interface ReportResponse {
  success: boolean;
  data: FreeReport | FullReport;
  is_full: boolean;
  total_parts?: number;
  free_parts?: number;
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  order_id: string;
  amount: number;
  amount_yuan: number;
  status: string;
  qr_note: string;
}

export interface VerifyResponse {
  success: boolean;
  order_id: string;
  status: string;
}
