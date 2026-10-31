import { TimelineEvent } from '../types';

interface TimelinePanelProps {
  events: TimelineEvent[];
}

export default function TimelinePanel({ events }: TimelinePanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">타임라인</h2>
          <p className="text-xs text-gray-500">사건 시간순 정리</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-200" />

        <div className="space-y-5">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start gap-5 pl-1">
              {/* Dot */}
              <div className="relative z-10 w-9 h-9 rounded-full bg-white border-2 border-indigo-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-[11px] font-bold text-indigo-600">{events.length - index}</span>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-gray-200 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                    {event.date}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800 mb-1 text-[15px]">{event.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {event.sources.map((src, i) => (
                    <span key={i} className="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100 font-medium">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
