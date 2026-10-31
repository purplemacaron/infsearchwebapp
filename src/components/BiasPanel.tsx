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
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚖️</span>
        <h2 className="text-lg font-semibold text-gray-800">편향성 분석</h2>
      </div>

      {/* Overall Bias Gauge */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">전체 편향 위치</h3>
        <div className="relative">
          <div className="h-3 bg-gradient-to-r from-blue-400 via-gray-200 to-red-400 rounded-full" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow"
            style={{ left: `${getBiasPosition()}%`, transform: 'translate(-50%, -50%)' }}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>진보</span>
            <span>중립</span>
            <span>보수</span>
          </div>
        </div>
        <p className="text-center mt-3 text-sm font-medium text-gray-700">
          전체 분석 결과: <span className="text-blue-600">{analysis.overallBias}</span>
        </p>
      </div>

      {/* Framing Analysis */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">📐 프레이밍 분석</h3>
        <p className="text-xs text-gray-400 mb-3">각 소스가 어떤 프레임으로 보도하고 있는지 분석합니다</p>
        <div className="space-y-2">
          {analysis.framing.map((frame, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="text-blue-500">▸</span> {frame}
            </div>
          ))}
        </div>
      </div>

      {/* Loaded Language */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">🔤 감정적 언어 감지</h3>
        <p className="text-xs text-gray-400 mb-3">객관성을 해칠 수 있는 감정적/선정적 표현을 식별합니다</p>
        <div className="space-y-2">
          {analysis.loadedLanguage.map((lang, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
              <span className="text-orange-500">⚡</span> {lang}
            </div>
          ))}
        </div>
      </div>

      {/* Omitted Context */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">🕳️ 누락된 맥락</h3>
        <p className="text-xs text-gray-400 mb-3">보도에서 빠진 중요한 배경 정보를 식별합니다</p>
        <div className="space-y-2">
          {analysis.omittedContext.map((ctx, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100">
              <span className="text-yellow-600">⚠</span> {ctx}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">🔄 소스 간 비교</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{analysis.comparisonWithOtherSources}</p>
      </div>
    </div>
  );
}
