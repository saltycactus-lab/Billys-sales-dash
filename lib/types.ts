// ─── Real HubSpot Stage IDs ────────────────────────────────────────────────
// Sales Pipeline (id: "default")
export const SALES_PIPELINE_ID = 'default';

export const SALES_STAGES = {
  LEAD_GENERATED:    'appointmentscheduled',
  DISCOVERY_SCHED:   'qualifiedtobuy',
  DISCOVERY_DONE:    '1261554444',
  DESIGN_PROGRESS:   'presentationscheduled',
  DESIGNS_COMPLETE:  '1281952334',
  QUOTE_SENT:        'decisionmakerboughtin',
  CLOSED_WON:        'closedwon',
  INVOICED:          '1299798612',
  ARCHIVE_WON:       '161986225',
  CLOSED_LOST:       'closedlost',
  NOT_NOW:           '161986226',
} as const;

// Outbound Pipeline (id: "805508477")
export const OUTBOUND_PIPELINE_ID = '805508477';

export const OUTBOUND_STAGES = {
  NEW_PROSPECT:    '1185234551',
  CONTACTED:       '1185234552',
  ENGAGED:         '1185234553',
  QUALIFIED:       '1185234554',
  PROPOSAL_SENT:   '1185234555',
  NEGOTIATION:     '1185234556',
  CLOSED_WON:      '1185234557',
  CLOSED_LOST:     '1185334658',
} as const;

// Active (open) deal stages across both pipelines
export const ACTIVE_STAGES: string[] = [
  SALES_STAGES.LEAD_GENERATED,
  SALES_STAGES.DISCOVERY_SCHED,
  SALES_STAGES.DISCOVERY_DONE,
  SALES_STAGES.DESIGN_PROGRESS,
  SALES_STAGES.DESIGNS_COMPLETE,
  SALES_STAGES.QUOTE_SENT,
  OUTBOUND_STAGES.NEW_PROSPECT,
  OUTBOUND_STAGES.CONTACTED,
  OUTBOUND_STAGES.ENGAGED,
  OUTBOUND_STAGES.QUALIFIED,
  OUTBOUND_STAGES.PROPOSAL_SENT,
  OUTBOUND_STAGES.NEGOTIATION,
];

// Won stages (for revenue stats)
export const WON_STAGES: string[] = [
  SALES_STAGES.CLOSED_WON,
  SALES_STAGES.INVOICED,
  SALES_STAGES.ARCHIVE_WON,
  OUTBOUND_STAGES.CLOSED_WON,
];

// Ordered list for the Sales Pipeline board
export const SALES_PIPELINE_ORDER: string[] = [
  SALES_STAGES.LEAD_GENERATED,
  SALES_STAGES.DISCOVERY_SCHED,
  SALES_STAGES.DISCOVERY_DONE,
  SALES_STAGES.DESIGN_PROGRESS,
  SALES_STAGES.DESIGNS_COMPLETE,
  SALES_STAGES.QUOTE_SENT,
  SALES_STAGES.CLOSED_WON,
  SALES_STAGES.INVOICED,
  SALES_STAGES.ARCHIVE_WON,
  SALES_STAGES.CLOSED_LOST,
  SALES_STAGES.NOT_NOW,
];

// Ordered list for the Outbound Pipeline board
export const OUTBOUND_PIPELINE_ORDER: string[] = [
  OUTBOUND_STAGES.NEW_PROSPECT,
  OUTBOUND_STAGES.CONTACTED,
  OUTBOUND_STAGES.ENGAGED,
  OUTBOUND_STAGES.QUALIFIED,
  OUTBOUND_STAGES.PROPOSAL_SENT,
  OUTBOUND_STAGES.NEGOTIATION,
  OUTBOUND_STAGES.CLOSED_WON,
  OUTBOUND_STAGES.CLOSED_LOST,
];

// Stage badge CSS class map
export const STAGE_BADGE_CLASS: Record<string, string> = {
  [SALES_STAGES.LEAD_GENERATED]:   'stage-lead',
  [SALES_STAGES.DISCOVERY_SCHED]:  'stage-discovery-scheduled',
  [SALES_STAGES.DISCOVERY_DONE]:   'stage-discovery-complete',
  [SALES_STAGES.DESIGN_PROGRESS]:  'stage-design-in-progress',
  [SALES_STAGES.DESIGNS_COMPLETE]: 'stage-designs-complete',
  [SALES_STAGES.QUOTE_SENT]:       'stage-quote-sent',
  [SALES_STAGES.CLOSED_WON]:       'stage-won',
  [SALES_STAGES.INVOICED]:         'stage-invoiced',
  [SALES_STAGES.ARCHIVE_WON]:      'stage-achieved',
  [SALES_STAGES.CLOSED_LOST]:      'stage-lost',
  [SALES_STAGES.NOT_NOW]:          'stage-lost',
  [OUTBOUND_STAGES.NEW_PROSPECT]:  'stage-lead',
  [OUTBOUND_STAGES.CONTACTED]:     'stage-discovery-scheduled',
  [OUTBOUND_STAGES.ENGAGED]:       'stage-discovery-complete',
  [OUTBOUND_STAGES.QUALIFIED]:     'stage-design-in-progress',
  [OUTBOUND_STAGES.PROPOSAL_SENT]: 'stage-quote-sent',
  [OUTBOUND_STAGES.NEGOTIATION]:   'stage-designs-complete',
  [OUTBOUND_STAGES.CLOSED_WON]:    'stage-won',
  [OUTBOUND_STAGES.CLOSED_LOST]:   'stage-lost',
};

// Hero's Journey chapter names per stage
export const STAGE_CHAPTERS: Record<string, { chapter: string; tagline: string }> = {
  [SALES_STAGES.LEAD_GENERATED]:   { chapter: 'I',    tagline: 'The Call to Adventure' },
  [SALES_STAGES.DISCOVERY_SCHED]:  { chapter: 'II',   tagline: 'Crossing the Threshold' },
  [SALES_STAGES.DISCOVERY_DONE]:   { chapter: 'III',  tagline: 'Meeting the Mentor' },
  [SALES_STAGES.DESIGN_PROGRESS]:  { chapter: 'IV',   tagline: 'Road of Trials' },
  [SALES_STAGES.DESIGNS_COMPLETE]: { chapter: 'V',    tagline: 'The Ordeal' },
  [SALES_STAGES.QUOTE_SENT]:       { chapter: 'VI',   tagline: 'The Supreme Trial' },
  [SALES_STAGES.CLOSED_WON]:       { chapter: 'VII',  tagline: 'The Reward' },
  [SALES_STAGES.INVOICED]:         { chapter: 'VIII', tagline: 'The Road Back' },
  [SALES_STAGES.ARCHIVE_WON]:      { chapter: 'IX',   tagline: 'Return with the Elixir' },
  [SALES_STAGES.CLOSED_LOST]:      { chapter: '—',    tagline: 'The Abyss' },
  [SALES_STAGES.NOT_NOW]:          { chapter: '—',    tagline: 'Dormant' },
};

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface HubSpotContact {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  mobilephone?: string;
}

export interface HubSpotDeal {
  id: string;
  dealname: string;
  dealstage: string;
  pipeline: string;
  amount?: string;
  closedate?: string;
  createdate: string;
  hs_lastmodifieddate?: string;
  hs_deal_stage_probability?: string;
  notes_last_contacted?: string;
  num_contacted_notes?: string;
  project_start_date?: string;
  likelihood_of_sale?: string;
  property_address?: string;
  project_scope?: string;
  daysInStage?: number;
  daysSinceContact?: number;
  contacts?: HubSpotContact[];
}

export interface HubSpotPipelineStage {
  id: string;
  label: string;
  displayOrder: number;
  metadata: { probability?: string; isClosed?: string };
}

export interface HubSpotPipeline {
  id: string;
  label: string;
  stages: HubSpotPipelineStage[];
}

export interface HubSpotMeeting {
  id: string;
  hs_meeting_title?: string;
  hs_meeting_start_time?: string;
  hs_meeting_end_time?: string;
  hs_meeting_outcome?: string;
  hs_internal_meeting_notes?: string;
  dealId?: string;
  deal?: HubSpotDeal;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  calendarName: string;
  calendarColor: string;
  location?: string;
  description?: string;
  htmlLink?: string;
}
