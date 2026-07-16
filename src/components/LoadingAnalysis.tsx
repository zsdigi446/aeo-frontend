import { useI18n } from '../i18n';

export default function LoadingAnalysis() {
  const { t } = useI18n();
  const steps = t.loading.steps;

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🤖</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t.loading.title}</h3>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 text-gray-500">
            <span className="text-lg">{step.icon}</span>
            <span className="text-sm">{step.label}</span>
            <svg className="w-4 h-4 text-green-500 animate-pulse ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-gray-400">{t.loading.waitNote}</p>
    </div>
  );
}
