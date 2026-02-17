'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  weekStart: Date;
  weekEnd: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function WeekNav({ weekStart, weekEnd, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        <ChevronLeft className="w-3.5 h-3.5" style={{ color: '#7a9e87' }} />
      </button>

      <div
        className="px-4 py-1.5 rounded-xl text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <p className="text-xs font-semibold" style={{ color: '#f0f5f1' }}>
          {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}
      >
        <ChevronRight className="w-3.5 h-3.5" style={{ color: '#7a9e87' }} />
      </button>

      <button
        onClick={onToday}
        className="btn-gold px-3 py-1.5 rounded-xl text-xs font-semibold"
      >
        Today
      </button>
    </div>
  );
}
