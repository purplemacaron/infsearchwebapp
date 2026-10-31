interface HeaderProps {
  onOpenSettings: () => void;
  onToggleChat: () => void;
  chatOpen: boolean;
}

export default function Header({ onOpenSettings, onToggleChat, chatOpen }: HeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold tracking-tight">
            <span className="text-blue-600">Inf</span>
            <span className="text-gray-800">Search</span>
          </h1>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleChat}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              chatOpen
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              AI 채팅
            </span>
          </button>
          <button
            onClick={onOpenSettings}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              설정
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
