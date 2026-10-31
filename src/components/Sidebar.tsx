interface SidebarProps {
  activePanel: 'news' | 'factcheck' | 'bias' | 'timeline';
  setActivePanel: (panel: 'news' | 'factcheck' | 'bias' | 'timeline') => void;
  bookmarkCount: number;
}

export default function Sidebar({ activePanel, setActivePanel, bookmarkCount }: SidebarProps) {
  const menuItems = [
    {
      key: 'news' as const,
      label: '뉴스 분석',
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    },
    {
      key: 'factcheck' as const,
      label: '팩트체크',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      key: 'bias' as const,
      label: '편향성 분석',
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    },
    {
      key: 'timeline' as const,
      label: '타임라인',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
  ];

  return (
    <aside className="w-56 border-r border-gray-100 min-h-[calc(100vh-57px)] bg-gray-50/30 py-5 px-3 hidden lg:block">
      <nav className="space-y-0.5">
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActivePanel(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activePanel === item.key
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-5 border-t border-gray-200/60">
        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">도구</h4>
        <nav className="space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>북마크</span>
            {bookmarkCount > 0 && (
              <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                {bookmarkCount}
              </span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>통계</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>내보내기</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>알림 설정</span>
          </button>
        </nav>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-200/60">
        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">분석 옵션</h4>
        <div className="px-3 space-y-2.5">
          {[
            { label: '자동 요약', defaultChecked: true },
            { label: '팩트체크', defaultChecked: true },
            { label: '편향성 감지', defaultChecked: true },
            { label: '심층 분석', defaultChecked: false },
          ].map((opt, i) => (
            <label key={i} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer group">
              <input type="checkbox" defaultChecked={opt.defaultChecked} className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="group-hover:text-gray-800 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
