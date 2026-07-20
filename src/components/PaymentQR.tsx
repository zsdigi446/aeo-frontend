import { useState, useEffect } from 'react';
import { createOrder, verifyPayment, simulatePay } from '../api';
import { QRCodeSVG } from 'qrcode.react';
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
  const [isWechat, setIsWechat] = useState(false);
  const [payType, setPayType] = useState<'native' | 'h5'>('native');
  const [codeUrl, setCodeUrl] = useState('');
  const [h5Url, setH5Url] = useState('');
  const [qrNote, setQrNote] = useState('');
  const [status, setStatus] = useState<'loading' | 'pending' | 'paid' | 'error'>('loading');
  const [error, setError] = useState('');

  const isMobile = typeof navigator !== 'undefined' &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    initOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const res = await createOrder(reportId, isMobile ? 'mobile' : 'pc');
      setOrderId(res.order_id);
      setAmount(res.amount_yuan);
      setIsWechat(!!res.is_wechat);
      setPayType(res.pay_type || 'native');
      setCodeUrl(res.code_url || '');
      setH5Url(res.h5_url || '');
      setQrNote(res.qr_note || '');
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

  function handleH5Pay() {
    if (h5Url) {
      window.location.href = h5Url;
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

        {/* 真实微信支付：Native 扫码 */}
        {isWechat && payType === 'native' && (
          <div className="w-48 h-48 mx-auto mb-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-3">
            {codeUrl ? (
              <QRCodeSVG value={codeUrl} size={168} level="M" includeMargin={false} />
            ) : (
              <span className="text-xs text-gray-400">二维码生成中…</span>
            )}
          </div>
        )}

        {/* 真实微信支付：H5 跳转 */}
        {isWechat && payType === 'h5' && (
          <button
            onClick={handleH5Pay}
            className="w-full py-3 mb-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors cursor-pointer font-medium text-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 3C4.36 3 1 5.79 1 9.2c0 1.94.98 3.66 2.52 4.84L3 17l2.6-1.34c.74.2 1.53.31 2.36.31.22 0 .43-.01.64-.03a5.7 5.7 0 01-.36-2.02c0-3.18 2.87-5.75 6.4-5.75.23 0 .45.01.67.03C14.9 5.27 11.98 3 8.5 3zm-2.3 3.1c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm4.3 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zM16 11c-3.04 0-5.6 2.1-5.6 4.7 0 2.59 2.56 4.7 5.6 4.7.66 0 1.3-.1 1.9-.28L21 21l-.5-1.7C21.5 18.4 22 17.2 22 15.9c0-2.6-2.2-4.7-5-4.7zm-1.9 2.5c.45 0 .8.35.8.8s-.35.8-.8.8-.8-.35-.8-.8.35-.8.8-.8zm3.8 0c.45 0 .8.35.8.8s-.35.8-.8.8-.8-.35-.8-.8.35-.8.8-.8z" />
            </svg>
            {t.payment.wechatPayNow}
          </button>
        )}

        {/* 模拟模式：假二维码 + 模拟按钮 */}
        {!isWechat && (
          <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
            <div className="w-36 h-36 bg-white rounded-xl flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-blue-600 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11 0h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
              </svg>
              <span className="text-xs text-gray-400">{t.payment.qrWallets}</span>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mb-6">
          {qrNote || t.payment.qrNote}<br />
          {t.payment.orderPrefix}{orderId}
        </p>

        {/* 模拟支付按钮（仅模拟模式显示） */}
        {!isWechat && (
          <div className="border-t pt-4">
            <p className="text-center text-xs text-gray-400 mb-3">{t.payment.demoNote}</p>
            <button
              onClick={handleSimulatePay}
              className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors cursor-pointer font-medium"
            >
              {t.payment.simulate}
            </button>
          </div>
        )}

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
