'use client';

import { useSearchParams } from 'next/navigation';
import AnimatedTemplate from '@/app/templates/AnimatedTemplate';

export default function WishPage() {
  const searchParams = useSearchParams();

  // For now, we get it from URL search parameters.
  const wishData = {
    toName: searchParams.get('toName') || 'Someone',
    fromName: searchParams.get('fromName') || 'A friend',
    message: searchParams.get('message') || 'Happy Birthday!',
    imageUrl: searchParams.get('imageUrl'),
  };

  return <AnimatedTemplate {...wishData} />;
}
