import { useParams, useNavigate } from 'react-router-dom';
import PaymentQR from '../components/PaymentQR';
import { useI18n } from '../i18n';

export default function PaymentPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  if (!reportId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{t.payment.invalidId}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <PaymentQR
        reportId={reportId}
        onPaymentSuccess={() => {
          // 标记该报告已支付，ReportPage 检测后自动请求完整版
          sessionStorage.setItem(`aeo_paid_${reportId}`, '1');
          navigate(`/report/${reportId}?paid=1`, { replace: true });
        }}
        onBack={() => navigate(`/report/${reportId}`)}
      />
    </div>
  );
}
