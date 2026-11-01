import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  status?: string;
}

export default function SearchBar({ onSearch, isLoading, status }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm group-focus-within:blur-md transition-all opacity-0 group-focus-within:opacity-100" />
        <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:border-blue-300 focus-within:shadow-md transition-all">
          <svg className="w-5 h-5 text-gray-400 ml-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="분석할 주제나 키워드를 입력하세요..."
            className="flex-1 px-4 py-4.5 text-base bg-transparent focus:outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mr-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                분석 중
              </span>
            ) : (
              '분석 시작'
            )}
          </button>
        </div>
      </div>
      
      {/* 검색 상태 표시 */}
      {isLoading && status && (
        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>{status}</span>
        </div>
      )}
    </form>
  );
}
