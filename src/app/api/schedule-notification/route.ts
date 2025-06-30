
'use server';

import 'dotenv/config'; // Make sure environment variables are loaded for local dev
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const {scheduleAt, toName, wishId, playerId} = await request.json();

  const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
    console.error("OneSignal credentials not found. Make sure they are set in your .env file for local development.");
    return NextResponse.json(
      {error: 'OneSignal credentials not configured on the server.'},
      {status: 500}
    );
  }

  // Ensure the URL is correctly formed.
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002').replace(/\/$/, '');
  
  const notification = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: [playerId],
    headings: {en: `It's ${toName}'s Birthday!`},
    contents: {en: `Time to send your CandleWeb wish. Tap to open.`},
    url: `${appUrl}/wish/${wishId}`,
    send_after: new Date(scheduleAt).toUTCString(),
  };

  try {
    const response = await fetch(
      'https://api.onesignal.com/api/v1/notifications',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
        body: JSON.stringify(notification),
      }
    );

    const data = await response.json();

    if (data.errors) {
      console.error('OneSignal Error:', data.errors);
      return NextResponse.json(
        {error: `Failed to schedule notification: ${data.errors[0]}`},
        {status: 500}
      );
    }

    return NextResponse.json({success: true, notificationId: data.id});
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return NextResponse.json(
      {error: 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
