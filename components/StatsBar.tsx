import { HubSpotDeal, ACTIVE_STAGES } from '@/lib/types';
import { formatCurrency, getWeightedValue } from '@/lib/utils';

interface Props { deals: HubSpotDeal[] }

export default function StatsBar({ deals }: Props) {
  const activeDeals = deals.filter((d) => ACTIVE_STAGES.includes(d.dealstage));

  const totalPipeline = activeDeals.reduce((s, d) => s + (parseFloat(d.amount ?? '0') || 0), 0);
  const weightedPipeline = activeDeals.reduce((s, d) => s + getWeightedValue(d), 0);

  const wonDeals = deals.filter((d) =>
    ['achieved_won', 'closed_won_needs_invoicing', 'invoiced_and_in_progress'].includes(d.dealstage)
  );
  const wonValue = wonDeals.reduce((s, d) => s + (parseFloat(d.amount ?? '0') || 0), 0);

  const stalledCount = deals.filter(
    (d) => ACTIVE_STAGES.includes(d.dealstage) && (d.daysSinceContact ?? 0) > 7
  ).length;

  const stats = [
    {
      chapter: 'I',
      label: 'Active Quest Value',
      value: formatCurrency(totalPipeline.toString()),
      sub: `${activeDeals.length} active deals`,
      accent: '#c9a84c',
      glow: 'rgba(201,168,76,0.12)',
      topBar: 'rgba(201,168,76,0.7)',
    },
    {
      chapter: 'II',
      label: 'Likely Victory',
      value: formatCurrency(weightedPipeline.toString()),
      sub: 'weighted by probability',
      accent: '#9b7fe8',
      glow: 'rgba(155,127,232,0.1)',
      topBar: 'rgba(155,127,232,0.7)',
    },
    {
      chapter: 'III',
      label: 'Elixirs Won',
      value: formatCurrency(wonValue.toString()),
      sub: `${wonDeals.length} projects closed`,
      accent: '#52c47e',
      glow: 'rgba(82,196,126,0.1)',
      topBar: 'rgba(82,196,126,0.7)',
    },
    {
      chapter: 'IV',
      label: 'Require Aid',
      value: stalledCount.toString(),
      sub: stalledCount > 0 ? 'no contact 7+ days' : 'all heroes active',
      accent: stalledCount > 0 ? '#e05252' : '#52c47e',
      glow: stalledCount > 0 ? 'rgba(224,82,82,0.1)' : 'rgba(82,196,126,0.1)',
      topBar: stalledCount > 0 ? 'rgba(224,82,82,0.7)' : 'rgba(82,196,126,0.7)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {stats.map(({ chapter, label, value, sub, accent, glow, topBar }) => (
        <div key={chapter} className="glass-strong lift relative overflow-hidden p-5">
          {/* Top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[20px]"
            style={{ background: topBar }}
          />

          {/* Chapter mark */}
          <p
            className="text-[9px] font-black tracking-[0.2em] uppercase mb-3"
            style={{ color: accent, opacity: 0.5 }}
          >
            Chapter {chapter}
          </p>

          <p className="section-label mb-2">{label}</p>

          <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: accent }}>
            {value}
          </p>
          <p className="text-[11px]" style={{ color: '#3d5c49' }}>{sub}</p>

          {/* Glow orb */}
          <div
            className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: glow }}
          />
        </div>
      ))}
    </div>
  );
}
