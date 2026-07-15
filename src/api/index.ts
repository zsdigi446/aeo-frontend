import axios from 'axios';
import type { AnalyzeResponse, ReportResponse, OrderResponse, VerifyResponse } from '../types/report';

// Vercel 上通过环境变量 VITE_API_URL 指向 Render 后端
// 本地开发时回退到空字符串（直接请求 /analyze 等路径）
const API_BASE = import.meta.env.VITE_API_URL || '';
const api = axios.create({ baseURL: API_BASE });

export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  const { data } = await api.post('/analyze', { url });
  return data;
}

export async function getReport(reportId: string, type: 'free' | 'full' = 'free'): Promise<ReportResponse> {
  const { data } = await api.get(`/report/${reportId}`, { params: { type } });
  return data;
}

export async function createOrder(reportId: string): Promise<OrderResponse> {
  const { data } = await api.post('/payment/create', { report_id: reportId });
  return data;
}

export async function verifyPayment(orderId: string): Promise<VerifyResponse> {
  const { data } = await api.get(`/payment/verify/${orderId}`);
  return data;
}

export async function simulatePay(orderId: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/payment/simulate-pay', { order_id: orderId });
  return data;
}

export function getWordDownloadUrl(reportId: string): string {
  return `${API_BASE}/report/${reportId}/word`;
}
