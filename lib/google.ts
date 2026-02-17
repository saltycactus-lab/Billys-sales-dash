import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const TOKEN_PATH = path.join(process.cwd(), '.google-token.json');

export function getOAuth2Client() {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri  = process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function loadSavedTokens(): Record<string, unknown> | null {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveTokens(tokens: Record<string, unknown>) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

export async function getAuthedClient() {
  const oauth2 = getOAuth2Client();
  const tokens = loadSavedTokens();
  if (!tokens) return null;
  oauth2.setCredentials(tokens);

  // Auto-refresh if needed
  if (tokens.expiry_date && (tokens.expiry_date as number) < Date.now()) {
    const { credentials } = await oauth2.refreshAccessToken();
    saveTokens(credentials as Record<string, unknown>);
    oauth2.setCredentials(credentials);
  }

  return oauth2;
}

export async function fetchCalendarEvents(startMs: number, endMs: number) {
  const auth = await getAuthedClient();
  if (!auth) return { events: [], needsAuth: true };

  const calendar = google.calendar({ version: 'v3', auth });

  // Fetch from all specified calendars
  const calendarIds = [
    { id: 'primary', name: 'My Calendar', color: '#c9a84c' },
    // Second calendar ID will be added via env var
    ...(process.env.GOOGLE_CALENDAR_ID_2
      ? [{ id: process.env.GOOGLE_CALENDAR_ID_2, name: process.env.GOOGLE_CALENDAR_NAME_2 ?? 'Calendar 2', color: '#9b7fe8' }]
      : []),
  ];

  const allEvents = await Promise.all(
    calendarIds.map(async ({ id, name, color }) => {
      try {
        const res = await calendar.events.list({
          calendarId: id,
          timeMin: new Date(startMs).toISOString(),
          timeMax: new Date(endMs).toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        });

        return (res.data.items ?? []).map((e) => ({
          id: e.id ?? '',
          title: e.summary ?? '(No title)',
          start: e.start?.dateTime ?? e.start?.date ?? '',
          end: e.end?.dateTime ?? e.end?.date ?? '',
          calendarName: name,
          calendarColor: color,
          location: e.location ?? undefined,
          description: e.description ?? undefined,
          htmlLink: e.htmlLink ?? undefined,
        }));
      } catch {
        return [];
      }
    })
  );

  return { events: allEvents.flat(), needsAuth: false };
}
