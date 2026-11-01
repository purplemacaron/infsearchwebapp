import { AISummary } from '../types';

interface AISummaryPanelProps {
  summary: AISummary;
  query: string;
}

export default function AISummaryPanel({ summary, query }: AISummaryPanelProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">AI 종합 분석</h2>
            <p className="text-xs text-gray-500">다중 소스 기반 종합 요약</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-gray-500">분석 신뢰도</div>
            <div className="text-sm font-semibold text-blue-600">{summary.confidence}%</div>
          </div>
          <div className="w-10 h-10 relative">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${summary.confidence}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-5 text-[15px]">{summary.overview}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            핵심 포인트
          </h3>
          <ul className="space-y-2.5">
            {summary.keyPoints.map((point, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>

          {/* Source Breakdown */}
          {summary.sourceBreakdown && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">소스 유형별 분포</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-blue-700">{summary.sourceBreakdown.official}</div>
                  <div className="text-blue-600">공식</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-gray-700">{summary.sourceBreakdown.news}</div>
                  <div className="text-gray-600">뉴스</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-purple-700">{summary.sourceBreakdown.expert}</div>
                  <div className="text-purple-600">전문가</div>
                </div>
                <div className="bg-sky-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-sky-700">{summary.sourceBreakdown.sns}</div>
                  <div className="text-sky-600">SNS</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-indigo-700">{summary.sourceBreakdown.community}</div>
                  <div className="text-indigo-600">커뮤니티</div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-red-700">{summary.sourceBreakdown.rumor}</div>
                  <div className="text-red-600">루머</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              합의된 의견
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{summary.consensus}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              논쟁 포인트
            </h3>
            <ul className="space-y-1.5">
              {summary.controversies.map((c, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
