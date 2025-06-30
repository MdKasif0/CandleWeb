
'use server';

import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  const {scheduleAt, toName, wishId, playerId} = await request.json();

  const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

  if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
    console.error("OneSignal credentials not configured on the server. Ensure NEXT_PUBLIC_ONESIGNAL_APP_ID and ONESIGNAL_API_KEY are set in your deployment environment.");
    return NextResponse.json(
      {error: 'Notification service is not configured on the server.'},
      {status: 500}
    );
  }

  // Use the request URL to determine the base URL, providing a fallback for safety.
  const requestUrl = new URL(request.url);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin).replace(/\/$/, '');
  
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

    if (!response.ok || data.errors) {
      console.error('OneSignal Error:', data.errors || `Status: ${response.status}`);
      return NextResponse.json(
        {error: `Failed to schedule notification: ${data.errors ? data.errors[0] : 'Unknown error from OneSignal'}`},
        {status: response.status}
      );
    }

    return NextResponse.json({success: true, notificationId: data.id});
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return NextResponse.json(
      {error: 'An unexpected error occurred while contacting the notification service.'},
      {status: 500}
    );
  }
}
