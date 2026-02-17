import { NextResponse } from 'next/server';
import { fetchPipelines } from '@/lib/hubspot';

export async function GET() {
  try {
    const pipelines = await fetchPipelines();
    return NextResponse.json({ pipelines });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
