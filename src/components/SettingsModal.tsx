import { useState } from 'react';
import { APIConfig } from '../types';

interface SettingsModalProps {
  config: APIConfig;
  onSave: (config: APIConfig) => void;
  onClose: () => void;
}

export default function SettingsModal({ config, onSave, onClose }: SettingsModalProps) {
  const [localConfig, setLocalConfig] = useState<APIConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">설정</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">API 제공자</label>
            <select
              value={localConfig.provider}
              onChange={e => setLocalConfig(c => ({ ...c, provider: e.target.value as any }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="custom">커스텀 (호환 API)</option>
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">API 키</label>
            <input
              type="password"
              value={localConfig.apiKey}
              onChange={e => setLocalConfig(c => ({ ...c, apiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-400 mt-1.5">API 키는 브라우저 로컬에만 저장됩니다.</p>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Base URL <span className="text-gray-400 font-normal">(선택)</span></label>
            <input
              type="text"
              value={localConfig.baseUrl}
              onChange={e => setLocalConfig(c => ({ ...c, baseUrl: e.target.value }))}
              placeholder="https://api.openai.com/v1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-400 mt-1.5">커스텀 API 엔드포인트를 사용할 경우 입력하세요.</p>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">모델</label>
            <input
              type="text"
              value={localConfig.model}
              onChange={e => setLocalConfig(c => ({ ...c, model: e.target.value }))}
              placeholder={localConfig.provider === 'anthropic' ? 'claude-3-sonnet-20240229' : 'gpt-4'}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              지원 API
            </h4>
            <ul className="text-xs text-blue-700/80 space-y-1">
              <li>OpenAI: GPT-4, GPT-4o, GPT-3.5-turbo</li>
              <li>Anthropic: Claude 3.5 Sonnet, Claude 3 Opus</li>
              <li>OpenAI 호환: Together, Groq, OpenRouter 등</li>
              <li>로컬 모델: Ollama, LM Studio 등 (Base URL 설정)</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
