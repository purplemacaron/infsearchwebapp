import { FactCheckResult } from '../types';

interface FactCheckPanelProps {
  results: FactCheckResult[];
}

export default function FactCheckPanel({ results }: FactCheckPanelProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'true': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: '사실 확인', accent: 'bg-emerald-500' };
      case 'false': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', label: '허위', accent: 'bg-rose-500' };
      case 'partially-true': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: '부분적 사실', accent: 'bg-amber-500' };
      case 'unverified': return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', label: '미확인', accent: 'bg-gray-400' };
      case 'misleading': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', label: '오해의 소지', accent: 'bg-orange-500' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', label: status, accent: 'bg-gray-400' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">팩트체크 결과</h2>
          <p className="text-xs text-gray-500">다중 소스 교차 검증 기반</p>
        </div>
      </div>

      {results.map((result, index) => {
        const style = getStatusStyle(result.status);
        return (
          <div key={index} className={`border rounded-xl p-5 ${style.bg} ${style.border}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className={`font-medium text-[15px] ${style.text} leading-snug`}>"{result.claim}"</h3>
              <span className={`text-xs font-semibold whitespace-nowrap px-2.5 py-1 rounded-full ${style.accent} text-white flex-shrink-0`}>
                {style.label}
              </span>
            </div>

            <p className={`text-sm ${style.text} opacity-80 mb-4 leading-relaxed`}>{result.explanation}</p>

            <div className="mb-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">근거</h4>
              <ul className="space-y-1.5">
                {result.evidence.map((ev, i) => (
                  <li key={i} className={`text-sm ${style.text} flex items-start gap-2 opacity-80`}>
                    <svg className="w-3 h-3 mt-1 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-2">참고 소스</h4>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-white/70 px-2.5 py-1 rounded-lg border border-black/5 hover:bg-white transition-colors font-medium text-gray-700"
                  >
                    {src.name}
                    <span className="text-gray-400 ml-1">({src.credibility}%)</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          팩트체크 방법론
        </h3>
        <ul className="text-xs text-gray-500 space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
            다중 소스 교차 검증 (최소 2개 이상의 독립적 소스)
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
            공식 발표자료 및 1차 출처 확인
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
            통계 데이터 원본 추적
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
            맥락적 분석 및 생략된 정보 확인
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
            과거 유사 사례 비교
          </li>
        </ul>
      </div>
    </div>
  );
}
