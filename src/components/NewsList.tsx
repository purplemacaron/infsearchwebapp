import { NewsItem, SourceType } from '../types';

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

  const getSourceTypeInfo = (type: SourceType) => {
    const info: Record<SourceType, { label: string; color: string; bgColor: string; borderColor: string }> = {
      official: { label: '공식', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
      news: { label: '뉴스', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
      expert: { label: '전문가', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
      sns: { label: 'SNS', color: 'text-sky-700', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
      community: { label: '커뮤니티', color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
      rumor: { label: '루머', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
      video: { label: '영상', color: 'text-pink-700', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
      blog: { label: '블로그', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    };
    return info[type] || info.news;
  };

  const getSourceTypeIcon = (type: SourceType) => {
    const icons: Record<SourceType, string> = {
      official: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      news: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
      expert: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      sns: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      community: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      rumor: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      blog: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    };
    return icons[type] || icons.news;
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

  const getCardStyle = (sourceType: SourceType, credibility: number) => {
    if (sourceType === 'rumor' || credibility < 30) {
      return 'bg-red-50/30 border-red-100 hover:border-red-200';
    }
    if (sourceType === 'official' && credibility >= 95) {
      return 'bg-blue-50/30 border-blue-100 hover:border-blue-200';
    }
    return 'bg-white border-gray-100 hover:border-gray-200';
  };

  const formatEngagement = (num?: number) => {
    if (!num) return '';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          분석 결과
          <span className="text-gray-400 font-normal text-sm ml-2">{results.length}건</span>
        </h2>
      </div>

      {results.map((item, index) => {
        const typeInfo = getSourceTypeInfo(item.sourceType);
        const cardStyle = getCardStyle(item.sourceType, item.sourceCredibility);

        return (
          <article
            key={item.id}
            className={`border rounded-xl p-5 hover:shadow-sm transition-all group ${cardStyle}`}
          >
            <div className="flex items-start gap-4">
              {/* Rank & Source Type Icon */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-lg ${typeInfo.bgColor} ${typeInfo.borderColor} border flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${typeInfo.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getSourceTypeIcon(item.sourceType)} />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
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

                {/* Source Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${typeInfo.bgColor} ${typeInfo.color} border ${typeInfo.borderColor}`}>
                    {typeInfo.label}
                  </span>
                  {item.sourceType === 'rumor' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                      미확인 정보
                    </span>
                  )}
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
                  {item.author && (
                    <>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-500">{item.author}</span>
                    </>
                  )}
                  <span className="text-gray-200">·</span>
                  <span className="text-xs text-gray-400">{getTimeAgo(item.publishedAt)}</span>
                  <span className="text-gray-200">·</span>

                  {/* Credibility */}
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                    item.sourceCredibility >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    item.sourceCredibility >= 70 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    item.sourceCredibility >= 40 ? 'bg-orange-50 text-orange-700 border-orange-100' :
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

                {/* Engagement (for SNS/Community/Video) */}
                {item.engagement && (
                  <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500">
                    {item.engagement.views && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {formatEngagement(item.engagement.views)}
                      </span>
                    )}
                    {item.engagement.likes && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {formatEngagement(item.engagement.likes)}
                      </span>
                    )}
                    {item.engagement.shares && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        {formatEngagement(item.engagement.shares)}
                      </span>
                    )}
                    {item.engagement.comments && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {formatEngagement(item.engagement.comments)}
                      </span>
                    )}
                  </div>
                )}

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.keywords.slice(0, 5).map(kw => (
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
        );
      })}
    </div>
  );
}
