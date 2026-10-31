interface SidebarProps {
  activePanel: 'news' | 'factcheck' | 'bias' | 'timeline';
  setActivePanel: (panel: 'news' | 'factcheck' | 'bias' | 'timeline') => void;
  bookmarkCount: number;
}

export default function Sidebar({ activePanel, setActivePanel, bookmarkCount }: SidebarProps) {
  const menuItems = [
    { key: 'news' as const, icon: '📰', label: '뉴스 분석' },
    { key: 'factcheck' as const, icon: '✅', label: '팩트체크' },
    { key: 'bias' as const, icon: '⚖️', label: '편향성 분석' },
    { key: 'timeline' as const, icon: '📅', label: '타임라인' },
  ];

  return (
    <aside className="w-56 border-r border-gray-100 min-h-[calc(100vh-57px)] bg-gray-50/50 py-4 px-3 hidden lg:block">
      <nav className="space-y-1">
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActivePanel(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activePanel === item.key
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">도구</h4>
        <nav className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <span>⭐</span>
            북마크
            {bookmarkCount > 0 && (
              <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                {bookmarkCount}
              </span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <span>📊</span>
            통계
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <span>📤</span>
            내보내기
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <span>🔔</span>
            알림 설정
          </button>
        </nav>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">분석 옵션</h4>
        <div className="px-3 space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            <span>자동 요약</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            <span>팩트체크</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            <span>편향성 감지</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="rounded text-blue-600" />
            <span>심층 분석</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
