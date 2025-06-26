'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift } from 'lucide-react';
import AnimatedTemplate from '@/app/templates/AnimatedTemplate';
import Image from 'next/image';

export default function WishPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();

  // In a real app, you would fetch this data from a database using params.id
  // For now, we get it from URL search parameters.
  const wishData = {
    toName: searchParams.get('toName') || 'Someone',
    fromName: searchParams.get('fromName') || 'A friend',
    message: searchParams.get('message') || 'Happy Birthday!',
    imageUrl: searchParams.get('imageUrl'),
    template: searchParams.get('template') || 'modern',
  };

  if (wishData.template === 'funky') {
    return <AnimatedTemplate {...wishData} />;
  }

  // Default to a card-based template for 'modern' and 'classic'
  const isClassic = wishData.template === 'classic';

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-4 ${isClassic ? 'font-serif bg-yellow-50' : 'bg-gray-50'}`}>
        <Card className="w-full max-w-2xl text-center shadow-2xl overflow-hidden">
            <CardHeader className={`p-8 ${isClassic ? 'bg-amber-100' : 'bg-secondary'}`}>
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                    <Gift className="h-8 w-8" />
                </div>
                <CardTitle className={`text-4xl font-bold ${isClassic ? 'font-serif' : 'font-sans'}`}>Happy Birthday, {wishData.toName}!</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6 bg-card">
                {wishData.imageUrl && (
                    <div className="flex justify-center">
                        <Image 
                            data-ai-hint="birthday person"
                            src={wishData.imageUrl} 
                            alt="Birthday" 
                            width={500}
                            height={500}
                            className="rounded-lg shadow-md max-h-80 w-auto object-cover" 
                        />
                    </div>
                )}
                <blockquote className="text-xl text-muted-foreground leading-relaxed border-l-4 pl-4 italic">
                    {wishData.message}
                </blockquote>
                <p className="text-right text-lg font-semibold">- {wishData.fromName}</p>
            </CardContent>
             <CardFooter className="flex-col gap-4 p-6 bg-muted/50">
                <Button asChild>
                    <Link href="/create">Create Another Wish</Link>
                </Button>
                 <p className="text-xs text-muted-foreground">Wish ID: {params.id}</p>
            </CardFooter>
        </Card>
    </main>
  );
}
