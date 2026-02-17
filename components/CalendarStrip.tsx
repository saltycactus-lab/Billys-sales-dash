'use client';

import { CalendarEvent } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { MapPin, ExternalLink, Calendar } from 'lucide-react';

interface Props {
  events: CalendarEvent[];
  needsAuth: boolean;
  loading: boolean;
}

export default function CalendarStrip({ events, needsAuth, loading }: Props) {
  if (loading) {
    return (
      <div className="glass p-4 animate-pulse">
        <div className="h-3 rounded w-1/4 mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div
        className="rounded-2xl p-5 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4" style={{ color: '#9b7fe8' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#f0f5f1' }}>Google Calendar not connected</p>
            <p className="text-[10px]" style={{ color: '#3d5c49' }}>Connect to see your events alongside deals</p>
          </div>
        </div>
        <a
          href="/api/auth/google"
          className="btn-gold px-3 py-1.5 rounded-xl text-[11px] font-semibold"
          style={{
            background: 'rgba(155,127,232,0.15)',
            border: '1px solid rgba(155,127,232,0.3)',
            color: '#9b7fe8',
          }}
        >
          Connect Google
        </a>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className="rounded-2xl p-4 text-center"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.07)',
        }}
      >
        <p className="text-xs" style={{ color: '#3d5c49' }}>No calendar events this week</p>
      </div>
    );
  }

  // Group by day
  const byDay: Record<string, CalendarEvent[]> = {};
  for (const ev of events) {
    const day = new Date(ev.start).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(ev);
  }

  return (
    <div className="space-y-3">
      {Object.entries(byDay).map(([day, dayEvents]) => (
        <div key={day}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#3d5c49' }}>
            {day}
          </p>
          <div className="space-y-2">
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderLeft: `3px solid ${ev.calendarColor}`,
                }}
              >
                {/* Time */}
                <div className="flex-shrink-0 w-14 text-right">
                  <p className="text-[10px] font-semibold" style={{ color: ev.calendarColor }}>
                    {formatTime(ev.start)}
                  </p>
                  {ev.end && (
                    <p className="text-[9px]" style={{ color: '#3d5c49' }}>
                      {formatTime(ev.end)}
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#f0f5f1' }}>
                    {ev.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wide"
                      style={{ color: ev.calendarColor, opacity: 0.8 }}
                    >
                      {ev.calendarName}
                    </span>
                    {ev.location && (
                      <span className="flex items-center gap-0.5 text-[9px] truncate" style={{ color: '#3d5c49' }}>
                        <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                        {ev.location}
                      </span>
                    )}
                  </div>
                </div>

                {ev.htmlLink && (
                  <a
                    href={ev.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" style={{ color: '#3d5c49' }} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
