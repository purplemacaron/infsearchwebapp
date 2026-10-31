import { NewsItem } from '../types';

interface NewsListProps {
  results: NewsItem[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

export default function NewsList({ results, bookmarks, onToggleBookmark }: NewsListProps) {
  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'right': return 'bg-red-50 text-red-700 border-red-100';
      case 'center': return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'mixed': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getBiasLabel = (bias: string) => {
    switch (bias) {
      case 'left': return '진보';
      case 'right': return '보수';
      case 'center': return '중립';
      case 'mixed': return '혼합';
      default: return bias;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600';
      case 'negative': return 'text-rose-600';
      case 'neutral': return 'text-gray-500';
      case 'mixed': return 'text-amber-600';
      default: return 'text-gray-500';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '긍정';
      case 'negative': return '부정';
      case 'neutral': return '중립';
      case 'mixed': return '혼합';
      default: return sentiment;
    }
  };

  const getFactCheckColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'disputed': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'partially-verified': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'unverified': return 'text-gray-500 bg-gray-50 border-gray-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  const getFactCheckLabel = (status: string) => {
    switch (status) {
      case 'verified': return '확인됨';
      case 'disputed': return '논쟁중';
      case 'partially-verified': return '부분 확인';
      case 'unverified': return '미확인';
      default: return status;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          분석 결과
          <span className="text-gray-400 font-normal text-sm ml-2">{results.length}건</span>
        </h2>
      </div>

      {results.map((item, index) => (
        <article
          key={item.id}
          className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-sm transition-all group"
        >
          <div className="flex items-start gap-4">
            {/* Rank */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-600">{index + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Importance bar */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 max-w-[120px] h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                    style={{ width: `${item.importance}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">중요도 {item.importance}</span>
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5 group-hover:text-blue-700 transition-colors leading-snug">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>

              {/* Summary */}
              <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">{item.summary}</p>

              {/* Meta tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">{item.source}</span>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">{getTimeAgo(item.publishedAt)}</span>
                <span className="text-gray-200">·</span>

                {/* Credibility */}
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                  item.sourceCredibility >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  item.sourceCredibility >= 70 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  신뢰도 {item.sourceCredibility}%
                </span>

                {/* Bias */}
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${getBiasColor(item.bias)}`}>
                  {getBiasLabel(item.bias)}
                </span>

                {/* Sentiment */}
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium bg-gray-50 border-gray-100 ${getSentimentColor(item.sentiment)}`}>
                  {getSentimentLabel(item.sentiment)}
                </span>

                {/* Fact Check */}
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${getFactCheckColor(item.factCheckStatus)}`}>
                  {getFactCheckLabel(item.factCheckStatus)}
                </span>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.keywords.map(kw => (
                  <span key={kw} className="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={() => onToggleBookmark(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  bookmarks.includes(item.id)
                    ? 'bg-amber-50 text-amber-500'
                    : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50'
                }`}
                title="북마크"
              >
                <svg className="w-4 h-4" fill={bookmarks.includes(item.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="원문 보기"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
