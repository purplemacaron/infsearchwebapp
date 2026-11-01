import { useState, useEffect } from 'react';
import { APIConfig, ModelInfo, APIUsage } from '../types';
import { OPENAI_MODELS, ANTHROPIC_MODELS, testAPIConnection, getAPIUsage, resetAPIUsage, fetchAvailableModels } from '../utils/api';

interface SettingsModalProps {
  config: APIConfig;
  onSave: (config: APIConfig) => void;
  onClose: () => void;
}

export default function SettingsModal({ config, onSave, onClose }: SettingsModalProps) {
  const [localConfig, setLocalConfig] = useState<APIConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [usage, setUsage] = useState<APIUsage>(getAPIUsage());
  const [activeTab, setActiveTab] = useState<'connection' | 'models' | 'usage'>('connection');

  useEffect(() => {
    if (localConfig.apiKey) {
      loadModels();
    }
  }, [localConfig.provider, localConfig.apiKey]);

  const loadModels = async () => {
    if (!localConfig.apiKey) return;
    setLoadingModels(true);
    setAvailableModels([]); // 기존 모델 목록 초기화
    
    try {
      const models = await fetchAvailableModels(localConfig);
      setAvailableModels(models);
    } catch (error) {
      console.error('Failed to load models:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      
      // 에러 메시지를 사용자에게 표시
      if (errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch')) {
        alert(`모델 목록을 가져올 수 없습니다.\n\n${errorMessage}\n\nBase URL을 확인하거나 CORS 프록시를 사용하세요.`);
      } else {
        alert(`모델 목록을 가져올 수 없습니다: ${errorMessage}`);
      }
      
      // 에러 시 빈 목록 유지 (predefined 목록 사용하지 않음)
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testAPIConnection(localConfig);
    setTestResult(result);
    setTesting(false);
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  const handleResetUsage = () => {
    if (confirm('사용량 통계를 초기화하시겠습니까?')) {
      resetAPIUsage();
      setUsage(getAPIUsage());
    }
  };

  const models = localConfig.provider === 'openai' ? OPENAI_MODELS : ANTHROPIC_MODELS;
  const currentModel = models.find(m => m.id === localConfig.model) || models[0];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">API 설정</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex gap-1">
            {[
              { key: 'connection', label: '연결 설정' },
              { key: 'models', label: '모델 선택' },
              { key: 'usage', label: '사용량' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'connection' && (
            <div className="space-y-5">
              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API 제공자</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLocalConfig(c => ({ ...c, provider: 'openai', model: 'gpt-4o-mini' }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      localConfig.provider === 'openai'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">OpenAI 호환</div>
                    <div className="text-xs text-gray-500">GPT-4o, GPT-4, GPT-3.5 등</div>
                  </button>
                  <button
                    onClick={() => setLocalConfig(c => ({ ...c, provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      localConfig.provider === 'anthropic'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">Anthropic 호환</div>
                    <div className="text-xs text-gray-500">Claude 3.5, Claude 3 등</div>
                  </button>
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API 키</label>
                <input
                  type="password"
                  value={localConfig.apiKey}
                  onChange={e => setLocalConfig(c => ({ ...c, apiKey: e.target.value }))}
                  placeholder={localConfig.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                />
                <p className="text-xs text-gray-400 mt-1.5">API 키는 브라우저 로컬에만 저장되며 외부로 전송되지 않습니다.</p>
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base URL <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <input
                  type="text"
                  value={localConfig.baseUrl}
                  onChange={e => setLocalConfig(c => ({ ...c, baseUrl: e.target.value }))}
                  placeholder={localConfig.provider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.anthropic.com/v1'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  {localConfig.provider === 'openai' 
                    ? 'OpenAI 호환 API 사용 시 입력 (예: Together, Groq, OpenRouter, Ollama 등)'
                    : 'Anthropic 호환 API 사용 시 입력'}
                </p>
              </div>

              {/* NewsAPI Key */}
              <div className="border-t border-gray-100 pt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NewsAPI 키 <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <input
                  type="password"
                  value={localConfig.newsApiKey || ''}
                  onChange={e => setLocalConfig(c => ({ ...c, newsApiKey: e.target.value }))}
                  placeholder="NewsAPI 키 입력"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  <a href="https://newsapi.org/register" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    newsapi.org
                  </a>
                  에서 무료 키를 발급받으세요. 입력 시 실시간 뉴스 검색이 가능합니다.
                </p>
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3">고급 설정</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Temperature</label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={localConfig.temperature}
                      onChange={e => setLocalConfig(c => ({ ...c, temperature: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">0: 결정적, 2: 창의적</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">최대 토큰</label>
                    <input
                      type="number"
                      min="100"
                      max="128000"
                      step="100"
                      value={localConfig.maxTokens}
                      onChange={e => setLocalConfig(c => ({ ...c, maxTokens: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">응답 최대 길이</p>
                  </div>
                </div>
              </div>

              {/* Connection Test */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">연결 테스트</h3>
                  <button
                    onClick={handleTest}
                    disabled={testing || !localConfig.apiKey}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {testing ? '테스트 중...' : '테스트 실행'}
                  </button>
                </div>
                {testResult && (
                  <div className={`p-4 rounded-xl border ${
                    testResult.success 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        testResult.success ? 'text-emerald-600' : 'text-red-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {testResult.success ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          testResult.success ? 'text-emerald-800' : 'text-red-800'
                        }`}>
                          {testResult.message}
                        </div>
                        {testResult.latency && (
                          <div className="text-xs text-gray-500 mt-1">
                            응답 시간: {testResult.latency}ms
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">사용 가능한 모델</h3>
                {localConfig.apiKey && (
                  <button
                    onClick={loadModels}
                    disabled={loadingModels}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    {loadingModels ? (
                      <>
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        로딩 중...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        새로고침
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* NVIDIA API 안내 */}
              {localConfig.provider === 'openai' && localConfig.baseUrl?.includes('nvidia.com') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <div className="font-semibold mb-1">NVIDIA NIM API 안내</div>
                  <ul className="space-y-1 text-amber-700">
                    <li>• 모델 ID는 <code className="bg-amber-100 px-1 rounded">meta/llama-3.1-8b-instruct</code> 형식입니다</li>
                    <li>• API 키는 <code className="bg-amber-100 px-1 rounded">nvapi-</code>로 시작해야 합니다</li>
                    <li>• CORS 문제로 브라우저에서 직접 호출 시 실패할 수 있습니다</li>
                    <li>• <a href="https://build.nvidia.com/explore/discover" target="_blank" rel="noopener noreferrer" className="underline font-medium">NVIDIA NIM 모델 목록</a>에서 사용 가능한 모델을 확인하세요</li>
                  </ul>
                </div>
              )}

              {!localConfig.apiKey ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">API 키를 입력하면 사용 가능한 모델을 확인할 수 있습니다.</p>
                </div>
              ) : loadingModels ? (
                <div className="text-center py-12">
                  <svg className="animate-spin h-8 w-8 mx-auto text-blue-500 mb-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-gray-500">API에서 모델 목록을 가져오는 중...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableModels.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm mb-2">사용 가능한 모델을 찾을 수 없습니다.</p>
                      <p className="text-xs">API 키와 Base URL을 확인하세요.</p>
                    </div>
                  ) : (
                    availableModels.map(model => (
                      <button
                        key={model.id}
                        onClick={() => setLocalConfig(c => ({ ...c, model: model.id }))}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          localConfig.model === model.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-semibold text-gray-800 text-sm">{model.name}</div>
                          {localConfig.model === model.id && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">선택됨</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{model.description}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>컨텍스트: {(model.contextWindow / 1000).toFixed(0)}K</span>
                          {model.pricing && (
                            <>
                              <span>입력: ${model.pricing.input}/1K</span>
                              <span>출력: ${model.pricing.output}/1K</span>
                            </>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">사용량 통계</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">총 요청</div>
                    <div className="text-2xl font-bold text-gray-800">{usage.totalRequests}</div>
                    <div className="text-xs text-gray-400">회</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">총 토큰</div>
                    <div className="text-2xl font-bold text-gray-800">{usage.totalTokens.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">tokens</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">예상 비용</div>
                    <div className="text-2xl font-bold text-gray-800">${usage.estimatedCost.toFixed(4)}</div>
                    <div className="text-xs text-gray-400">USD</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">마지막 요청</div>
                    <div className="text-sm font-medium text-gray-800">
                      {usage.lastRequest ? new Date(usage.lastRequest).toLocaleString('ko-KR') : '없음'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">통계 초기화</h3>
                    <p className="text-xs text-gray-500 mt-1">사용량 통계를 0으로 초기화합니다.</p>
                  </div>
                  <button
                    onClick={handleResetUsage}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    초기화
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">현재 모델 정보</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="font-semibold text-gray-800 mb-1">{currentModel?.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{currentModel?.description}</div>
                  <div className="text-xs text-gray-400">
                    컨텍스트: {(currentModel?.contextWindow || 0).toLocaleString()} tokens
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!localConfig.apiKey}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
