import { BiasAnalysis } from '../types';

interface BiasPanelProps {
  analysis: BiasAnalysis;
}

export default function BiasPanel({ analysis }: BiasPanelProps) {
  const getBiasPosition = () => {
    const positions: Record<string, number> = {
      'left': 15,
      'center-left': 35,
      'center': 50,
      'center-right': 65,
      'right': 85,
    };
    return positions[analysis.overallBias] || 50;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">편향성 분석</h2>
          <p className="text-xs text-gray-500">보도 프레임 및 언어 분석</p>
        </div>
      </div>

      {/* Overall Bias Gauge */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-600 mb-4">전체 편향 위치</h3>
        <div className="relative px-1">
          <div className="h-2 bg-gradient-to-r from-blue-400 via-gray-200 to-red-400 rounded-full" />
          <div
            className="absolute top-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-md"
            style={{ left: `${getBiasPosition()}%`, transform: 'translate(-50%, -50%)' }}
          />
          <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium">
            <span>진보</span>
            <span>중립</span>
            <span>보수</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">전체 분석 결과: </span>
          <span className="text-sm font-semibold text-purple-600">{analysis.overallBias}</span>
        </div>
      </div>

      {/* Framing Analysis */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          프레이밍 분석
        </h3>
        <p className="text-xs text-gray-400 mb-3">각 소스가 어떤 프레임으로 보도하고 있는지 분석합니다</p>
        <div className="space-y-2">
          {analysis.framing.map((frame, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 bg-blue-50/50 px-3.5 py-2.5 rounded-lg border border-blue-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              {frame}
            </div>
          ))}
        </div>
      </div>

      {/* Loaded Language */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          감정적 언어 감지
        </h3>
        <p className="text-xs text-gray-400 mb-3">객관성을 해칠 수 있는 감정적/선정적 표현을 식별합니다</p>
        <div className="space-y-2">
          {analysis.loadedLanguage.map((lang, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 bg-amber-50/50 px-3.5 py-2.5 rounded-lg border border-amber-100/50">
              <svg className="w-3 h-3 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {lang}
            </div>
          ))}
        </div>
      </div>

      {/* Omitted Context */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          누락된 맥락
        </h3>
        <p className="text-xs text-gray-400 mb-3">보도에서 빠진 중요한 배경 정보를 식별합니다</p>
        <div className="space-y-2">
          {analysis.omittedContext.map((ctx, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-100">
              <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {ctx}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          소스 간 비교
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{analysis.comparisonWithOtherSources}</p>
      </div>
    </div>
  );
}
