import { FactCheckResult } from '../types';

interface FactCheckPanelProps {
  results: FactCheckResult[];
}

export default function FactCheckPanel({ results }: FactCheckPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'true': return 'bg-green-50 border-green-200 text-green-800';
      case 'false': return 'bg-red-50 border-red-200 text-red-800';
      case 'partially-true': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'unverified': return 'bg-gray-50 border-gray-200 text-gray-800';
      case 'misleading': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'true': return '✅ 사실';
      case 'false': return '❌ 허위';
      case 'partially-true': return '⚠️ 부분적 사실';
      case 'unverified': return '❓ 미확인';
      case 'misleading': return '🔶 오해의 소지';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✅</span>
        <h2 className="text-lg font-semibold text-gray-800">팩트체크 결과</h2>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
          다중 소스 교차 검증
        </span>
      </div>

      {results.map((result, index) => (
        <div key={index} className={`border rounded-xl p-5 ${getStatusColor(result.status)}`}>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-base">"{result.claim}"</h3>
            <span className="text-sm font-semibold whitespace-nowrap ml-4">
              {getStatusLabel(result.status)}
            </span>
          </div>

          <p className="text-sm opacity-80 mb-3">{result.explanation}</p>

          <div className="mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">근거</h4>
            <ul className="space-y-1">
              {result.evidence.map((ev, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="opacity-50">•</span> {ev}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">참고 소스</h4>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-white/50 px-2 py-1 rounded border border-black/5 hover:bg-white/80 transition-colors"
                >
                  {src.name} (신뢰도 {src.credibility}%)
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">📊 팩트체크 방법론</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• 다중 소스 교차 검증 (최소 2개 이상의 독립적 소스)</li>
          <li>• 공식 발표자료 및 1차 출처 확인</li>
          <li>• 통계 데이터 원본 추적</li>
          <li>• 맥락적 분석 및 생략된 정보 확인</li>
          <li>• 과거 유사 사례 비교</li>
        </ul>
      </div>
    </div>
  );
}
