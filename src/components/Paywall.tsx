interface Props {
  onPayClick: () => void;
}

export default function Paywall({ onPayClick }: Props) {
  return (
    <div className="relative">
      {/* 模糊遮罩 */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white z-10 flex flex-col items-center justify-end pb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4 border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">解锁完整报告</h3>
            <p className="text-gray-500 mb-1">您已查看免费部分（前 3/9 部分）</p>
            <p className="text-gray-500 mb-6 text-sm">支付后即可查看完整 9 部分报告并下载 Word 版本</p>
            <div className="text-3xl font-bold text-blue-600 mb-6">¥1.99</div>
            <button
              onClick={onPayClick}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              立即解锁完整报告
            </button>
            <p className="mt-3 text-xs text-gray-400">支持微信/支付宝扫码支付</p>
          </div>
        </div>
        <div className="h-40 bg-gray-50"></div>
      </div>
    </div>
  );
}
