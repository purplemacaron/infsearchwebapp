import { useState } from 'react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string, type: 'chat' | 'research' | 'factcheck') => void;
  onClose: () => void;
  currentQuery: string;
}

export default function ChatPanel({ messages, onSend, onClose, currentQuery }: ChatPanelProps) {
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
    { label: '📊 심층 분석 요청', prompt: `"${currentQuery}"에 대해 더 심층적으로 분석해주세요. 각 측면을 세부적으로 다뤄주세요.`, mode: 'research' as const },
    { label: '🔍 팩트체크', prompt: `"${currentQuery}" 관련 주요 주장들을 팩트체크해주세요.`, mode: 'factcheck' as const },
    { label: '📝 요약 정리', prompt: `"${currentQuery}"에 대해 한눈에 볼 수 있게 요약 정리해주세요.`, mode: 'chat' as const },
    { label: '⚖️ 비교 분석', prompt: `"${currentQuery}"에 대한 각 언론사의 보도 태도를 비교 분석해주세요.`, mode: 'research' as const },
    { label: '🔮 전망 예측', prompt: `"${currentQuery}"의 향후 전망을 예측해주세요.`, mode: 'chat' as const },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🤖</span>
          <h3 className="font-semibold text-gray-800">AI 어시스턴트</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
          ✕
        </button>
      </div>

      {/* Mode selector */}
      <div className="px-4 py-2 border-b border-gray-50 flex gap-1">
        {[
          { key: 'chat', label: '💬 질문' },
          { key: 'research', label: '🔬 리서치' },
          { key: 'factcheck', label: '✅ 팩트체크' },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === m.key
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 mb-4">AI에게 질문하거나 리서치를 요청하세요</p>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => onSend(action.prompt, action.mode)}
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 border border-gray-100'
              }`}
            >
              {msg.type === 'research' && msg.role === 'assistant' && (
                <span className="text-xs text-blue-500 font-medium block mb-1">🔬 리서치 결과</span>
              )}
              {msg.type === 'factcheck' && msg.role === 'assistant' && (
                <span className="text-xs text-green-600 font-medium block mb-1">✅ 팩트체크 결과</span>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
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
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}
