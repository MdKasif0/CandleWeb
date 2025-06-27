import type { Metadata } from 'next';
import NightSkyTemplate from '@/app/templates/night-sky/NightSkyTemplate';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const toName = (searchParams.toName as string) || 'Someone';
  const fromName = (searchParams.fromName as string) || 'A friend';

  const title = `A Birthday Wish for ${toName}!`;
  const description = `A special birthday message for ${toName} from ${fromName}. Create your own at CandleWeb!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: 'https://placehold.co/1200x630.png',
          width: 1200,
          height: 630,
          alt: `A birthday wish for ${toName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://placehold.co/1200x630.png'],
    },
  };
}

export default function WishPage({ searchParams }: Props) {
  const toName = (searchParams.toName as string) || 'Someone';
  const fromName = (searchParams.fromName as string) || 'A friend';
  const message = (searchParams.message as string) || 'Happy Birthday!';
  const template = (searchParams.template as string) || 'night-sky';

  const props = { toName, fromName, message };

  switch (template) {
    case 'night-sky':
      return <NightSkyTemplate {...props} />;
    default:
      return <div>Template not found.</div>;
  }
}
