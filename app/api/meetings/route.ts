import { NextResponse } from 'next/server';
import { fetchMeetingsInRange, fetchDealForMeeting, fetchDealById } from '@/lib/hubspot';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ error: 'start and end query params required' }, { status: 400 });
    }

    const meetings = await fetchMeetingsInRange(Number(start), Number(end));

    // For each meeting, try to find its associated deal
    const enriched = await Promise.all(
      meetings.map(async (meeting) => {
        const dealId = await fetchDealForMeeting(meeting.id);
        if (!dealId) return meeting;
        try {
          const deal = await fetchDealById(dealId);
          return { ...meeting, dealId, deal };
        } catch {
          return { ...meeting, dealId };
        }
      })
    );

    return NextResponse.json({ meetings: enriched });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
