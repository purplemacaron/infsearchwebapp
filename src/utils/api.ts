import { APIConfig, ChatMessage, AISummary, FactCheckResult, BiasAnalysis, NewsItem, SourceType } from '../types';

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

    // 주요 언론사 뉴스
    {
      id: '3',
      title: `${query} 주요 정책 변화 - 정부 발표`,
      summary: `최근 ${query}와 관련하여 정부에서 중요한 정책 변화를 발표했습니다. 이번 변화는 산업 전반에 걸친 영향을 미칠 것으로 예상됩니다. 전문가들은 이번 변화가 시장에 미칠 영향을 분석하고 있습니다.`,
      url: 'https://example.com/news/1',
      source: '한국경제',
      sourceType: 'news',
      sourceCredibility: 88,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      importance: 92,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '정책', '정부', '변화', '시장영향'],
      entities: ['정부', '산업부', '기업들'],
      factCheckStatus: 'verified',
      relatedArticles: ['1', '2', '4'],
      author: '김기자',
    },
    {
      id: '4',
      title: `전문가들, ${query} 영향 분석 "중대한 전환점"`,
      summary: `국내 주요 전문가들이 ${query}의 영향에 대해 분석했습니다. 이들은 이번 변화를 중대한 전환점으로 평가하면서도, 일부에서는 신중한 접근이 필요하다는 의견도 제시했습니다.`,
      url: 'https://example.com/news/2',
      source: '연합뉴스',
      sourceType: 'news',
      sourceCredibility: 92,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      importance: 88,
      bias: 'center',
      sentiment: 'positive',
      keywords: [query, '전문가', '분석', '전환점', '평가'],
      entities: ['전문가', '연구기관', '대학'],
      factCheckStatus: 'verified',
      relatedArticles: ['1', '5', '6'],
      author: '이기자',
    },
    {
      id: '5',
      title: `${query} 반대 측 주장 "신중한 접근 필요"`,
      summary: `${query}에 대한 반대 측에서 신중한 접근이 필요하다고 주장했습니다. 잠재적 부작용에 대한 우려를 제기했으며, 추가적인 영향 평가가 선행되어야 한다고 강조했습니다.`,
      url: 'https://example.com/news/3',
      source: '한겨레',
      sourceType: 'news',
      sourceCredibility: 82,
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      importance: 80,
      bias: 'left',
      sentiment: 'negative',
      keywords: [query, '반대', '우려', '부작용', '신중'],
      entities: ['시민단체', '야당', '노동계'],
      factCheckStatus: 'partially-verified',
      relatedArticles: ['1', '6', '7'],
      author: '박기자',
    },
    {
      id: '6',
      title: `${query} 보수 언론 분석 "시장 자유화 긍정적"`,
      summary: `보수 성향 언론에서는 ${query}를 시장 자유화의 긍정적 신호로 평가했습니다. 규제 완화와 기업 활동 촉진을 기대한다는 분석입니다.`,
      url: 'https://example.com/news/4',
      source: '조선일보',
      sourceType: 'news',
      sourceCredibility: 78,
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      importance: 75,
      bias: 'right',
      sentiment: 'positive',
      keywords: [query, '시장', '자유화', '규제완화', '기업'],
      entities: ['기업계', '경제단체'],
      factCheckStatus: 'verified',
      relatedArticles: ['4', '5', '8'],
      author: '최기자',
    },

    // 국제 뉴스
    {
      id: '7',
      title: `글로벌 시장, ${query}에 반응 - 국제 동향`,
      summary: `글로벌 시장에서 ${query} 관련 뉴스에 반응하고 있습니다. 미국, EU, 중국 등 주요 국가들의 대응 현황을 정리했습니다. 국제 투자자들의 관심도 높아지고 있습니다.`,
      url: 'https://example.com/news/5',
      source: '로이터',
      sourceType: 'news',
      sourceCredibility: 90,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      importance: 85,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '글로벌', '시장', '국제', '투자'],
      entities: ['미국', 'EU', '중국', '일본'],
      factCheckStatus: 'verified',
      relatedArticles: ['1', '8', '9'],
      author: 'Reuters',
    },
    {
      id: '8',
      title: `Bloomberg: ${query}가 글로벌 공급망에 미칠 영향`,
      summary: `블룸버그 통신이 ${query}가 글로벌 공급망에 미칠 영향을 심층 분석했습니다. 특히 반도체, 배터리 등 핵심 산업에서의 변화가 주목됩니다.`,
      url: 'https://example.com/news/6',
      source: 'Bloomberg',
      sourceType: 'news',
      sourceCredibility: 91,
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      importance: 83,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '공급망', '반도체', '배터리', '글로벌'],
      entities: ['Bloomberg', '글로벌 기업들'],
      factCheckStatus: 'verified',
      relatedArticles: ['7', '9', '10'],
    },

    // 전문가 칼럼/분석
    {
      id: '9',
      title: `[전문가 칼럼] ${query}의 경제적 영향 - 김교수 분석`,
      summary: `국내 최고 권위자인 김교수가 ${query}의 경제적 영향을 분석했습니다. 단기적 충격과 장기적 효과로 나누어 설명하며, 정책의 방향성에 대한 제언도 포함했습니다.`,
      url: 'https://example.com/expert/1',
      source: '서울대학교',
      sourceType: 'expert',
      sourceCredibility: 89,
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      importance: 78,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '경제적 영향', '분석', '장기적 효과'],
      entities: ['김교수', '서울대', '경제연구원'],
      factCheckStatus: 'verified',
      relatedArticles: ['4', '7', '10'],
      author: '김OO 교수',
    },
    {
      id: '10',
      title: `[기고] ${query}와 기술 혁신의 미래 - 이연구원`,
      summary: `기술 정책 연구원의 이연구원이 ${query}가 기술 혁신에 미칠 영향을 기고했습니다. 한국의 경쟁력 강화 기회와 함께 준비해야 할 과제를 제시합니다.`,
      url: 'https://example.com/expert/2',
      source: '과학기술정책연구원',
      sourceType: 'expert',
      sourceCredibility: 86,
      publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      importance: 74,
      bias: 'center',
      sentiment: 'positive',
      keywords: [query, '기술혁신', '경쟁력', '미래'],
      entities: ['이연구원', 'STEPI', '기술업계'],
      factCheckStatus: 'verified',
      relatedArticles: ['9', '11'],
      author: '이OO 박사',
    },

    // SNS 게시물 (중간~낮은 신뢰도)
    {
      id: '11',
      title: `트위터 인기 글: "${query} 드디어 시작되네"`,
      summary: `트위터에서 ${query} 관련 게시물이 화제입니다. 업계 관계자로 추정되는 사용자가 내부 정보를 공유하며 큰 관심을 받고 있습니다.`,
      url: 'https://twitter.com/example/1',
      source: 'X (Twitter)',
      sourceType: 'sns',
      sourceCredibility: 45,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      importance: 65,
      bias: 'mixed',
      sentiment: 'positive',
      keywords: [query, '트위터', '내부정보', '화제'],
      entities: ['업계관계자'],
      factCheckStatus: 'unverified',
      relatedArticles: ['1', '12'],
      author: '@industry_insider',
      engagement: { likes: 15420, shares: 3200, comments: 890 },
    },
    {
      id: '12',
      title: `페이스북 커뮤니티: ${query}에 대한 시민 반응`,
      summary: `페이스북 관련 커뮤니티에서 ${query}에 대한 시민들의 반응이 활발합니다. 찬성과 반대 의견이 팽팽하며, 실제 영향에 대한 경험담이 공유되고 있습니다.`,
      url: 'https://facebook.com/groups/example',
      source: 'Facebook',
      sourceType: 'sns',
      sourceCredibility: 40,
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      importance: 55,
      bias: 'mixed',
      sentiment: 'mixed',
      keywords: [query, '시민반응', '찬반', '경험담'],
      entities: ['시민들'],
      factCheckStatus: 'unverified',
      relatedArticles: ['11', '13'],
      engagement: { likes: 2340, shares: 560, comments: 430 },
    },
    {
      id: '13',
      title: `인스타그램: 유명 인플루언서의 ${query} 분석`,
      summary: `경제/기술 분야 인플루언서가 ${query}를 쉽게 설명하는 콘텐츠를 게시했습니다. 젊은 층에서 큰 호응을 얻고 있습니다.`,
      url: 'https://instagram.com/p/example',
      source: 'Instagram',
      sourceType: 'sns',
      sourceCredibility: 35,
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      importance: 48,
      bias: 'center',
      sentiment: 'positive',
      keywords: [query, '인플루언서', '분석', '쉬운설명'],
      entities: ['인플루언서'],
      factCheckStatus: 'partially-verified',
      relatedArticles: ['11', '12'],
      author: '@tech_explainer',
      engagement: { likes: 45000, shares: 1200, comments: 2100 },
    },

    // 커뮤니티 글
    {
      id: '14',
      title: `딥다이브: ${query} 총정리 (feat. 내부자 제보)`,
      summary: `온라인 커뮤니티에 ${query}를 총정리한 글이 올라왔습니다. 작성자는 업계 종사자로 추정되며, 상세한 분석과 함께 내부 정보를 일부 공개했습니다.`,
      url: 'https://example.com/community/1',
      source: '네이트판',
      sourceType: 'community',
      sourceCredibility: 30,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      importance: 58,
      bias: 'mixed',
      sentiment: 'neutral',
      keywords: [query, '총정리', '내부자', '제보', '상세분석'],
      entities: ['업계종사자'],
      factCheckStatus: 'unverified',
      relatedArticles: ['11', '15'],
      engagement: { likes: 8900, comments: 1200 },
    },
    {
      id: '15',
      title: `루리웹: ${query} 실체 파악 스레드`,
      summary: `게임/IT 커뮤니티에서 ${query}의 실체를 파악하는 스레드가 활발합니다. 네티즌들이 다양한 각도에서 분석하고 있으며, 팩트와 루머가 혼재되어 있습니다.`,
      url: 'https://example.com/community/2',
      source: '루리웹',
      sourceType: 'community',
      sourceCredibility: 25,
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      importance: 42,
      bias: 'mixed',
      sentiment: 'mixed',
      keywords: [query, '실체파악', '분석', '네티즌'],
      entities: ['네티즌'],
      factCheckStatus: 'unverified',
      relatedArticles: ['14', '16'],
      engagement: { likes: 3400, comments: 890 },
    },

    // 찌라시/루머 (낮은 신뢰도)
    {
      id: '16',
      title: `[찌라시] ${query} 관련 충격적 내부 소식?`,
      summary: `온라인에서 ${query} 관련 충격적인 내부 소식이 돌고 있습니다. 확인되지 않은 정보이며, 특정 이해관계자에 의해 유포되었을 가능성이 있습니다.`,
      url: 'https://example.com/rumor/1',
      source: '온라인 커뮤니티',
      sourceType: 'rumor',
      sourceCredibility: 15,
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      importance: 35,
      bias: 'mixed',
      sentiment: 'negative',
      keywords: [query, '찌라시', '내부소식', '미확인'],
      entities: ['미상'],
      factCheckStatus: 'disputed',
      relatedArticles: ['14', '15'],
    },
    {
      id: '17',
      title: `[루머] ${query} 무산된다는 주장 - 근거는?`,
      summary: `${query}가 무산될 것이라는 루머가 돌고 있습니다. 특정 매체에서 보도했으나, 정부 측은 사실이 아니라고 일축했습니다.`,
      url: 'https://example.com/rumor/2',
      source: '유튜브 채널',
      sourceType: 'rumor',
      sourceCredibility: 20,
      publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      importance: 30,
      bias: 'right',
      sentiment: 'negative',
      keywords: [query, '루머', '무산', '주장'],
      entities: ['유튜버'],
      factCheckStatus: 'disputed',
      relatedArticles: ['1', '16'],
      engagement: { views: 125000, likes: 4500, comments: 890 },
    },

    // 유튜브 영상
    {
      id: '18',
      title: `[유튜브] ${query} 완벽 정리 | 10분 요약`,
      summary: `인기 유튜브 채널에서 ${query}를 10분 만에 완벽하게 정리한 영상을 업로드했습니다. 시각 자료와 함께 쉽게 설명하여 많은 조회수를 기록 중입니다.`,
      url: 'https://youtube.com/watch?v=example',
      source: 'YouTube',
      sourceType: 'video',
      sourceCredibility: 55,
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      importance: 60,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '유튜브', '요약', '정리', '시각자료'],
      entities: ['유튜버'],
      factCheckStatus: 'partially-verified',
      relatedArticles: ['4', '9'],
      author: 'OOO채널',
      engagement: { views: 234000, likes: 12000, comments: 1500 },
    },

    // 블로그
    {
      id: '19',
      title: `[블로그] ${query} 개인적 경험과 분석`,
      summary: `관련 업계에 종사하는 블로거가 ${query}에 대한 개인적 경험과 분석을 공유했습니다. 실무자 관점에서의 인사이트가 포함되어 있습니다.`,
      url: 'https://blog.example.com/post/1',
      source: '티스토리',
      sourceType: 'blog',
      sourceCredibility: 45,
      publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      importance: 50,
      bias: 'center',
      sentiment: 'neutral',
      keywords: [query, '개인경험', '분석', '실무자', '인사이트'],
      entities: ['블로거', '실무자'],
      factCheckStatus: 'partially-verified',
      relatedArticles: ['9', '14'],
      author: '현직자블로그',
    },
    {
      id: '20',
      title: `[기술 블로그] ${query} 기술적 심층 분석`,
      summary: `기술 전문가가 운영하는 블로그에서 ${query}의 기술적 측면을 심층 분석했습니다. 코드 예시와 함께 기술적 구현 방안을 제시합니다.`,
      url: 'https://techblog.example.com/post/1',
      source: 'Medium',
      sourceType: 'blog',
      sourceCredibility: 65,
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      importance: 62,
      bias: 'center',
      sentiment: 'positive',
      keywords: [query, '기술분석', '심층', '코드', '구현'],
      entities: ['기술전문가'],
      factCheckStatus: 'verified',
      relatedArticles: ['9', '10', '18'],
      author: 'TechExpert',
    },
  ];

  return mockNews;
}

export function generateMockSummary(query: string): AISummary {
  return {
    overview: `"${query}"와 관련하여 총 20개의 다양한 소스가 분석되었습니다. 공식 발표 2건, 주요 언론 보도 6건, 전문가 분석 2건, SNS 및 커뮤니티 5건, 루머 2건, 영상 및 블로그 3건이 포함됩니다. 정부 정책 변화가 핵심 이슈이며, 전문가들은 이를 중대한 전환점으로 평가하고 있습니다. 다만 SNS와 커뮤니티에서는 확인되지 않은 정보도 유포되고 있어 주의가 필요합니다.`,
    keyPoints: [
      '정부의 공식 정책 발표 - 산업 전반 영향 예상 (신뢰도 98%)',
      '전문가들, "중대한 전환점" 평가 (다수 동의)',
      '반대 측, 잠재적 부작용 우려 제기',
      '글로벌 시장 반응 및 국제 동향 주목',
      'SNS에서 내부 정보 공유 활발 (미확인 정보 포함)',
      '온라인 커뮤니티에서 상세 분석 글 화제',
      '일부 루머 유포 중 - 정부 측 부인',
      '유튜브 등 영상 콘텐츠에서 쉽게 정리',
    ],
    timeline: [
      { date: '18시간 전', title: '기술 블로그 심층 분석', description: '기술적 구현 방안 제시', sources: ['Medium'] },
      { date: '15시간 전', title: '개인 블로그 경험 공유', description: '실무자 관점 인사이트', sources: ['티스토리'] },
      { date: '12시간 전', title: '유튜브 요약 영상', description: '10분 완벽 정리', sources: ['YouTube'] },
      { date: '10시간 전', title: '인플루언서 분석', description: '쉬운 설명 콘텐츠 화제', sources: ['Instagram'] },
      { date: '9시간 전', title: '전문가 기고', description: '기술 혁신과 미래 분석', sources: ['STEPI'] },
      { date: '8시간 전', title: '전문가 칼럼', description: '경제적 영향 분석', sources: ['서울대'] },
      { date: '8시간 전', title: '커뮤니티 분석', description: '내부자 제보 포함 총정리', sources: ['네이트판'] },
      { date: '7시간 전', title: '루머 유포', description: '무산 주장 - 정부 부인', sources: ['유튜브'] },
      { date: '7시간 전', title: 'Bloomberg 분석', description: '글로벌 공급망 영향', sources: ['Bloomberg'] },
      { date: '6시간 전', title: '글로벌 시장 반응', description: '주요 국가 대응 현황', sources: ['로이터'] },
      { date: '5시간 전', title: '보수 언론 분석', description: '시장 자유화 긍정 평가', sources: ['조선일보'] },
      { date: '5시간 전', title: 'SNS 시민 반응', description: '찬반 의견 팽팽', sources: ['Facebook'] },
      { date: '4시간 전', title: '찌라시 유포', description: '충격적 내부 소식 (미확인)', sources: ['온라인'] },
      { date: '4시간 전', title: '반대 측 입장', description: '신중한 접근 필요 주장', sources: ['한겨레'] },
      { date: '3시간 전', title: 'SNS 내부 정보', description: '업계 관계자 추정 게시물 화제', sources: ['Twitter'] },
      { date: '3시간 전', title: '전문가 분석', description: '중대한 전환점 평가', sources: ['연합뉴스'] },
      { date: '2시간 전', title: '시행细则 발표', description: '단계적 시행 계획', sources: ['산업부'] },
      { date: '1시간 전', title: '정부 공식 발표', description: '관계부처 합동 브리핑', sources: ['청와대'] },
    ],
    consensus: '대다수의 공식 소스와 전문가들이 이번 변화의 중요성에 동의하고 있으나, 속도와 범위에 대해서는 의견이 분분합니다. SNS와 커뮤니티에서는 더 급진적인 변화가 있을 것이라는 기대감이 있는 반면, 일부에서는 우려의 목소리도 있습니다.',
    controversies: [
      '정책 시행 시점에 대한 이견 (정부 vs 업계)',
      '잠재적 부작용 규모에 대한 논쟁',
      'SNS 내부 정보의 신빙성 문제',
      '루머와 사실의 경계 모호',
      '글로벌 비교 대상 선정의 적절성',
    ],
    confidence: 82,
    totalSources: 20,
    sourceBreakdown: {
      news: 6,
      official: 2,
      sns: 3,
      rumor: 2,
      community: 2,
      expert: 2,
    },
  };
}

export function generateMockFactCheck(query: string): FactCheckResult[] {
  return [
    {
      claim: `정부가 "${query}" 관련 정책을 전격 발표했다`,
      status: 'true',
      evidence: ['정부 공식 보도자료 확인', '다수 언론 보도 일치', '관련 부처 홈페이지 게시'],
      sources: [
        { name: '청와대', url: 'https://example.com/1', credibility: 98 },
        { name: '한국경제', url: 'https://example.com/2', credibility: 88 },
        { name: '연합뉴스', url: 'https://example.com/3', credibility: 92 },
      ],
      explanation: '해당 내용은 정부 공식 발표를 기반으로 하며, 다수의 신뢰할 수 있는 언론사에서 확인되었습니다. 공식 보도자료와 관련 부처 홈페이지에서도 확인 가능합니다.',
    },
    {
      claim: '전문가들이 중대한 전환점으로 평가',
      status: 'partially-true',
      evidence: ['일부 전문가 동의', '다른 전문가들은 유보적 입장', '모든 전문가가 같은 의견은 아님'],
      sources: [
        { name: '연합뉴스', url: 'https://example.com/2', credibility: 92 },
        { name: '서울대학교', url: 'https://example.com/expert/1', credibility: 89 },
      ],
      explanation: '일부 전문가들은 동의하지만, 모든 전문가가 같은 의견인 것은 아닙니다. 보도에서 "전문가들"이라 일반화한 부분은 주의가 필요합니다. 일부는 신중한 접근을 강조합니다.',
    },
    {
      claim: 'SNS에 내부 정보가 공유되고 있다',
      status: 'unverified',
      evidence: ['SNS 게시물 확인', '작성자 신원 미확인', '공식 확인 없음'],
      sources: [
        { name: 'X (Twitter)', url: 'https://twitter.com/example', credibility: 45 },
      ],
      explanation: 'SNS에 해당 정보가 공유되고 있는 것은 사실이지만, 작성자의 신원과 정보의 정확성은 확인되지 않았습니다. 공식 확인 전까지는 참고용으로만 활용해야 합니다.',
    },
    {
      claim: `${query}가 무산될 것이라는 주장`,
      status: 'false',
      evidence: ['정부 측 공식 부인', '시행 준비 진행 중', '관련 예산 확보'],
      sources: [
        { name: '청와대', url: 'https://example.com/1', credibility: 98 },
        { name: '산업부', url: 'https://example.com/2', credibility: 96 },
      ],
      explanation: '해당 주장은 사실이 아닙니다. 정부 측은 공식적으로 부인했으며, 관련 부처에서는 시행 준비가 진행 중입니다. 특정 유튜버에 의해 유포된 루머로 보입니다.',
    },
    {
      claim: '글로벌 시장이 반응하고 있다',
      status: 'true',
      evidence: ['국제 통신사 보도 확인', '시장 데이터 반영', '해외 언론 보도'],
      sources: [
        { name: '로이터', url: 'https://example.com/4', credibility: 90 },
        { name: 'Bloomberg', url: 'https://example.com/5', credibility: 91 },
      ],
      explanation: '로이터와 블룸버그 통신을 통해 글로벌 시장 반응이 확인되었습니다. 주요 국가들의 대응도 보도되고 있습니다.',
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
      '기술 혁신 중심 프레이밍 (전문가)',
      '규제 완화 중심 프레이밍 (보수지)',
    ],
    loadedLanguage: [
      '"전격 발표" - 긴급성 강조 (한국경제)',
      '"우려" - 부정적 뉘앙스 (한겨레)',
      '"전환점" - 긍정적 뉘앙스 (연합뉴스)',
      '"충격적" - 선정적 표현 (유튜브)',
      '"드디어" - 기대감 표현 (SNS)',
    ],
    omittedContext: [
      '유사 사례의 과거 결과 미언급 (대다수 보도)',
      '영향 받는 구체적 수치 부족',
      '국제 비교 데이터 제한적',
      '반대 측 주장의 상세 내용 생략',
      'SNS 정보의 출처 불분명',
    ],
    comparisonWithOtherSources: '경제지는 긍정적 프레임, 시민단체 관련 보도는 부정적 프레임, 외신은 중립적 프레임으로 보도하는 경향이 있습니다. SNS와 커뮤니티는 더 감정적이고 즉각적인 반응을 보이는 반면, 전문가 분석은 균형잡힌 시각을 제공합니다. 루머성 콘텐츠는 확인되지 않은 정보를 포함하고 있어 주의가 필요합니다.',
  };
}
