import { useState, useEffect } from 'react';
import { createOrder, verifyPayment, simulatePay } from '../api';
import { useI18n } from '../i18n';

interface Props {
  reportId: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export default function PaymentQR({ reportId, onPaymentSuccess, onBack }: Props) {
  const { t } = useI18n();
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState<'loading' | 'pending' | 'paid' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    initOrder();
  }, []);

  useEffect(() => {
    if (status !== 'pending') return;
    const timer = setInterval(async () => {
      try {
        const res = await verifyPayment(orderId);
        if (res.status === 'paid') {
          setStatus('paid');
          setTimeout(onPaymentSuccess, 1500);
        }
      } catch { /* ignore poll errors */ }
    }, 3000);
    return () => clearInterval(timer);
  }, [status, orderId]);

  async function initOrder() {
    try {
      const res = await createOrder(reportId);
      setOrderId(res.order_id);
      setAmount(res.amount_yuan);
      setStatus('pending');
    } catch (e: any) {
      setError(e?.response?.data?.detail || t.payment.createOrderFail);
      setStatus('error');
    }
  }

  async function handleSimulatePay() {
    try {
      await simulatePay(orderId);
      setStatus('paid');
      setTimeout(onPaymentSuccess, 1500);
    } catch (e: any) {
      setError(e?.response?.data?.detail || t.payment.payFail);
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">{t.payment.success}</h3>
        <p className="text-gray-500">{t.payment.redirecting}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">{t.payment.title}</h2>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-blue-600 mb-1">¥{amount}</div>
          <p className="text-sm text-gray-400">{t.payment.amountHint}</p>
        </div>

        {/* 模拟二维码 */}
        <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
          <div className="w-36 h-36 bg-white rounded-xl flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-blue-600 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11 0h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
            </svg>
            <span className="text-xs text-gray-400">{t.payment.qrWallets}</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mb-6">
          {t.payment.qrNote}<br />
          {t.payment.orderPrefix}{orderId}
        </p>

        {/* 模拟支付按钮 */}
        <div className="border-t pt-4">
          <p className="text-center text-xs text-gray-400 mb-3">{t.payment.demoNote}</p>
          <button
            onClick={handleSimulatePay}
            className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors cursor-pointer font-medium"
          >
            {t.payment.simulate}
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-3 py-2.5 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          {t.payment.back}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}
