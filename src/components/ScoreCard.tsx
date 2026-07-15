interface Props {
  score: number;
  grade: string;
  siteName: string;
}

function getGradeColor(grade: string) {
  switch (grade) {
    case 'A': return 'text-green-600 bg-green-50';
    case 'B': return 'text-blue-600 bg-blue-50';
    case 'C': return 'text-yellow-600 bg-yellow-50';
    case 'D': return 'text-orange-600 bg-orange-50';
    default: return 'text-red-600 bg-red-50';
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

export default function ScoreCard({ score, grade, siteName }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto">
      <p className="text-gray-500 text-sm mb-2">{siteName}</p>
      <div className="relative inline-flex items-center justify-center mb-4">
        <svg className="w-36 h-36" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="62" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="70" cy="70" r="62"
            fill="none"
            stroke={score >= 80 ? '#16a34a' : score >= 60 ? '#2563eb' : score >= 40 ? '#ca8a04' : '#dc2626'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 389.56} 389.56`}
            transform="rotate(-90 70 70)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-gray-400 text-sm">/ 100</span>
        </div>
      </div>
      <div className={`inline-block px-4 py-1.5 rounded-full text-lg font-bold ${getGradeColor(grade)}`}>
        {grade} 级
      </div>
      <p className="mt-3 text-sm text-gray-500">
        {grade === 'A' && '网站 AEO 表现优秀，AI 容易理解和引用'}
        {grade === 'B' && '网站 AEO 基础良好，有明确优化空间'}
        {grade === 'C' && '网站 AEO 有较大提升空间，建议系统性优化'}
        {grade === 'D' && '网站需要重点进行 AEO 优化改造'}
        {grade === 'F' && '网站急需全面的 AEO 优化'}
      </p>
    </div>
  );
}
