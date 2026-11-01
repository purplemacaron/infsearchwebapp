import { NewsItem, APIConfig, ChatMessage, SearchStrategy } from '../types';
import { searchDuckDuckGo, searchWikipedia, searchNewsAPI } from './search';
import { callAI } from './api';

// AI가 검색 전략 수립
export async function generateSearchStrategy(query: string, config: APIConfig): Promise<SearchStrategy> {
  if (!config.apiKey) {
    // API 키 없으면 기본 전략 반환
    return {
      mainQuery: query,
      relatedQueries: [`${query} 최신`, `${query} 분석`, `${query} 영향`],
      angles: ['정책', '시장', '기술'],
      keyEntities: [query],
      suggestedSources: ['뉴스', '위키백과', '전문가 분석'],
    };
  }

  const messages: ChatMessage[] = [
    {
      id: 'system',
      role: 'system',
      content: `당신은 정보 분석 전문가입니다. 사용자가 검색한 주제에 대해 종합적인 분석을 위해 어떤 검색을 수행해야 하는지 전략을 수립하세요.
JSON 형식으로만 답변하세요:
{
  "mainQuery": "메인 검색어",
  "relatedQueries": ["관련 검색어1", "관련 검색어2", "관련 검색어3", "관련 검색어4", "관련 검색어5"],
  "angles": ["분석 각도1", "분석 각도2", "분석 각도3"],
  "keyEntities": ["핵심 엔티티1", "핵심 엔티티2"],
  "suggestedSources": ["추천 소스1", "추천 소스2"]
}`,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'user',
      role: 'user',
      content: `"${query}"에 대한 종합적인 분석을 위해 어떤 검색을 수행해야 하나요? 다양한 각도에서 자료를 수집할 수 있는 검색 전략을 수립해주세요.`,
      timestamp: new Date().toISOString(),
    },
  ];

  try {
    const response = await callAI(messages, config);
    // JSON 파싱
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Failed to generate search strategy:', error);
  }

  // 실패 시 기본 전략
  return {
    mainQuery: query,
    relatedQueries: [`${query} 최신`, `${query} 분석`, `${query} 영향`],
    angles: ['정책', '시장', '기술'],
    keyEntities: [query],
    suggestedSources: ['뉴스', '위키백과', '전문가 분석'],
  };
}

// AI 기반 종합 검색
export async function performAISearch(query: string, config: APIConfig): Promise<{
  results: NewsItem[];
  strategy: SearchStrategy;
}> {
  // 1. 검색 전략 수립
  const strategy = await generateSearchStrategy(query, config);

  // 2. 여러 검색어를 병렬로 검색
  const searchPromises = [
    // 메인 쿼리
    performSingleSearch(strategy.mainQuery, config),
    // 관련 쿼리들
    ...strategy.relatedQueries.slice(0, 3).map(q => performSingleSearch(q, config)),
  ];

  const searchResults = await Promise.all(searchPromises);

  // 3. 결과 합치기 및 중복 제거
  const allResults = searchResults.flat();
  const uniqueResults = removeDuplicates(allResults);

  // 4. 중요도 재계산
  const scoredResults = uniqueResults.map(item => ({
    ...item,
    importance: calculateRelevanceScore(item, query, strategy),
  }));

  // 5. 중요도순 정렬
  scoredResults.sort((a, b) => b.importance - a.importance);

  return {
    results: scoredResults,
    strategy,
  };
}

// 단일 검색 실행
async function performSingleSearch(query: string, config: APIConfig): Promise<NewsItem[]> {
  const [duckduckgo, wikipedia, newsapi] = await Promise.all([
    searchDuckDuckGo(query),
    searchWikipedia(query, 5),
    searchNewsAPI(query, config.newsApiKey || ''),
  ]);

  return convertToNewsItems(query, duckduckgo, wikipedia, newsapi);
}

// 검색 결과를 NewsItem으로 변환
function convertToNewsItems(
  query: string,
  duckduckgo: any,
  wikipedia: any[],
  newsapi: any[]
): NewsItem[] {
  const items: NewsItem[] = [];

  // DuckDuckGo 결과
  if (duckduckgo) {
    if (duckduckgo.Abstract) {
      items.push({
        id: `ddg-${query}-${Date.now()}`,
        title: duckduckgo.Heading || query,
        summary: duckduckgo.Abstract,
        url: duckduckgo.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: duckduckgo.AbstractSource || 'DuckDuckGo',
        sourceType: 'expert',
        sourceCredibility: 85,
        publishedAt: new Date().toISOString(),
        importance: 90,
        bias: 'center',
        sentiment: 'neutral',
        keywords: [query],
        entities: [],
        factCheckStatus: 'verified',
        relatedArticles: [],
      });
    }

    if (duckduckgo.RelatedTopics) {
      duckduckgo.RelatedTopics.slice(0, 3).forEach((topic: any, index: number) => {
        if (topic.Text && topic.FirstURL) {
          items.push({
            id: `ddg-topic-${query}-${index}-${Date.now()}`,
            title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
            summary: topic.Text,
            url: topic.FirstURL,
            source: 'DuckDuckGo',
            sourceType: 'expert',
            sourceCredibility: 80,
            publishedAt: new Date().toISOString(),
            importance: 80 - index * 5,
            bias: 'center',
            sentiment: 'neutral',
            keywords: [query],
            entities: [],
            factCheckStatus: 'verified',
            relatedArticles: [],
          });
        }
      });
    }
  }

  // Wikipedia 결과
  wikipedia.forEach((article: any, index: number) => {
    items.push({
      id: `wiki-${query}-${index}-${Date.now()}`,
      title: article.title,
      summary: article.snippet.replace(/<[^>]*>/g, ''),
      url: `https://ko.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, '_'))}`,
      source: 'Wikipedia',
      sourceType: 'expert',
      sourceCredibility: 90,
      publishedAt: article.timestamp || new Date().toISOString(),
      importance: 85 - index * 3,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query],
      entities: [],
      factCheckStatus: 'verified',
      relatedArticles: [],
    });
  });

  // NewsAPI 결과
  newsapi.forEach((article: any, index: number) => {
    items.push({
      id: `news-${query}-${index}-${Date.now()}`,
      title: article.title || '제목 없음',
      summary: article.description || article.content || '',
      url: article.url || '#',
      source: article.source?.name || '뉴스',
      sourceType: 'news',
      sourceCredibility: 75,
      publishedAt: article.publishedAt || new Date().toISOString(),
      importance: 75 - index * 2,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query],
      entities: [],
      factCheckStatus: 'partially-verified',
      relatedArticles: [],
      author: article.author,
    });
  });

  return items;
}

// 중복 제거
function removeDuplicates(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.url || item.title;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// 관련성 점수 계산
function calculateRelevanceScore(item: NewsItem, query: string, strategy: SearchStrategy): number {
  let score = item.importance;

  // 제목에 쿼리가 포함되어 있으면 가점
  if (item.title.toLowerCase().includes(query.toLowerCase())) {
    score += 10;
  }

  // 요약에 쿼리가 포함되어 있으면 가점
  if (item.summary.toLowerCase().includes(query.toLowerCase())) {
    score += 5;
  }

  // 키워드에 전략의 각도가 포함되어 있으면 가점
  strategy.angles.forEach(angle => {
    if (item.keywords.some(kw => kw.includes(angle))) {
      score += 3;
    }
  });

  // 엔티티가 포함되어 있으면 가점
  strategy.keyEntities.forEach(entity => {
    if (item.title.includes(entity) || item.summary.includes(entity)) {
      score += 5;
    }
  });

  return Math.min(100, score);
}

// AI 기반 결과 분석
export async function analyzeResults(
  query: string,
  results: NewsItem[],
  config: APIConfig
): Promise<string> {
  if (!config.apiKey || results.length === 0) {
    return '';
  }

  const topResults = results.slice(0, 10);
  const resultsText = topResults
    .map((r, i) => `${i + 1}. ${r.title} (${r.source})\n   ${r.summary.substring(0, 150)}...`)
    .join('\n\n');

  const messages: ChatMessage[] = [
    {
      id: 'system',
      role: 'system',
      content: `당신은 정보 분석 전문가입니다. 제공된 검색 결과들을 분석하여 핵심 내용을 간결하게 요약하세요.
- 주요 발견사항
- 중요한 포인트 3-5개
- 주의할 점이나 논쟁 사항
을 포함하여 200자 이내로 작성하세요.`,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'user',
      role: 'user',
      content: `"${query}"에 대한 검색 결과:\n\n${resultsText}\n\n위 결과를 분석해주세요.`,
      timestamp: new Date().toISOString(),
    },
  ];

  try {
    return await callAI(messages, config);
  } catch (error) {
    console.error('Failed to analyze results:', error);
    return '';
  }
}
