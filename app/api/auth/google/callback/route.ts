import { NextResponse } from 'next/server';
import { getOAuth2Client, saveTokens } from '@/lib/google';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code returned from Google' }, { status: 400 });
  }

  try {
    const oauth2 = getOAuth2Client();
    const { tokens } = await oauth2.getToken(code);
    saveTokens(tokens as Record<string, unknown>);

    // Redirect back to dashboard with success flag
    return NextResponse.redirect('http://localhost:3000/?calendar=connected');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
