import { NextResponse } from 'next/server';
import { fetchCalendarEvents } from '@/lib/google';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end   = searchParams.get('end');

  if (!start || !end) {
    return NextResponse.json({ error: 'start and end params required' }, { status: 400 });
  }

  try {
    const result = await fetchCalendarEvents(Number(start), Number(end));
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
