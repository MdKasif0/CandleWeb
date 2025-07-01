
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export const dynamic = 'force-dynamic';

const mockTemplates = [
    {
        id: 'night-sky',
        name: 'Night Sky',
        description: 'A dreamy, animated night scene with a moon, cake, and a special gift.',
        imageUrl: '/night-sky-cover.png',
        dataAiHint: 'night sky cake'
    },
    {
        id: 'premium-night-sky',
        name: 'Premium Night Sky',
        description: 'A highly animated and interactive birthday experience with fireworks and audio.',
        imageUrl: '/premium-night-sky-cover.png',
        dataAiHint: 'fireworks celebration audio'
    },
    {
        id: 'celestial-wishes',
        name: 'Celestial Wishes',
        description: 'A magical, animated birthday webpage that feels like a digital gift.',
        imageUrl: '/celestial-wishes-cover.png',
        dataAiHint: 'celestial gift box'
    },
];

export default function TemplatesPage() {
    const auth = useRequireAuth();

    if (auth.loading || !auth.user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="bg-background text-foreground min-h-screen font-sans relative">
            <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} data-ai-hint="twinkling stars"></div>
            <div className="relative z-10 p-4 md:p-6 max-w-4xl mx-auto pb-24">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <span className="font-serif text-2xl text-foreground italic">Candle Web</span>
                    <UserNav />
                </header>

                {/* Page Title */}
                <section className="mb-8">
                    <h1 className="text-3xl font-bold mb-1 text-foreground">Select a Template</h1>
                    <p className="text-muted-foreground">Easy to customise, no code required. Pick one to get started.</p>
                </section>
                
                {/* Template List */}
                <section>
                    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                        {mockTemplates.map((template) => {
                            const previewParams = new URLSearchParams({
                                toName: 'Someone',
                                fromName: 'Your Friend',
                                message: 'Wishing you a day filled with happiness and a year filled with joy. Happy birthday!',
                                // Premium fields
                                closingMessages: "Wishing you all the best!\nMay all your dreams come true!\nCheers to you!",
                                secretMessage: "Here's to another amazing year! 🤫",
                                blowCandlesInstruction: "Make a wish and blow the candles",
                                wishYouTheBestMessage: "Wishing you the best!",
                                letsBlowCandlesTitle: "Ready to make a wish?",
                                thanksForWatchingTitle: "Thanks for watching!",
                                didYouLikeItMessage: "Hope you liked it!",
                                endMessage: "The End",
                                // Celestial Wishes fields
                                specialGiftMessage: 'May every moment of your special day be filled with the same joy and happiness you bring to others!',
                                saveKeepsakeMessage: 'Save this memory forever.'
                            });

                            let previewUrl;
                            if (template.id === 'premium-night-sky' || template.id === 'celestial-wishes') {
                                previewUrl = `/templates/${template.id}/index.html?${previewParams.toString()}`;
                            } else {
                                previewParams.append('template', template.id);
                                previewUrl = `/wish/preview?${previewParams.toString()}`;
                            }
                            
                            return (
                                <Card key={template.id} className="bg-card border shadow-lg overflow-hidden group transition-all hover:shadow-primary/20 hover:-translate-y-1 duration-300">
                                    <CardContent className="p-4">
                                        <div className="aspect-video w-full rounded-md overflow-hidden mb-4 border">
                                            <Image
                                                src={template.imageUrl}
                                                alt={template.name}
                                                width={600}
                                                height={400}
                                                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                data-ai-hint={template.dataAiHint}
                                            />
                                        </div>
                                        <h2 className="text-lg font-semibold text-card-foreground">{template.name}</h2>
                                        <p className="text-sm text-muted-foreground">{template.description}</p>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 px-4 py-3 flex gap-2">
                                        <Link href={previewUrl} passHref className="w-full" target="_blank">
                                            <Button variant="outline" className="w-full rounded-full">Preview</Button>
                                        </Link>
                                        <Link href={`/create?template=${template.id}`} passHref className="w-full">
                                            <Button className="w-full font-semibold shadow-md shadow-primary/10 rounded-full">Use Template</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </section>
                
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-card p-3 mb-4 border">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">More templates coming soon!</h3>
                    <p className="text-muted-foreground mt-1 text-sm">We're working hard to bring you more amazing designs. Stay tuned!</p>
                </div>

            </div>
            
            <BottomNavBar />
        </div>
    );
}
