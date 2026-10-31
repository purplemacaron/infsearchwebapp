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
      case 'left': return 'bg-blue-100 text-blue-700';
      case 'right': return 'bg-red-100 text-red-700';
      case 'center': return 'bg-gray-100 text-gray-700';
      case 'mixed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      case 'neutral': return '⚪';
      case 'mixed': return '🟡';
      default: return '⚪';
    }
  };

  const getFactCheckIcon = (status: string) => {
    switch (status) {
      case 'verified': return '✅';
      case 'disputed': return '❌';
      case 'partially-verified': return '⚠️';
      case 'unverified': return '❓';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          분석 결과 <span className="text-gray-400 font-normal text-sm">({results.length}건)</span>
        </h2>
      </div>

      {results.map((item, index) => (
        <div
          key={item.id}
          className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Rank & Importance */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.importance}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">중요도 {item.importance}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 mb-1.5 hover:text-blue-600 cursor-pointer">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>

              {/* Summary */}
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.summary}</p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{item.source}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">{getTimeAgo(item.publishedAt)}</span>
                <span className="text-xs text-gray-300">|</span>

                {/* Credibility */}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.sourceCredibility >= 85 ? 'bg-green-50 text-green-700' :
                  item.sourceCredibility >= 70 ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  신뢰도 {item.sourceCredibility}%
                </span>

                {/* Bias */}
                <span className={`text-xs px-2 py-0.5 rounded-full ${getBiasColor(item.bias)}`}>
                  {getBiasLabel(item.bias)}
                </span>

                {/* Sentiment */}
                <span className="text-xs flex items-center gap-1">
                  {getSentimentIcon(item.sentiment)} {item.sentiment}
                </span>

                {/* Fact Check */}
                <span className="text-xs flex items-center gap-1">
                  {getFactCheckIcon(item.factCheckStatus)} 팩트체크
                </span>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.keywords.map(kw => (
                  <span key={kw} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onToggleBookmark(item.id)}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarks.includes(item.id)
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-gray-50 text-gray-400 hover:text-yellow-600'
                }`}
                title="북마크"
              >
                {bookmarks.includes(item.id) ? '★' : '☆'}
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 transition-colors"
                title="원문 보기"
              >
                🔗
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
