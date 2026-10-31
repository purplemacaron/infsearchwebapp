import { APIConfig, ChatMessage, AISummary, FactCheckResult, BiasAnalysis, NewsItem } from '../types';

export async function callAI(messages: ChatMessage[], config: APIConfig): Promise<string> {
  if (!config.apiKey) {
    return 'API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.';
  }

  try {
    if (config.provider === 'anthropic') {
      return await callAnthropic(messages, config);
    } else {
      return await callOpenAI(messages, config);
    }
  } catch (error) {
    console.error('API Error:', error);
    return 'API 호출 중 오류가 발생했습니다. 설정을 확인해주세요.';
  }
}

async function callOpenAI(messages: ChatMessage[], config: APIConfig): Promise<string> {
  const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(messages: ChatMessage[], config: APIConfig): Promise<string> {
  const baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  const systemMsg = messages.find(m => m.role === 'system');
  const nonSystemMsgs = messages.filter(m => m.role !== 'system');

  const response = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      system: systemMsg?.content || '',
      messages: nonSystemMsgs.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export function generateMockNews(query: string): NewsItem[] {
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: `${query} 관련 주요 정책 변화 - 정부 발표`,
      summary: `최근 ${query}와 관련하여 정부에서 중요한 정책 변화를 발표했습니다. 이번 변화는 산업 전반에 걸친 영향을 미칠 것으로 예상됩니다.`,
      url: 'https://example.com/news/1',
      source: '한국경제',
      sourceCredibility: 88,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      importance: 95,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '정책', '정부', '변화'],
      entities: ['정부', '산업부'],
      factCheckStatus: 'verified',
      relatedArticles: ['2', '3'],
    },
    {
      id: '2',
      title: `전문가들, ${query} 영향 분석 "중대한 전환점"`,
      summary: `국내 주요 전문가들이 ${query}의 영향에 대해 분석했습니다. 이들은 이번 변화를 중대한 전환점으로 평가했습니다.`,
      url: 'https://example.com/news/2',
      source: '연합뉴스',
      sourceCredibility: 92,
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      importance: 88,
      bias: 'center',
      sentiment: 'positive',
      keywords: [query, '전문가', '분석', '전환점'],
      entities: ['전문가', '연구기관'],
      factCheckStatus: 'verified',
      relatedArticles: ['1', '4'],
    },
    {
      id: '3',
      title: `${query} 반대 측 주장 "신중한 접근 필요"`,
      summary: `${query}에 대한 반대 측에서 신중한 접근이 필요하다고 주장했습니다. 잠재적 부작용에 대한 우려를 제기했습니다.`,
      url: 'https://example.com/news/3',
      source: '한겨레',
      sourceCredibility: 82,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      importance: 78,
      bias: 'left',
      sentiment: 'negative',
      keywords: [query, '반대', '우려', '부작용'],
      entities: ['시민단체', '야당'],
      factCheckStatus: 'partially-verified',
      relatedArticles: ['1', '5'],
    },
    {
      id: '4',
      title: `글로벌 시장, ${query}에 반응 - 국제 동향`,
      summary: `글로벌 시장에서 ${query} 관련 뉴스에 반응하고 있습니다. 주요 국가들의 대응 현황을 정리했습니다.`,
      url: 'https://example.com/news/4',
      source: '로이터',
      sourceCredibility: 90,
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      importance: 82,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '글로벌', '시장', '국제'],
      entities: ['미국', 'EU', '중국'],
      factCheckStatus: 'verified',
      relatedArticles: ['2', '6'],
    },
    {
      id: '5',
      title: `${query} 기술적 분석 - 데이터로 보는 현황`,
      summary: `${query}를 기술적 관점에서 분석했습니다. 최신 데이터를 기반으로 현황을 파악했습니다.`,
      url: 'https://example.com/news/5',
      source: 'ZDNet Korea',
      sourceCredibility: 79,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      importance: 72,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '기술', '데이터', '분석'],
      entities: ['테크기업', '스타트업'],
      factCheckStatus: 'verified',
      relatedArticles: ['3', '6'],
    },
    {
      id: '6',
      title: `${query} 여론 조사 - 국민 의견은?`,
      summary: `${query}에 대한 여론 조사 결과가 발표되었습니다. 찬성과 반대 의견이 팽팽한 것으로 나타났습니다.`,
      url: 'https://example.com/news/6',
      source: '갤럽',
      sourceCredibility: 85,
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      importance: 75,
      bias: 'center',
      sentiment: 'mixed',
      keywords: [query, '여론', '조사', '찬반'],
      entities: ['갤럽', '한국리서치'],
      factCheckStatus: 'verified',
      relatedArticles: ['3', '5'],
    },
  ];

  return mockNews;
}

export function generateMockSummary(query: string): AISummary {
  return {
    overview: `"${query}"와 관련하여 현재 총 6개의 주요 기사가 분석되었습니다. 정부 정책 변화가 핵심 이슈이며, 전문가들은 이를 중대한 전환점으로 평가하고 있습니다. 다만 반대 측에서는 신중한 접근을 요구하고 있으며, 글로벌 시장의 반응도 주목됩니다.`,
    keyPoints: [
      '정부의 주요 정책 변화 발표 - 산업 전반 영향 예상',
      '전문가들, "중대한 전환점" 평가',
      '반대 측, 잠재적 부작용 우려 제기',
      '글로벌 시장 반응 및 국제 동향 주목',
      '여론 조사 결과 찬반 팽팽',
    ],
    timeline: [
      { date: '18시간 전', title: '여론 조사 결과 발표', description: '찬반 의견이 팽팽한 것으로 나타남', sources: ['갤럽'] },
      { date: '12시간 전', title: '기술적 분석 보고서', description: '데이터 기반 현황 분석', sources: ['ZDNet'] },
      { date: '8시간 전', title: '글로벌 시장 반응', description: '주요 국가들의 대응 현황', sources: ['로이터'] },
      { date: '6시간 전', title: '반대 측 입장 발표', description: '신중한 접근 필요 주장', sources: ['한겨레'] },
      { date: '4시간 전', title: '전문가 분석', description: '중대한 전환점 평가', sources: ['연합뉴스'] },
      { date: '2시간 전', title: '정부 정책 발표', description: '주요 정책 변화 공식 발표', sources: ['한국경제'] },
    ],
    consensus: '대다수의 소스에서 이번 변화의 중요성에 동의하고 있으나, 속도와 범위에 대해서는 의견이 분분합니다.',
    controversies: [
      '정책 시행 시점에 대한 이견',
      '잠재적 부작용 규모에 대한 논쟁',
      '글로벌 비교 대상 선정의 적절성',
    ],
    confidence: 82,
  };
}

export function generateMockFactCheck(query: string): FactCheckResult[] {
  return [
    {
      claim: `정부가 "${query}" 관련 정책을 전격 발표했다`,
      status: 'true',
      evidence: ['정부 공식 보도자료 확인', '다수 언론 보도 일치'],
      sources: [
        { name: '한국경제', url: 'https://example.com/1', credibility: 88 },
        { name: '연합뉴스', url: 'https://example.com/2', credibility: 92 },
      ],
      explanation: '해당 내용은 정부 공식 발표를 기반으로 하며, 다수의 신뢰할 수 있는 언론사에서 확인되었습니다.',
    },
    {
      claim: '전문가들이 중대한 전환점으로 평가',
      status: 'partially-true',
      evidence: ['일부 전문가 동의', '다른 전문가들은 유보적 입장'],
      sources: [
        { name: '연합뉴스', url: 'https://example.com/2', credibility: 92 },
      ],
      explanation: '일부 전문가들은 동의하지만, 모든 전문가가 같은 의견인 것은 아닙니다. 보도에서 "전문가들"이라 일반화한 부분은 주의가 필요합니다.',
    },
    {
      claim: '글로벌 시장이 반응하고 있다',
      status: 'true',
      evidence: ['국제 통신사 보도 확인', '시장 데이터 반영'],
      sources: [
        { name: '로이터', url: 'https://example.com/4', credibility: 90 },
      ],
      explanation: '로이터 통신을 통해 글로벌 시장 반응이 확인되었습니다.',
    },
  ];
}

export function generateMockBiasAnalysis(query: string): BiasAnalysis {
  return {
    overallBias: 'center',
    framing: [
      '정책 변화 중심 프레이밍 (경제지)',
      '시민 영향 중심 프레이밍 (진보지)',
      '시장 반응 중심 프레이밍 (외신)',
    ],
    loadedLanguage: [
      '"전격 발표" - 긴급성 강조',
      '"우려" - 부정적 뉘앙스',
      '"전환점" - 긍정적 뉘앙스',
    ],
    omittedContext: [
      '유사 사례의 과거 결과 미언급',
      '영향 받는 구체적 수치 부족',
      '국제 비교 데이터 제한적',
    ],
    comparisonWithOtherSources: '경제지는 긍정적 프레임, 시민단체 관련 보도는 부정적 프레임, 외신은 중립적 프레임으로 보도하는 경향이 있습니다.',
  };
}
