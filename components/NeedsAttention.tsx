import { HubSpotDeal, ACTIVE_STAGES } from '@/lib/types';
import DealCard from './DealCard';
import { Flame } from 'lucide-react';

interface Props {
  deals: HubSpotDeal[];
  stageMap: Record<string, string>;
}

export default function NeedsAttention({ deals, stageMap }: Props) {
  const stalled = deals
    .filter((d) => ACTIVE_STAGES.includes(d.dealstage) && (d.daysSinceContact ?? 0) > 7)
    .sort((a, b) => (b.daysSinceContact ?? 0) - (a.daysSinceContact ?? 0));

  if (stalled.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(224,82,82,0.12)',
            border: '1px solid rgba(224,82,82,0.2)',
          }}
        >
          <Flame className="w-4 h-4" style={{ color: '#e05252' }} />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold" style={{ color: '#f0f5f1' }}>Lost Along the Way</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5c49' }}>
            Heroes awaiting guidance
          </p>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(224,82,82,0.12)',
            border: '1px solid rgba(224,82,82,0.2)',
            color: '#e05252',
          }}
        >
          {stalled.length}
        </span>
      </div>

      <div className="space-y-3">
        {stalled.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            stageLabel={stageMap[deal.dealstage] ?? deal.dealstage}
          />
        ))}
      </div>
    </div>
  );
}
