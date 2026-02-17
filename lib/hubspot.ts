import {
  HubSpotDeal,
  HubSpotContact,
  HubSpotPipeline,
  HubSpotMeeting,
} from './types';

const BASE_URL = 'https://api.hubapi.com';

function getToken(): string {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error('HUBSPOT_ACCESS_TOKEN is not set in .env.local');
  return token;
}

async function hubspotFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 60 }, // Cache for 60s
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`HubSpot API error ${res.status}: ${error}`);
  }

  return res.json();
}

// ─── Deals ────────────────────────────────────────────────────────────────────

const DEAL_PROPERTIES = [
  'dealname',
  'dealstage',
  'pipeline',
  'amount',
  'closedate',
  'createdate',
  'hs_lastmodifieddate',
  'hs_deal_stage_probability',
  'notes_last_contacted',
  'num_contacted_notes',
  'hs_date_entered_dealstage',
  // Custom properties (will silently fail if not present)
  'project_start_date',
  'likelihood_of_sale',
  'property_address',
  'project_scope',
].join(',');

export async function fetchAllDeals(): Promise<HubSpotDeal[]> {
  const deals: HubSpotDeal[] = [];
  let after: string | undefined;

  do {
    const params = new URLSearchParams({
      limit: '100',
      properties: DEAL_PROPERTIES,
      ...(after ? { after } : {}),
    });

    const data = await hubspotFetch(`/crm/v3/objects/deals?${params}`);

    for (const result of data.results) {
      deals.push({ id: result.id, ...result.properties });
    }

    after = data.paging?.next?.after;
  } while (after);

  return deals;
}

export async function fetchDealById(id: string): Promise<HubSpotDeal> {
  const params = new URLSearchParams({ properties: DEAL_PROPERTIES });
  const data = await hubspotFetch(`/crm/v3/objects/deals/${id}?${params}`);
  return { id: data.id, ...data.properties };
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

export async function fetchContactsForDeal(dealId: string): Promise<HubSpotContact[]> {
  try {
    // Get associated contact IDs
    const assoc = await hubspotFetch(
      `/crm/v3/objects/deals/${dealId}/associations/contacts`
    );

    if (!assoc.results?.length) return [];

    const ids = assoc.results.map((r: { id: string }) => r.id);

    // Batch fetch contact details
    const params = new URLSearchParams({
      properties: 'firstname,lastname,email,phone,mobilephone',
    });

    const contacts: HubSpotContact[] = await Promise.all(
      ids.slice(0, 5).map(async (id: string) => {
        const data = await hubspotFetch(`/crm/v3/objects/contacts/${id}?${params}`);
        return { id: data.id, ...data.properties };
      })
    );

    return contacts;
  } catch {
    return [];
  }
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export async function fetchPipelines(): Promise<HubSpotPipeline[]> {
  const data = await hubspotFetch('/crm/v3/pipelines/deals');
  return data.results;
}

// ─── Meetings ─────────────────────────────────────────────────────────────────

const MEETING_PROPERTIES = [
  'hs_meeting_title',
  'hs_meeting_start_time',
  'hs_meeting_end_time',
  'hs_meeting_outcome',
  'hs_internal_meeting_notes',
].join(',');

export async function fetchMeetingsInRange(
  startMs: number,
  endMs: number
): Promise<HubSpotMeeting[]> {
  const meetings: HubSpotMeeting[] = [];
  let after: string | undefined;

  do {
    const params = new URLSearchParams({
      limit: '100',
      properties: MEETING_PROPERTIES,
      ...(after ? { after } : {}),
    });

    const data = await hubspotFetch(`/crm/v3/objects/meetings?${params}`);

    for (const result of data.results) {
      const startTime = result.properties.hs_meeting_start_time;
      if (!startTime) continue;
      const ts = new Date(startTime).getTime();
      if (ts >= startMs && ts <= endMs) {
        meetings.push({ id: result.id, ...result.properties });
      }
    }

    after = data.paging?.next?.after;
  } while (after);

  return meetings;
}

export async function fetchDealForMeeting(meetingId: string): Promise<string | null> {
  try {
    const assoc = await hubspotFetch(
      `/crm/v3/objects/meetings/${meetingId}/associations/deals`
    );
    return assoc.results?.[0]?.id ?? null;
  } catch {
    return null;
  }
}
