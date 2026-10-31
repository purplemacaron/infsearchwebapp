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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">⚙️ 설정</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">✕</button>
        </div>

        <div className="space-y-5">
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API 제공자</label>
            <select
              value={localConfig.provider}
              onChange={e => setLocalConfig(c => ({ ...c, provider: e.target.value as any }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="custom">커스텀 (호환 API)</option>
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API 키</label>
            <input
              type="password"
              value={localConfig.apiKey}
              onChange={e => setLocalConfig(c => ({ ...c, apiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">API 키는 로컬에만 저장됩니다.</p>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base URL (선택)</label>
            <input
              type="text"
              value={localConfig.baseUrl}
              onChange={e => setLocalConfig(c => ({ ...c, baseUrl: e.target.value }))}
              placeholder="https://api.openai.com/v1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">커스텀 API 엔드포인트를 사용할 경우 입력하세요.</p>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">모델</label>
            <input
              type="text"
              value={localConfig.model}
              onChange={e => setLocalConfig(c => ({ ...c, model: e.target.value }))}
              placeholder={localConfig.provider === 'anthropic' ? 'claude-3-sonnet-20240229' : 'gpt-4'}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-1">💡 지원 API</h4>
            <ul className="text-xs text-blue-700 space-y-0.5">
              <li>• OpenAI: GPT-4, GPT-4o, GPT-3.5-turbo</li>
              <li>• Anthropic: Claude 3.5 Sonnet, Claude 3 Opus</li>
              <li>• OpenAI 호환: Together, Groq, OpenRouter 등</li>
              <li>• 로컬 모델: Ollama, LM Studio 등 (Base URL 설정)</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
