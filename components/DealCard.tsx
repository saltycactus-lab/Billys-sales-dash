'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Calendar, ExternalLink } from 'lucide-react';
import { HubSpotDeal } from '@/lib/types';
import { formatCurrency, formatDate, getStageBadgeClass, getRiskLevel, contactName } from '@/lib/utils';

interface Props {
  deal: HubSpotDeal;
  stageLabel: string;
  showStage?: boolean;
}

export default function DealCard({ deal, stageLabel, showStage = true }: Props) {
  const [expanded, setExpanded] = useState(false);
  const risk = getRiskLevel(deal);
  const contact = deal.contacts?.[0];
  const name = contactName(deal.contacts);

  const riskStyle: Record<string, { bg: string; color: string; border: string }> = {
    high:   { bg: 'rgba(224,82,82,0.12)',   color: '#e07070', border: 'rgba(224,82,82,0.25)'  },
    medium: { bg: 'rgba(212,150,58,0.12)',  color: '#d4963a', border: 'rgba(212,150,58,0.25)' },
    low:    { bg: 'rgba(82,196,126,0.10)',  color: '#52c47e', border: 'rgba(82,196,126,0.2)'  },
  };

  return (
    <div
      className="glass lift overflow-hidden"
      style={{ borderRadius: '16px' }}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-snug truncate" style={{ color: '#f0f5f1' }}>
              {deal.dealname}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: '#7a9e87' }}>{name}</p>
          </div>
          <div className="flex-shrink-0 text-right space-y-1">
            {deal.amount && (
              <p className="text-sm font-bold" style={{ color: '#c9a84c' }}>
                {formatCurrency(deal.amount)}
              </p>
            )}
            {showStage && (
              <div>
                <span className={`stage-badge ${getStageBadgeClass(deal.dealstage)}`}>
                  {stageLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pill metrics */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {deal.daysInStage !== undefined && (
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#7a9e87',
              }}
            >
              <Clock className="w-2.5 h-2.5" />
              {deal.daysInStage}d in stage
            </span>
          )}

          {risk && (
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg"
              style={{
                background: riskStyle[risk].bg,
                border: `1px solid ${riskStyle[risk].border}`,
                color: riskStyle[risk].color,
              }}
            >
              <AlertTriangle className="w-2.5 h-2.5" />
              {deal.daysSinceContact}d silent
            </span>
          )}

          {(deal.likelihood_of_sale ?? deal.hs_deal_stage_probability) && (
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg"
              style={{
                background: 'rgba(155,127,232,0.12)',
                border: '1px solid rgba(155,127,232,0.2)',
                color: '#b8a0f0',
              }}
            >
              <TrendingUp className="w-2.5 h-2.5" />
              {deal.likelihood_of_sale
                ? `${deal.likelihood_of_sale}`
                : `${Math.round(parseFloat(deal.hs_deal_stage_probability ?? '0') * 100)}`}%
            </span>
          )}
        </div>

        {/* Dates row */}
        {(deal.closedate || deal.project_start_date || deal.property_address) && (
          <div className="flex flex-wrap gap-3 mt-2.5">
            {deal.closedate && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: '#3d5c49' }}>
                <Calendar className="w-2.5 h-2.5" />{formatDate(deal.closedate)}
              </span>
            )}
            {deal.project_start_date && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: '#3d5c49' }}>
                <Calendar className="w-2.5 h-2.5" />Start: {formatDate(deal.project_start_date)}
              </span>
            )}
            {deal.property_address && (
              <span className="flex items-center gap-1 text-[10px] max-w-[160px] truncate" style={{ color: '#3d5c49' }}>
                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />{deal.property_address}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          color: '#3d5c49',
          background: 'transparent',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a9e87')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#3d5c49')}
      >
        {expanded
          ? <><ChevronUp className="w-3 h-3" /> Collapse</>
          : <><ChevronDown className="w-3 h-3" /> Details</>}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-3 space-y-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Contact */}
          {contact && (contact.phone || contact.mobilephone || contact.email) && (
            <div>
              <p className="section-label mb-2">Contact</p>
              <div className="space-y-1.5">
                {(contact.phone ?? contact.mobilephone) && (
                  <a
                    href={`tel:${contact.phone ?? contact.mobilephone}`}
                    className="flex items-center gap-2 text-xs font-medium transition-colors"
                    style={{ color: '#c9a84c' }}
                  >
                    <Phone className="w-3 h-3" />
                    {contact.phone ?? contact.mobilephone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-xs font-medium transition-colors"
                    style={{ color: '#c9a84c' }}
                  >
                    <Mail className="w-3 h-3" />
                    {contact.email}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Scope */}
          {deal.project_scope && (
            <div>
              <p className="section-label mb-1.5">Scope</p>
              <p className="text-xs leading-relaxed" style={{ color: '#7a9e87' }}>{deal.project_scope}</p>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="section-label mb-2">Timeline</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'Created',       val: deal.createdate },
                { label: 'Close date',    val: deal.closedate },
                { label: 'Project start', val: deal.project_start_date },
                { label: 'Last contact',  val: deal.notes_last_contacted },
              ]
                .filter(({ val }) => val)
                .map(({ label, val }) => (
                  <div key={label}>
                    <p className="text-[10px]" style={{ color: '#3d5c49' }}>{label}</p>
                    <p className="text-xs font-medium" style={{ color: '#eef2ee' }}>{formatDate(val)}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* HubSpot link */}
          <a
            href={`https://app.hubspot.com/contacts/deals/${deal.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl"
          >
            <ExternalLink className="w-3 h-3" />
            Open in HubSpot
          </a>
        </div>
      )}
    </div>
  );
}
