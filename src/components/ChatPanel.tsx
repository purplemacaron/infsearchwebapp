import { useState } from 'react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string, type: 'chat' | 'research' | 'factcheck') => void;
  onClose: () => void;
  currentQuery: string;
  hasApiKey: boolean;
}

export default function ChatPanel({ messages, onSend, onClose, currentQuery, hasApiKey }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'research' | 'factcheck'>('chat');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim(), mode);
      setInput('');
    }
  };

  const quickActions = [
    { label: '심층 분석 요청', prompt: `"${currentQuery}"에 대해 더 심층적으로 분석해주세요. 각 측면을 세부적으로 다뤄주세요.`, mode: 'research' as const, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: '팩트체크', prompt: `"${currentQuery}" 관련 주요 주장들을 팩트체크해주세요.`, mode: 'factcheck' as const, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: '요약 정리', prompt: `"${currentQuery}"에 대해 한눈에 볼 수 있게 요약 정리해주세요.`, mode: 'chat' as const, icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { label: '비교 분석', prompt: `"${currentQuery}"에 대한 각 언론사의 보도 태도를 비교 분석해주세요.`, mode: 'research' as const, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: '전망 분석', prompt: `"${currentQuery}"의 향후 전망을 분석해주세요.`, mode: 'chat' as const, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  ];

  const getModeLabel = (type?: string) => {
    switch (type) {
      case 'research': return '리서치 결과';
      case 'factcheck': return '팩트체크 결과';
      default: return null;
    }
  };

  const getModeColor = (type?: string) => {
    switch (type) {
      case 'research': return 'text-blue-500';
      case 'factcheck': return 'text-emerald-600';
      default: return null;
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">AI 어시스턴트</h3>
            <p className="text-[11px] text-gray-400">질문, 리서치, 팩트체크</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mode selector */}
      <div className="px-5 py-2.5 border-b border-gray-50 flex gap-1">
        {[
          { key: 'chat', label: '질문' },
          { key: 'research', label: '리서치' },
          { key: 'factcheck', label: '팩트체크' },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === m.key
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="py-8">
            {!hasApiKey ? (
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">API 키가 필요합니다</p>
                <p className="text-xs text-gray-400 mb-4">설정에서 API 키를 입력해주세요</p>
                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 text-left">
                  <p className="font-medium mb-1">지원 API:</p>
                  <p>• OpenAI (GPT-4o, GPT-4, GPT-3.5)</p>
                  <p>• Anthropic (Claude 3.5, Claude 3)</p>
                  <p>• OpenAI 호환 (Together, Groq 등)</p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4 text-center">AI에게 질문하거나 리서치를 요청하세요</p>
                <div className="space-y-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => onSend(action.prompt, action.mode)}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                      </svg>
                      <span className="font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-50 text-gray-700 border border-gray-100 rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' && msg.type && (
                <span className={`text-[11px] font-semibold block mb-1.5 ${getModeColor(msg.type)}`}>
                  {getModeLabel(msg.type)}
                </span>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              mode === 'chat' ? '질문을 입력하세요...' :
              mode === 'research' ? '리서치 주제를 입력하세요...' :
              '팩트체크할 내용을 입력하세요...'
            }
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
