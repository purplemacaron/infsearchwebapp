import { useState, useEffect } from 'react';
import { NewsItem, ChatMessage, AISummary, FactCheckResult, BiasAnalysis, APIConfig, SearchFilters } from './types';
import { generateMockNews, generateMockSummary, generateMockFactCheck, generateMockBiasAnalysis, callAI } from './utils/api';
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
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [factCheckResults, setFactCheckResults] = useState<FactCheckResult[]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activePanel, setActivePanel] = useState<'news' | 'factcheck' | 'bias' | 'timeline'>('news');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [apiConfig, setApiConfig] = useState<APIConfig>(() => {
    const saved = localStorage.getItem('infsearch-config');
    return saved ? JSON.parse(saved) : {
      provider: 'openai',
      apiKey: '',
      baseUrl: '',
      model: 'gpt-4',
    };
  });
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: '24h',
    credibility: 50,
    biasFilter: 'all',
    sortBy: 'importance',
  });

  useEffect(() => {
    localStorage.setItem('infsearch-config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    setActivePanel('news');

    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = generateMockNews(searchQuery);
    const summary = generateMockSummary(searchQuery);
    const factChecks = generateMockFactCheck(searchQuery);
    const bias = generateMockBiasAnalysis(searchQuery);

    setSearchResults(results);
    setAiSummary(summary);
    setFactCheckResults(factChecks);
    setBiasAnalysis(bias);
    setIsSearching(false);
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

    const systemMsg: ChatMessage = {
      id: 'system',
      role: 'system',
      content: `당신은 정보 분석 AI 어시스턴트입니다. 현재 "${query}"에 대한 분석 결과를 바탕으로 답변하세요. 팩트체크, 편향성 분석, 신뢰도 평가 등을 수행할 수 있습니다.`,
      timestamp: new Date().toISOString(),
    };

    const response = await callAI([...chatMessages, systemMsg, userMsg], apiConfig);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      type,
    };
    setChatMessages(prev => [...prev, assistantMsg]);
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const filteredResults = searchResults
    .filter(item => item.sourceCredibility >= filters.credibility)
    .filter(item => filters.biasFilter === 'all' || item.bias === filters.biasFilter)
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
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />

          {aiSummary && (
            <AISummaryPanel summary={aiSummary} query={query} />
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
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">정보를 검색하세요</h2>
              <p className="text-gray-400 text-sm">AI가 뉴스를 분석하고 중요한 정보를 정리해드립니다</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['AI 규제', '기후변화', '반도체', '부동산', '디지털화폐'].map(tag => (
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
          )}
        </main>
      </div>

      {showChat && (
        <ChatPanel
          messages={chatMessages}
          onSend={handleChat}
          onClose={() => setShowChat(false)}
          currentQuery={query}
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
