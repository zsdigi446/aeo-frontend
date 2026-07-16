import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import PaymentPage from './pages/PaymentPage';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          <Route path="/payment/:reportId" element={<PaymentPage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
