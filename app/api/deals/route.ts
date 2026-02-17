import { NextResponse } from 'next/server';
import { fetchAllDeals, fetchContactsForDeal } from '@/lib/hubspot';
import { HubSpotDeal, ACTIVE_STAGES } from '@/lib/types';
import { differenceInDays } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const withContacts = searchParams.get('contacts') === 'true';

    let deals = await fetchAllDeals();

    if (activeOnly) {
      deals = deals.filter((d) => ACTIVE_STAGES.includes(d.dealstage));
    }

    // Enrich deals with calculated fields
    const enriched: HubSpotDeal[] = deals.map((deal) => {
      const now = new Date();

      // Days in current stage
      const stageEnteredDate = (deal as unknown as Record<string, string>)['hs_date_entered_dealstage'];
      const daysInStage = stageEnteredDate
        ? differenceInDays(now, new Date(stageEnteredDate))
        : differenceInDays(now, new Date(deal.createdate));

      // Days since last contact
      const daysSinceContact = deal.notes_last_contacted
        ? differenceInDays(now, new Date(deal.notes_last_contacted))
        : null;

      return {
        ...deal,
        daysInStage,
        daysSinceContact: daysSinceContact ?? undefined,
      };
    });

    // Optionally fetch contacts (slower, use sparingly)
    if (withContacts) {
      const withContactData = await Promise.all(
        enriched.map(async (deal) => ({
          ...deal,
          contacts: await fetchContactsForDeal(deal.id),
        }))
      );
      return NextResponse.json({ deals: withContactData });
    }

    return NextResponse.json({ deals: enriched });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
