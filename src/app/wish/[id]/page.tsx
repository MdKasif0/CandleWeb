'use client';

import { useSearchParams } from 'next/navigation';
import NightSkyTemplate from '@/app/templates/night-sky/NightSkyTemplate';

export default function WishPage() {
  const searchParams = useSearchParams();

  const toName = searchParams.get('toName') || 'Someone';
  const fromName = searchParams.get('fromName') || 'A friend';
  const message = searchParams.get('message') || 'Happy Birthday!';
  const template = searchParams.get('template') || 'night-sky'; // Default to night-sky

  const props = { toName, fromName, message };

  switch (template) {
    case 'night-sky':
      return <NightSkyTemplate {...props} />;
    // Add other templates here in the future
    // case 'other-template':
    //   return <OtherTemplateComponent {...props} />;
    default:
      return <div>Template not found.</div>;
  }
}
