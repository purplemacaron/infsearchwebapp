import { useState, useEffect } from 'react';
import { NewsItem, ChatMessage, AISummary, FactCheckResult, BiasAnalysis, APIConfig, SearchFilters, SearchStrategy } from './types';
import { generateMockSummary, generateMockFactCheck, generateMockBiasAnalysis, callAI } from './utils/api';
import { performAISearch, analyzeResults } from './utils/aiSearch';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AISummaryPanel from './components/AISummaryPanel';
import NewsList from './components/NewsList';
import ChatPanel from './components/ChatPanel';
import FactCheckPanel from './components/FactCheckPanel';
import BiasPanel from './components/BiasPanel';
import TimelinePanel from './components/TimelinePanel';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';

function App() {
  // GitHub Pages redirect 처리
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, '', redirect.replace(window.location.origin, ''));
    }
  }, []);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [searchStrategy, setSearchStrategy] = useState<SearchStrategy | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [factCheckResults, setFactCheckResults] = useState<FactCheckResult[]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activePanel, setActivePanel] = useState<'news' | 'factcheck' | 'bias' | 'timeline'>('news');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => {
    const saved = localStorage.getItem('infsearch-config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        temperature: parsed.temperature ?? 0.7,
        maxTokens: parsed.maxTokens ?? 4000,
        newsApiKey: parsed.newsApiKey ?? '',
      };
    }
    return {
      provider: 'openai',
      apiKey: '',
      baseUrl: '',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000,
      newsApiKey: '',
    };
  });
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: '24h',
    credibility: 0,
    biasFilter: 'all',
    sortBy: 'importance',
    sourceType: 'all',
  });

  useEffect(() => {
    localStorage.setItem('infsearch-config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    setActivePanel('news');
    setSearchStatus('AI가 검색 전략을 수립하고 있습니다...');

    try {
      // AI 기반 검색 수행
      setSearchStatus('AI가 검색 전략을 수립하고 있습니다...');
      const { results, strategy } = await performAISearch(searchQuery, apiConfig);
      
      // AI로 결과 분석
      setSearchStatus(`검색 완료 (${results.length}개 결과). AI가 분석 중입니다...`);
      const aiAnalysis = await analyzeResults(searchQuery, results, apiConfig);
      
      // 요약 생성
      const summary = generateMockSummary(searchQuery, strategy, aiAnalysis);
      const factChecks = generateMockFactCheck(searchQuery);
      const bias = generateMockBiasAnalysis(searchQuery);

      setSearchResults(results);
      setAiSummary(summary);
      setSearchStrategy(strategy);
      setFactCheckResults(factChecks);
      setBiasAnalysis(bias);
      setSearchStatus('');
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchStatus('');
    } finally {
      setIsSearching(false);
    }
  };

  const handleChat = async (message: string, type: 'chat' | 'research' | 'factcheck' = 'chat') => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      type,
    };
    setChatMessages(prev => [...prev, userMsg]);

    // API 키 확인
    if (!apiConfig.apiKey) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'API 키가 설정되지 않았습니다. 우측 상단의 설정 버튼을 클릭하여 API 키를 입력해주세요.',
        timestamp: new Date().toISOString(),
        type,
      };
      setChatMessages(prev => [...prev, errorMsg]);
      return;
    }

    const systemMsg: ChatMessage = {
      id: 'system',
      role: 'system',
      content: `당신은 정보 분석 AI 어시스턴트입니다. 현재 "${query}"에 대한 분석 결과를 바탕으로 답변하세요. 팩트체크, 편향성 분석, 신뢰도 평가 등을 수행할 수 있습니다.`,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await callAI([...chatMessages, systemMsg, userMsg], apiConfig);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        type,
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n설정에서 API 키와 모델 설정을 확인해주세요.`,
        timestamp: new Date().toISOString(),
        type,
      };
      setChatMessages(prev => [...prev, errorMsg]);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const filteredResults = searchResults
    .filter(item => item.sourceCredibility >= filters.credibility)
    .filter(item => filters.biasFilter === 'all' || item.bias === filters.biasFilter)
    .filter(item => filters.sourceType === 'all' || item.sourceType === filters.sourceType)
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'importance': return b.importance - a.importance;
        case 'date': return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'credibility': return b.sourceCredibility - a.sourceCredibility;
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header
        onOpenSettings={() => setShowSettings(true)}
        onToggleChat={() => setShowChat(!showChat)}
        chatOpen={showChat}
      />

      <div className="flex">
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          bookmarkCount={bookmarks.length}
        />

        <main className="flex-1 max-w-5xl mx-auto px-6 py-8">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} status={searchStatus} />

          {aiSummary && (
            <AISummaryPanel summary={aiSummary} query={query} strategy={searchStrategy} />
          )}

          {searchResults.length > 0 && (
            <div className="mt-8">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-5 items-center bg-gray-50/50 border border-gray-100 rounded-xl p-3">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">필터</span>
                <div className="w-px h-4 bg-gray-200" />
                <select
                  value={filters.sortBy}
                  onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as any }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="importance">중요도순</option>
                  <option value="date">최신순</option>
                  <option value="credibility">신뢰도순</option>
                </select>
                <select
                  value={filters.sourceType}
                  onChange={e => setFilters(f => ({ ...f, sourceType: e.target.value as any }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 소스</option>
                  <option value="official">공식 발표</option>
                  <option value="news">뉴스</option>
                  <option value="expert">전문가</option>
                  <option value="sns">SNS</option>
                  <option value="community">커뮤니티</option>
                  <option value="rumor">루머/찌라시</option>
                  <option value="video">영상</option>
                  <option value="blog">블로그</option>
                </select>
                <select
                  value={filters.dateRange}
                  onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value as any }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1h">1시간 이내</option>
                  <option value="6h">6시간 이내</option>
                  <option value="24h">24시간 이내</option>
                  <option value="7d">7일 이내</option>
                  <option value="30d">30일 이내</option>
                  <option value="all">전체</option>
                </select>
                <select
                  value={filters.biasFilter}
                  onChange={e => setFilters(f => ({ ...f, biasFilter: e.target.value as any }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 편향</option>
                  <option value="left">진보</option>
                  <option value="center">중립</option>
                  <option value="right">보수</option>
                </select>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-gray-400">최저 신뢰도</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.credibility}
                    onChange={e => setFilters(f => ({ ...f, credibility: Number(e.target.value) }))}
                    className="w-24 accent-blue-600"
                  />
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">{filters.credibility}%</span>
                </div>
              </div>

              {activePanel === 'news' && (
                <NewsList
                  results={filteredResults}
                  bookmarks={bookmarks}
                  onToggleBookmark={toggleBookmark}
                />
              )}
              {activePanel === 'factcheck' && (
                <FactCheckPanel results={factCheckResults} />
              )}
              {activePanel === 'bias' && biasAnalysis && (
                <BiasPanel analysis={biasAnalysis} />
              )}
              {activePanel === 'timeline' && aiSummary && (
                <TimelinePanel events={aiSummary.timeline} />
              )}
            </div>
          )}

          {searchResults.length === 0 && !isSearching && (
            <div className="py-12">
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                  <svg className="w-9 h-9 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">정보를 검색하세요</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  AI가 뉴스, 공식 발표, SNS, 전문가 분석 등 다양한 소스를 분석하여 중요한 정보를 정리해드립니다
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">다중 소스 분석</h3>
                  <p className="text-xs text-gray-600">뉴스, 공식 발표, SNS, 전문가 분석 등 다양한 소스를 종합 분석</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">팩트체크</h3>
                  <p className="text-xs text-gray-600">다중 소스 교차 검증을 통한 사실 확인 및 신뢰도 평가</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">편향성 분석</h3>
                  <p className="text-xs text-gray-600">보도 프레임, 감정적 언어, 누락된 맥락 분석</p>
                </div>
              </div>

              {/* Popular searches */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">인기 검색어</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI 규제', '기후변화', '반도체', '부동산', '디지털화폐', '전기차', '원자력', '스타트업', '고용시장', '의료개혁'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleSearch(tag)}
                      className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 transition-all hover:border-gray-300 hover:shadow-sm"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showChat && (
        <ChatPanel
          messages={chatMessages}
          onSend={handleChat}
          onClose={() => setShowChat(false)}
          currentQuery={query}
          hasApiKey={!!apiConfig.apiKey}
        />
      )}

      {showSettings && (
        <SettingsModal
          config={apiConfig}
          onSave={setApiConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
