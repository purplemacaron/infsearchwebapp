import { TimelineEvent } from '../types';

interface TimelinePanelProps {
  events: TimelineEvent[];
}

export default function TimelinePanel({ events }: TimelinePanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📅</span>
        <h2 className="text-lg font-semibold text-gray-800">타임라인</h2>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
          사건 시간순 정리
        </span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start gap-4 pl-2">
              {/* Dot */}
              <div className="relative z-10 w-9 h-9 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-600">{events.length - index}</span>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                    {event.date}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {event.sources.map((src, i) => (
                    <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">
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
