import { AISummary } from '../types';

interface AISummaryPanelProps {
  summary: AISummary;
  query: string;
}

export default function AISummaryPanel({ summary, query }: AISummaryPanelProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🤖</span>
        <h2 className="text-lg font-semibold text-gray-800">AI 종합 분석 요약</h2>
        <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full text-gray-500 border border-gray-200">
          신뢰도 {summary.confidence}%
        </span>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">{summary.overview}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <span>📌</span> 핵심 포인트
          </h3>
          <ul className="space-y-1.5">
            {summary.keyPoints.map((point, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <span>🤝</span> 합의된 의견
          </h3>
          <p className="text-sm text-gray-600 mb-3">{summary.consensus}</p>
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <span>⚡</span> 논쟁 포인트
          </h3>
          <ul className="space-y-1">
            {summary.controversies.map((c, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">⚠</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
