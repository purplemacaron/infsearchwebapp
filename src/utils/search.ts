import { NewsItem, SourceType } from '../types';

// DuckDuckGo Instant Answer API
export async function searchDuckDuckGo(query: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    if (!response.ok) throw new Error('DuckDuckGo API error');
    return await response.json();
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return null;
  }
}

// Wikipedia API
export async function searchWikipedia(query: string, limit: number = 10): Promise<any[]> {
  try {
    const response = await fetch(
      `https://ko.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&format=json&origin=*`
    );
    if (!response.ok) throw new Error('Wikipedia API error');
    const data = await response.json();
    return data.query?.search || [];
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return [];
  }
}

// NewsAPI (사용자가 키를 설정한 경우)
export async function searchNewsAPI(query: string, apiKey: string): Promise<any[]> {
  if (!apiKey) return [];
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
      {
        headers: {
          'X-Api-Key': apiKey,
        },
      }
    );
    if (!response.ok) throw new Error('NewsAPI error');
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('NewsAPI search error:', error);
    return [];
  }
}

// 검색 결과를 NewsItem으로 변환
export function convertToNewsItems(
  query: string,
  duckduckgo: any,
  wikipedia: any[],
  newsapi: any[]
): NewsItem[] {
  const items: NewsItem[] = [];

  // DuckDuckGo 결과
  if (duckduckgo) {
    // Abstract (메인 요약)
    if (duckduckgo.Abstract) {
      items.push({
        id: 'ddg-abstract',
        title: duckduckgo.Heading || query,
        summary: duckduckgo.Abstract,
        url: duckduckgo.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: duckduckgo.AbstractSource || 'DuckDuckGo',
        sourceType: 'expert',
        sourceCredibility: 85,
        publishedAt: new Date().toISOString(),
        importance: 95,
        bias: 'center',
        sentiment: 'neutral',
        keywords: [query],
        entities: [],
        factCheckStatus: 'verified',
        relatedArticles: [],
      });
    }

    // Related Topics
    if (duckduckgo.RelatedTopics && duckduckgo.RelatedTopics.length > 0) {
      duckduckgo.RelatedTopics.slice(0, 5).forEach((topic: any, index: number) => {
        if (topic.Text && topic.FirstURL) {
          items.push({
            id: `ddg-topic-${index}`,
            title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
            summary: topic.Text,
            url: topic.FirstURL,
            source: 'DuckDuckGo',
            sourceType: 'expert',
            sourceCredibility: 80,
            publishedAt: new Date().toISOString(),
            importance: 85 - index * 5,
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
      id: `wiki-${index}`,
      title: article.title,
      summary: article.snippet.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      url: `https://ko.wikipedia.org/wiki/${encodeURIComponent(article.title.replace(/ /g, '_'))}`,
      source: 'Wikipedia',
      sourceType: 'expert',
      sourceCredibility: 90,
      publishedAt: article.timestamp || new Date().toISOString(),
      importance: 80 - index * 3,
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
      id: `news-${index}`,
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

  // 실제 검색 엔진 링크 추가
  items.push({
    id: 'google-news',
    title: `Google News에서 "${query}" 검색`,
    summary: 'Google 뉴스에서 관련 기사를 더 많이 찾아보세요.',
    url: `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=ko`,
    source: 'Google News',
    sourceType: 'news',
    sourceCredibility: 85,
    publishedAt: new Date().toISOString(),
    importance: 70,
    bias: 'center',
    sentiment: 'neutral',
    keywords: [query],
    entities: [],
    factCheckStatus: 'verified',
    relatedArticles: [],
  });

  items.push({
    id: 'bing-news',
    title: `Bing News에서 "${query}" 검색`,
    summary: 'Bing 뉴스에서 관련 기사를 찾아보세요.',
    url: `https://www.bing.com/news/search?q=${encodeURIComponent(query)}`,
    source: 'Bing News',
    sourceType: 'news',
    sourceCredibility: 85,
    publishedAt: new Date().toISOString(),
    importance: 68,
    bias: 'center',
    sentiment: 'neutral',
    keywords: [query],
    entities: [],
    factCheckStatus: 'verified',
    relatedArticles: [],
  });

  items.push({
    id: 'duckduckgo-news',
    title: `DuckDuckGo에서 "${query}" 검색`,
    summary: 'DuckDuckGo에서 관련 정보를 찾아보세요.',
    url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
    source: 'DuckDuckGo',
    sourceType: 'news',
    sourceCredibility: 80,
    publishedAt: new Date().toISOString(),
    importance: 65,
    bias: 'center',
    sentiment: 'neutral',
    keywords: [query],
    entities: [],
    factCheckStatus: 'verified',
    relatedArticles: [],
  });

  return items;
}

// 종합 검색 실행
export async function performSearch(query: string, newsApiKey?: string): Promise<NewsItem[]> {
  // 병렬로 검색 실행
  const [duckduckgo, wikipedia, newsapi] = await Promise.all([
    searchDuckDuckGo(query),
    searchWikipedia(query, 10),
    searchNewsAPI(query, newsApiKey || ''),
  ]);

  return convertToNewsItems(query, duckduckgo, wikipedia, newsapi);
}
