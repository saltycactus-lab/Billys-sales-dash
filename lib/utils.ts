import { HubSpotDeal, STAGE_BADGE_CLASS } from './types';

export function formatCurrency(value: string | undefined | null): string {
  if (!value) return '—';
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getStageBadgeClass(stage: string): string {
  return STAGE_BADGE_CLASS[stage] ?? 'stage-lead';
}

export function getStageLabel(stageId: string, stages: { id: string; label: string }[]): string {
  return stages.find((s) => s.id === stageId)?.label ?? stageId;
}

export function getRiskLevel(deal: HubSpotDeal): 'high' | 'medium' | 'low' | null {
  const days = deal.daysSinceContact;
  if (days === undefined || days === null) return null;
  if (days > 14) return 'high';
  if (days > 7) return 'medium';
  return 'low';
}

export function getWeightedValue(deal: HubSpotDeal): number {
  const amount = parseFloat(deal.amount ?? '0') || 0;
  // HubSpot stores probability as 0–1 (e.g. 0.4 = 40%)
  const prob = parseFloat(deal.hs_deal_stage_probability ?? '0') || 0;
  return amount * prob;
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon ...
  const diffToMon = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setDate(d.getDate() + diffToMon);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function contactName(contacts: HubSpotDeal['contacts']): string {
  if (!contacts?.length) return 'Unknown';
  const c = contacts[0];
  return [c.firstname, c.lastname].filter(Boolean).join(' ') || c.email || 'Unknown';
}
