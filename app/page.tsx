'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { HubSpotDeal, HubSpotPipeline, SALES_STAGES, CalendarEvent } from '@/lib/types';
import { getWeekRange } from '@/lib/utils';
import StatsBar from '@/components/StatsBar';
import WeekNav from '@/components/WeekNav';
import CallSection from '@/components/CallSection';
import NeedsAttention from '@/components/NeedsAttention';
import DealCard from '@/components/DealCard';
import CalendarStrip from '@/components/CalendarStrip';
import { RefreshCw, Swords, Trophy, Sparkles, CalendarDays } from 'lucide-react';

export default function WeeklyDashboard() {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [deals, setDeals] = useState<HubSpotDeal[]>([]);
  const [pipelines, setPipelines] = useState<HubSpotPipeline[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarNeedsAuth, setCalendarNeedsAuth] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const { start: weekStart, end: weekEnd } = getWeekRange(referenceDate);

  const stageMap: Record<string, string> = {};
  for (const pipeline of pipelines) {
    for (const stage of pipeline.stages ?? []) {
      stageMap[stage.id] = stage.label;
    }
  }

  const fetchCalendar = useCallback(async (start: Date, end: Date) => {
    setCalendarLoading(true);
    try {
      const res = await fetch(`/api/calendar?start=${start.getTime()}&end=${end.getTime()}`);
      const data = await res.json();
      if (data.needsAuth) {
        setCalendarNeedsAuth(true);
      } else {
        setCalendarEvents(data.events ?? []);
        setCalendarNeedsAuth(false);
      }
    } catch {
      setCalendarNeedsAuth(true);
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsRes, pipelineRes] = await Promise.all([
        fetch('/api/deals?contacts=true'),
        fetch('/api/pipeline'),
      ]);
      if (!dealsRes.ok || !pipelineRes.ok) throw new Error('Failed to fetch data from HubSpot');
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const { start, end } = getWeekRange(referenceDate);
    fetchCalendar(start, end);
  }, [referenceDate, fetchCalendar]);

  function dealsInWeek(stageIds: string[]): HubSpotDeal[] {
    return deals.filter((d) => {
      if (!stageIds.includes(d.dealstage)) return false;
      if (!d.closedate) return true;
      return isWithinInterval(new Date(d.closedate), { start: weekStart, end: weekEnd });
    });
  }

  const discoveryDeals   = dealsInWeek([SALES_STAGES.DISCOVERY_SCHED]);
  const closeDeals       = dealsInWeek([SALES_STAGES.QUOTE_SENT]);
  const designReadyDeals = deals.filter((d) => d.dealstage === SALES_STAGES.DESIGNS_COMPLETE);

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-20">
        <div
          className="glass p-8 text-center"
          style={{ borderColor: 'rgba(224,82,82,0.2)' }}
        >
          <p className="text-sm font-bold mb-2" style={{ color: '#e05252' }}>Connection Failed</p>
          <p className="text-xs mb-4" style={{ color: '#7a9e87' }}>{error}</p>
          <p className="text-[11px] mb-5" style={{ color: '#3d5c49' }}>
            Check that <code className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>.env.local</code> contains a valid{' '}
            <code className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>HUBSPOT_ACCESS_TOKEN</code>.
          </p>
          <button
            onClick={fetchData}
            className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="section-label mb-1">The Hero&apos;s Path</p>
          <h1 className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: '#f0f5f1' }}>
            Today&apos;s Quest
          </h1>
          <p className="text-sm" style={{ color: '#3d5c49' }}>
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <WeekNav
            weekStart={weekStart}
            weekEnd={weekEnd}
            onPrev={() => { const d = new Date(referenceDate); d.setDate(d.getDate() - 7); setReferenceDate(d); }}
            onNext={() => { const d = new Date(referenceDate); d.setDate(d.getDate() + 7); setReferenceDate(d); }}
            onToday={() => setReferenceDate(new Date())}
          />
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

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass p-5 animate-pulse">
              <div className="h-3 rounded w-1/4 mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-6 rounded w-1/2 mb-2" style={{ background: 'rgba(255,255,255,0.04)' }} />
              <div className="h-3 rounded w-1/3"      style={{ background: 'rgba(255,255,255,0.03)' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <StatsBar deals={deals} />

          {lastRefresh && (
            <p className="text-[10px] mb-5" style={{ color: '#3d5c49' }}>
              Synced at {format(lastRefresh, 'h:mm a')}
            </p>
          )}

          <div className="glass-divider mb-7" />

          {/* Calendar strip */}
          <div className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(155,127,232,0.12)', border: '1px solid rgba(155,127,232,0.2)' }}
              >
                <CalendarDays className="w-4 h-4" style={{ color: '#9b7fe8' }} />
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: '#f0f5f1' }}>Calendar</h2>
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5c49' }}>
                  All events this week
                </p>
              </div>
            </div>
            <CalendarStrip
              events={calendarEvents}
              needsAuth={calendarNeedsAuth}
              loading={calendarLoading}
            />
          </div>

          <div className="glass-divider mb-7" />

          {/* Main content grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">

            {/* Left: Calls this week */}
            <div className="space-y-7">
              <CallSection
                title="Threshold Crossings"
                subtitle="Discovery calls this week"
                deals={discoveryDeals}
                stageMap={stageMap}
                accentColor="#d4963a"
                emptyMessage="No discovery calls this week — the threshold awaits"
                icon={<Swords className="w-4 h-4" style={{ color: '#d4963a' }} />}
              />
              <CallSection
                title="The Final Trial"
                subtitle="Close calls this week"
                deals={closeDeals}
                stageMap={stageMap}
                accentColor="#52c47e"
                emptyMessage="No close calls scheduled — sharpen your sword"
                icon={<Trophy className="w-4 h-4" style={{ color: '#52c47e' }} />}
              />
            </div>

            {/* Right: Action items */}
            <div className="space-y-7">
              {/* Design ready — book close */}
              {designReadyDeals.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(155,127,232,0.12)',
                        border: '1px solid rgba(155,127,232,0.2)',
                      }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: '#9b7fe8' }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-bold" style={{ color: '#f0f5f1' }}>The Reward Awaits</h2>
                      <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5c49' }}>
                        Design complete — book the close call
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(155,127,232,0.12)',
                        border: '1px solid rgba(155,127,232,0.2)',
                        color: '#9b7fe8',
                      }}
                    >
                      {designReadyDeals.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {designReadyDeals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        stageLabel={stageMap[deal.dealstage] ?? deal.dealstage}
                        showStage={false}
                      />
                    ))}
                  </div>
                </div>
              )}

              <NeedsAttention deals={deals} stageMap={stageMap} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
