interface HeaderProps {
  onOpenSettings: () => void;
  onToggleChat: () => void;
  chatOpen: boolean;
}

export default function Header({ onOpenSettings, onToggleChat, chatOpen }: HeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-blue-600">Inf</span>
            <span className="text-gray-800">Search</span>
          </h1>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleChat}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chatOpen
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            💬 AI 채팅
          </button>
          <button
            onClick={onOpenSettings}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ⚙️ 설정
          </button>
        </div>
      </div>
    </header>
  );
}
