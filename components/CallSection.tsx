import { HubSpotDeal } from '@/lib/types';
import DealCard from './DealCard';

interface Props {
  title: string;
  subtitle: string;
  deals: HubSpotDeal[];
  stageMap: Record<string, string>;
  accentColor: string;
  emptyMessage: string;
  icon: React.ReactNode;
}

export default function CallSection({ title, subtitle, deals, stageMap, accentColor, emptyMessage, icon }: Props) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold" style={{ color: '#f0f5f1' }}>{title}</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5c49' }}>
            {subtitle}
          </p>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: accentColor,
          }}
        >
          {deals.length}
        </span>
      </div>

      {deals.length === 0 ? (
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-xs" style={{ color: '#3d5c49' }}>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              stageLabel={stageMap[deal.dealstage] ?? deal.dealstage}
              showStage={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
