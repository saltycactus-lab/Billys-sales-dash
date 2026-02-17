'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { HubSpotDeal, HubSpotPipeline, ACTIVE_STAGES, SALES_PIPELINE_ORDER, OUTBOUND_PIPELINE_ORDER, STAGE_CHAPTERS } from '@/lib/types';
import { formatCurrency, getWeightedValue } from '@/lib/utils';
import DealCard from '@/components/DealCard';
import { RefreshCw } from 'lucide-react';


export default function PipelinePage() {
  const [deals, setDeals] = useState<HubSpotDeal[]>([]);
  const [pipelines, setPipelines] = useState<HubSpotPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<'active' | 'all'>('active');

  const stageMap: Record<string, string> = {};
  for (const pipeline of pipelines) {
    for (const stage of pipeline.stages ?? []) {
      stageMap[stage.id] = stage.label;
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsRes, pipelineRes] = await Promise.all([
        fetch('/api/deals?contacts=true'),
        fetch('/api/pipeline'),
      ]);
      if (!dealsRes.ok || !pipelineRes.ok) throw new Error('Failed to fetch from HubSpot');
      const dealsData = await dealsRes.json();
      const pipelineData = await pipelineRes.json();
      if (dealsData.error) throw new Error(dealsData.error);
      if (pipelineData.error) throw new Error(pipelineData.error);
      setDeals(dealsData.deals);
      setPipelines(pipelineData.pipelines);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const visibleStages = activeFilter === 'active'
    ? SALES_PIPELINE_ORDER.filter((s) => ACTIVE_STAGES.includes(s))
    : SALES_PIPELINE_ORDER;

  const stageDeals  = (id: string) => deals.filter((d) => d.dealstage === id);
  const stageTotal  = (id: string) => stageDeals(id).reduce((s, d) => s + (parseFloat(d.amount ?? '0') || 0), 0);
  const stageWeighted = (id: string) => stageDeals(id).reduce((s, d) => s + getWeightedValue(d), 0);

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-20">
        <div className="glass p-8 text-center" style={{ borderColor: 'rgba(224,82,82,0.2)' }}>
          <p className="text-sm font-bold mb-2" style={{ color: '#e05252' }}>Connection Failed</p>
          <p className="text-xs mb-4" style={{ color: '#7a9e87' }}>{error}</p>
          <button onClick={fetchData} className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="section-label mb-1">Full Overview</p>
          <h1 className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: '#f0f5f1' }}>
            The Journey
          </h1>
          <p className="text-sm" style={{ color: '#3d5c49' }}>All deals across every chapter</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div
            className="flex rounded-xl overflow-hidden text-[11px] font-semibold"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {(['active', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-2 capitalize transition-all"
                style={
                  activeFilter === f
                    ? { background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }
                    : { background: 'rgba(255,255,255,0.03)', color: '#3d5c49' }
                }
              >
                {f === 'active' ? 'Active' : 'All Stages'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: '#7a9e87' }} />
          </button>
        </div>
      </div>

      {lastRefresh && (
        <p className="text-[10px] mb-5" style={{ color: '#3d5c49' }}>
          Synced at {format(lastRefresh, 'h:mm a')}
        </p>
      )}

      <div className="glass-divider mb-7" />

      {loading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass p-5 animate-pulse">
              <div className="h-3 rounded w-1/5 mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {visibleStages.map((stageId) => {
            const sd = stageDeals(stageId);
            const label = stageMap[stageId] ?? stageId;
            const total = stageTotal(stageId);
            const weighted = stageWeighted(stageId);
            const meta = STAGE_CHAPTERS[stageId];
            const isLost = stageId === 'closed_lost';

            return (
              <div key={stageId}>
                {/* Stage header */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Chapter badge */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xs"
                    style={{
                      background: isLost
                        ? 'rgba(224,82,82,0.1)'
                        : 'rgba(201,168,76,0.1)',
                      border: `1px solid ${isLost ? 'rgba(224,82,82,0.2)' : 'rgba(201,168,76,0.2)'}`,
                      color: isLost ? '#e05252' : '#c9a84c',
                    }}
                  >
                    {meta?.chapter ?? '?'}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-sm font-bold" style={{ color: '#f0f5f1' }}>{label}</h2>
                    {meta && (
                      <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5c49' }}>
                        {meta.tagline}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span
                      className="px-2.5 py-1 rounded-full font-bold"
                      style={{
                        background: isLost ? 'rgba(224,82,82,0.1)' : 'rgba(255,255,255,0.06)',
                        color: isLost ? '#e05252' : '#7a9e87',
                      }}
                    >
                      {sd.length} deals
                    </span>
                    {total > 0 && (
                      <span style={{ color: '#c9a84c' }}>
                        {formatCurrency(total.toString())}
                        {weighted > 0 && weighted !== total && (
                          <span style={{ color: '#3d5c49' }}> · {formatCurrency(weighted.toString())} wtd</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Deals */}
                {sd.length === 0 ? (
                  <div
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px dashed rgba(255,255,255,0.06)',
                    }}
                  >
                    <p className="text-xs" style={{ color: '#3d5c49' }}>No deals at this chapter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    {sd.map((deal) => (
                      <DealCard key={deal.id} deal={deal} stageLabel={label} showStage={false} />
                    ))}
                  </div>
                )}

                <div className="glass-divider mt-8" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
