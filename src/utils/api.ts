import { APIConfig, ChatMessage, AISummary, FactCheckResult, BiasAnalysis, NewsItem, ModelInfo, APIUsage } from '../types';

// 모델 목록
export const OPENAI_MODELS: ModelInfo[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: '최신 멀티모달 모델, 빠르고 정확함',
    contextWindow: 128000,
    pricing: { input: 0.005, output: 0.015 }
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: '가성비 좋은 소형 모델',
    contextWindow: 128000,
    pricing: { input: 0.00015, output: 0.0006 }
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: '고성능 모델, 긴 컨텍스트 지원',
    contextWindow: 128000,
    pricing: { input: 0.01, output: 0.03 }
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: '안정적인 고성능 모델',
    contextWindow: 8192,
    pricing: { input: 0.03, output: 0.06 }
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '빠르고 저렴한 범용 모델',
    contextWindow: 16385,
    pricing: { input: 0.0005, output: 0.0015 }
  },
  {
    id: 'o1-preview',
    name: 'O1 Preview',
    description: '추론 특화 모델 (Chain of Thought)',
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06 }
  },
  {
    id: 'o1-mini',
    name: 'O1 Mini',
    description: '추론 특화 소형 모델',
    contextWindow: 128000,
    pricing: { input: 0.003, output: 0.012 }
  }
];

export const ANTHROPIC_MODELS: ModelInfo[] = [
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: '최신 고성능 모델, 균형잡힌 성능',
    contextWindow: 200000,
    pricing: { input: 0.003, output: 0.015 }
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: '최고 성능 모델, 복잡한 작업에 적합',
    contextWindow: 200000,
    pricing: { input: 0.015, output: 0.075 }
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: '균형잡힌 성능의 모델',
    contextWindow: 200000,
    pricing: { input: 0.003, output: 0.015 }
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: '빠르고 저렴한 모델',
    contextWindow: 200000,
    pricing: { input: 0.00025, output: 0.00125 }
  }
];

// API 사용량 관리
export function getAPIUsage(): APIUsage {
  const saved = localStorage.getItem('infsearch-api-usage');
  return saved ? JSON.parse(saved) : {
    totalRequests: 0,
    totalTokens: 0,
    estimatedCost: 0
  };
}

export function updateAPIUsage(tokens: number, cost: number): void {
  const usage = getAPIUsage();
  usage.totalRequests += 1;
  usage.totalTokens += tokens;
  usage.estimatedCost += cost;
  usage.lastRequest = new Date().toISOString();
  localStorage.setItem('infsearch-api-usage', JSON.stringify(usage));
}

export function resetAPIUsage(): void {
  localStorage.removeItem('infsearch-api-usage');
}

// 토큰 추정 (간단한 문자 수 기반)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// 비용 계산
export function calculateCost(model: ModelInfo, inputTokens: number, outputTokens: number): number {
  if (!model.pricing) return 0;
  return (inputTokens * model.pricing.input + outputTokens * model.pricing.output) / 1000;
}

// API 연결 테스트
export async function testAPIConnection(config: APIConfig): Promise<{ success: boolean; message: string; latency?: number }> {
  const startTime = Date.now();
  
  try {
    if (config.provider === 'openai') {
      const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return { success: true, message: '연결 성공', latency };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `연결 실패: ${error.error?.message || response.statusText}`,
          latency 
        };
      }
    } else if (config.provider === 'anthropic') {
      const baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
      const response = await fetch(`${baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model || 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        return { success: true, message: '연결 성공', latency };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: `연결 실패: ${error.error?.message || response.statusText}`,
          latency 
        };
      }
    }

    return { success: false, message: '알 수 없는 제공자' };
  } catch (error) {
    const latency = Date.now() - startTime;
    return { 
      success: false, 
      message: `네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      latency 
    };
  }
}

// 사용 가능한 모델 목록 가져오기
export async function fetchAvailableModels(config: APIConfig): Promise<ModelInfo[]> {
  try {
    if (config.provider === 'openai') {
      const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // predefined 목록과 매칭
        const availableIds = data.data.map((m: any) => m.id);
        return OPENAI_MODELS.filter(m => availableIds.includes(m.id));
      }
    }
    // Anthropic은 모델 목록 API가 없으므로 predefined 목록 반환
    return ANTHROPIC_MODELS;
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return config.provider === 'openai' ? OPENAI_MODELS : ANTHROPIC_MODELS;
  }
}

// AI 호출
export async function callAI(messages: ChatMessage[], config: APIConfig): Promise<string> {
  if (!config.apiKey) {
    throw new Error('API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.');
  }

  try {
    let response: string;
    let inputTokens = 0;
    let outputTokens = 0;

    if (config.provider === 'anthropic') {
      const result = await callAnthropic(messages, config);
      response = result.content;
      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;
    } else {
      const result = await callOpenAI(messages, config);
      response = result.content;
      inputTokens = result.inputTokens;
      outputTokens = result.outputTokens;
    }

    // 사용량 업데이트
    const models = config.provider === 'openai' ? OPENAI_MODELS : ANTHROPIC_MODELS;
    const model = models.find(m => m.id === config.model) || models[0];
    const cost = calculateCost(model, inputTokens, outputTokens);
    updateAPIUsage(inputTokens + outputTokens, cost);

    return response;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('API 호출 중 오류가 발생했습니다.');
  }
}

async function callOpenAI(messages: ChatMessage[], config: APIConfig): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  
  const inputText = messages.map(m => m.content).join(' ');
  const inputTokens = estimateTokens(inputText);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `OpenAI API 오류: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const outputTokens = data.usage?.completion_tokens || estimateTokens(content);

  return { content, inputTokens, outputTokens };
}

async function callAnthropic(messages: ChatMessage[], config: APIConfig): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  const systemMsg = messages.find(m => m.role === 'system');
  const nonSystemMsgs = messages.filter(m => m.role !== 'system');

  const inputText = messages.map(m => m.content).join(' ');
  const inputTokens = estimateTokens(inputText);

  const response = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-5-sonnet-20241022',
      max_tokens: config.maxTokens ?? 4000,
      system: systemMsg?.content || '',
      messages: nonSystemMsgs.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Anthropic API 오류: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  const outputTokens = data.usage?.output_tokens || estimateTokens(content);

  return { content, inputTokens, outputTokens };
}

export function generateMockNews(query: string): NewsItem[] {
  const mockNews: NewsItem[] = [
    // 공식 발표 (높은 신뢰도)
    {
      id: '1',
      title: `[공식] ${query} 관련 정부 공식 발표문 전문`,
      summary: `정부가 ${query}와 관련하여 공식 보도자료를 발표했습니다. 이번 발표는 관계부처 합동 브리핑을 통해 이루어졌으며, 구체적인 시행 일정과 예산 규모가 포함되었습니다.`,
      url: 'https://example.com/official/1',
      source: '청와대',
      sourceType: 'official',
      sourceCredibility: 98,
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      importance: 99,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '정부', '공식발표', '정책'],
      entities: ['대통령실', '기획재정부', '산업통상자원부'],
      factCheckStatus: 'verified',
      relatedArticles: ['2', '3', '5'],
      author: '대변인실',
    },
    {
      id: '2',
      title: `[보도자료] ${query} 시행细则 발표 - 관련 부처`,
      summary: `관련 부처에서 ${query}의 구체적인 시행细则를 발표했습니다. 단계적 시행 계획과 함께 업계 의견 수렴 과정이 진행될 예정입니다.`,
      url: 'https://example.com/official/2',
      source: '산업통상자원부',
      sourceType: 'official',
      sourceCredibility: 96,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      importance: 95,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '시행细则', '부처', '단계적 시행'],
      entities: ['산업부', '관련 업계'],
      factCheckStatus: 'verified',
      relatedArticles: ['1', '4'],
    },
    {
      id: '3',
      title: `${query} 주요 정책 변화 - 정부 발표`,
      summary: `최근 ${query}와 관련하여 정부에서 중요한 정책 변화를 발표했습니다. 이번 변화는 산업 전반에 걸친 영향을 미칠 것으로 예상됩니다.`,
      url: 'https://example.com/news/1',
      source: '한국경제',
      sourceType: 'news',
      sourceCredibility: 88,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      importance: 92,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '정책', '정부', '변화'],
      entities: ['정부', '산업부'],
      factCheckStatus: 'verified',
      relatedArticles: ['1', '2', '4'],
      author: '김기자',
    },
    {
      id: '4',
      title: `전문가들, ${query} 영향 분석 "중대한 전환점"`,
      summary: `국내 주요 전문가들이 ${query}의 영향에 대해 분석했습니다. 이들은 이번 변화를 중대한 전환점으로 평가했습니다.`,
      url: 'https://example.com/news/2',
      source: '연합뉴스',
      sourceType: 'news',
      sourceCredibility: 92,
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      importance: 88,
      bias: 'center',
      sentiment: 'positive',
      keywords: [query, '전문가', '분석', '전환점'],
      entities: ['전문가', '연구기관'],
      factCheckStatus: 'verified',
      relatedArticles: ['1', '5', '6'],
      author: '이기자',
    },
    {
      id: '5',
      title: `${query} 반대 측 주장 "신중한 접근 필요"`,
      summary: `${query}에 대한 반대 측에서 신중한 접근이 필요하다고 주장했습니다. 잠재적 부작용에 대한 우려를 제기했습니다.`,
      url: 'https://example.com/news/3',
      source: '한겨레',
      sourceType: 'news',
      sourceCredibility: 82,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      importance: 78,
      bias: 'left',
      sentiment: 'negative',
      keywords: [query, '반대', '우려', '부작용'],
      entities: ['시민단체', '야당'],
      factCheckStatus: 'partially-verified',
      relatedArticles: ['1', '6', '7'],
      author: '박기자',
    },
    {
      id: '6',
      title: `글로벌 시장, ${query}에 반응 - 국제 동향`,
      summary: `글로벌 시장에서 ${query} 관련 뉴스에 반응하고 있습니다. 주요 국가들의 대응 현황을 정리했습니다.`,
      url: 'https://example.com/news/4',
      source: '로이터',
      sourceType: 'news',
      sourceCredibility: 90,
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      importance: 82,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '글로벌', '시장', '국제'],
      entities: ['미국', 'EU', '중국'],
      factCheckStatus: 'verified',
      relatedArticles: ['2', '7'],
    },
    {
      id: '7',
      title: `${query} 기술적 분석 - 데이터로 보는 현황`,
      summary: `${query}를 기술적 관점에서 분석했습니다. 최신 데이터를 기반으로 현황을 파악했습니다.`,
      url: 'https://example.com/news/5',
      source: 'ZDNet Korea',
      sourceType: 'news',
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
      id: '8',
      title: `${query} 여론 조사 - 국민 의견은?`,
      summary: `${query}에 대한 여론 조사 결과가 발표되었습니다. 찬성과 반대 의견이 팽팽한 것으로 나타났습니다.`,
      url: 'https://example.com/news/6',
      source: '갤럽',
      sourceType: 'news',
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
    {
      id: '9',
      title: `트위터 화제: ${query} 관련 내부 정보?`,
      summary: `트위터에서 ${query} 관련 게시물이 화제입니다. 업계 관계자로 추정되는 사용자가 정보를 공유했습니다.`,
      url: 'https://twitter.com/example/1',
      source: 'X (Twitter)',
      sourceType: 'sns',
      sourceCredibility: 45,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      importance: 65,
      bias: 'mixed',
      sentiment: 'positive',
      keywords: [query, '트위터', '내부정보'],
      entities: ['업계관계자'],
      factCheckStatus: 'unverified',
      relatedArticles: ['1', '10'],
      author: '@industry_insider',
      engagement: { likes: 15420, shares: 3200, comments: 890 },
    },
    {
      id: '10',
      title: `[찌라시] ${query} 관련 충격적 소식?`,
      summary: `온라인에서 ${query} 관련 확인되지 않은 소식이 돌고 있습니다. 특정 이해관계자에 의해 유포되었을 가능성이 있습니다.`,
      url: 'https://example.com/rumor/1',
      source: '온라인 커뮤니티',
      sourceType: 'rumor',
      sourceCredibility: 15,
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      importance: 35,
      bias: 'mixed',
      sentiment: 'negative',
      keywords: [query, '찌라시', '미확인'],
      entities: ['미상'],
      factCheckStatus: 'disputed',
      relatedArticles: ['9', '11'],
    },
    {
      id: '11',
      title: `커뮤니티 분석: ${query} 총정리`,
      summary: `온라인 커뮤니티에 ${query}를 총정리한 글이 올라왔습니다. 작성자는 업계 종사자로 추정됩니다.`,
      url: 'https://example.com/community/1',
      source: '네이트판',
      sourceType: 'community',
      sourceCredibility: 30,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      importance: 58,
      bias: 'mixed',
      sentiment: 'neutral',
      keywords: [query, '총정리', '내부자'],
      entities: ['업계종사자'],
      factCheckStatus: 'unverified',
      relatedArticles: ['9', '10'],
      engagement: { likes: 8900, comments: 1200 },
    },
    {
      id: '12',
      title: `[유튜브] ${query} 완벽 정리 | 10분 요약`,
      summary: `인기 유튜브 채널에서 ${query}를 쉽게 정리한 영상을 업로드했습니다.`,
      url: 'https://youtube.com/watch?v=example',
      source: 'YouTube',
      sourceType: 'video',
      sourceCredibility: 55,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      importance: 60,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '유튜브', '요약'],
      entities: ['유튜버'],
      factCheckStatus: 'partially-verified',
      relatedArticles: ['4', '7'],
      author: 'OOO채널',
      engagement: { views: 234000, likes: 12000, comments: 1500 },
    },
  ];

  return mockNews;
}

export function generateMockSummary(query: string): AISummary {
  return {
    overview: `"${query}"와 관련하여 총 12개의 다양한 소스가 분석되었습니다. 공식 발표 2건, 주요 언론 보도 6건, SNS 1건, 커뮤니티 1건, 루머 1건, 영상 1건이 포함됩니다. 정부 정책 변화가 핵심 이슈이며, 전문가들은 이를 중대한 전환점으로 평가하고 있습니다.`,
    keyPoints: [
      '정부의 공식 정책 발표 - 산업 전반 영향 예상 (신뢰도 98%)',
      '전문가들, "중대한 전환점" 평가 (다수 동의)',
      '반대 측, 잠재적 부작용 우려 제기',
      '글로벌 시장 반응 및 국제 동향 주목',
      'SNS에서 내부 정보 공유 (미확인)',
      '여론 조사 결과 찬반 팽팽',
    ],
    timeline: [
      { date: '18시간 전', title: '여론 조사 결과 발표', description: '찬반 의견이 팽팽', sources: ['갤럽'] },
      { date: '12시간 전', title: '유튜브 요약 영상', description: '10분 완벽 정리', sources: ['YouTube'] },
      { date: '8시간 전', title: '글로벌 시장 반응', description: '주요 국가 대응 현황', sources: ['로이터'] },
      { date: '6시간 전', title: '커뮤니티 분석', description: '내부자 제보 포함', sources: ['네이트판'] },
      { date: '4시간 전', title: '찌라시 유포', description: '미확인 소식', sources: ['온라인'] },
      { date: '4시간 전', title: '반대 측 입장', description: '신중한 접근 필요', sources: ['한겨레'] },
      { date: '3시간 전', title: 'SNS 내부 정보', description: '업계 관계자 추정', sources: ['Twitter'] },
      { date: '2시간 전', title: '시행细则 발표', description: '단계적 시행 계획', sources: ['산업부'] },
      { date: '1시간 전', title: '정부 공식 발표', description: '관계부처 합동 브리핑', sources: ['청와대'] },
    ],
    consensus: '대다수의 소스에서 이번 변화의 중요성에 동의하고 있으나, 속도와 범위에 대해서는 의견이 분분합니다.',
    controversies: [
      '정책 시행 시점에 대한 이견',
      '잠재적 부작용 규모에 대한 논쟁',
      'SNS 정보의 신빙성 문제',
    ],
    confidence: 82,
    totalSources: 12,
    sourceBreakdown: {
      news: 6,
      official: 2,
      sns: 1,
      rumor: 1,
      community: 1,
      expert: 0,
    },
  };
}

export function generateMockFactCheck(query: string): FactCheckResult[] {
  return [
    {
      claim: `정부가 "${query}" 관련 정책을 전격 발표했다`,
      status: 'true',
      evidence: ['정부 공식 보도자료 확인', '다수 언론 보도 일치'],
      sources: [
        { name: '청와대', url: 'https://example.com/1', credibility: 98 },
        { name: '한국경제', url: 'https://example.com/2', credibility: 88 },
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
      explanation: '일부 전문가들은 동의하지만, 모든 전문가가 같은 의견인 것은 아닙니다.',
    },
    {
      claim: 'SNS에 내부 정보가 공유되고 있다',
      status: 'unverified',
      evidence: ['SNS 게시물 확인', '작성자 신원 미확인'],
      sources: [
        { name: 'X (Twitter)', url: 'https://twitter.com/example', credibility: 45 },
      ],
      explanation: 'SNS에 해당 정보가 공유되고 있는 것은 사실이지만, 작성자의 신원과 정보의 정확성은 확인되지 않았습니다.',
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
    ],
    comparisonWithOtherSources: '경제지는 긍정적 프레임, 시민단체 관련 보도는 부정적 프레임, 외신은 중립적 프레임으로 보도하는 경향이 있습니다.',
  };
}
