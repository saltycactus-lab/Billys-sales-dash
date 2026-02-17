import { NextResponse } from 'next/server';
import { fetchDealById, fetchContactsForDeal } from '@/lib/hubspot';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deal, contacts] = await Promise.all([
      fetchDealById(id),
      fetchContactsForDeal(id),
    ]);
    return NextResponse.json({ deal: { ...deal, contacts } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
