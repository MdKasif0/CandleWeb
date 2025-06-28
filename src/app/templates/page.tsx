
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LayoutGrid, Layers, Sparkles, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRequireAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';

const VIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M6.7901 3.39001L12.0001 13L17.2101 3.39001H21.0001L12.0001 21L3.0001 3.39001H6.7901Z"
        fill="currentColor"
      />
    </svg>
  );

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
        <div className="bg-background text-foreground min-h-screen font-sans">
            <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <VIcon />
                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <Link href="/upgrade" passHref>
                          <Button className="bg-accent text-accent-foreground font-semibold rounded-full px-4 py-1.5 text-sm h-auto shadow-lg shadow-accent/20">
                              Upgrade
                          </Button>
                        </Link>
                        <UserNav />
                    </div>
                </header>

                {/* Page Title */}
                <section className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Templates</h1>
                    <p className="text-muted-foreground">Easy to customise, no code required</p>
                </section>
                
                {/* Template List */}
                <section>
                    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                        {mockTemplates.map((template) => {
                            const previewParams = new URLSearchParams({
                                toName: 'Someone',
                                fromName: 'Your Friend',
                                message: 'Wishing you a day filled with happiness and a year filled with joy. Happy birthday!',
                            });

                            let previewUrl;
                            if (template.id === 'premium-night-sky') {
                                previewUrl = `/premium-night-sky/index.html?${previewParams.toString()}`;
                            } else if (template.id === 'celestial-wishes') {
                                previewUrl = `/celestial-wishes/celestial-wishes.html?${previewParams.toString()}`;
                            }
                            else {
                                previewParams.append('template', template.id);
                                previewUrl = `/wish/preview?${previewParams.toString()}`;
                            }
                            
                            return (
                                <Card key={template.id} className="bg-card border-border/50 shadow-lg overflow-hidden group transition-all hover:shadow-primary/20 hover:-translate-y-1 duration-300">
                                    <CardContent className="p-4">
                                        <div className="aspect-video w-full rounded-md overflow-hidden mb-4 border border-border/50">
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
                                    <CardFooter className="bg-card/50 px-4 py-3 flex gap-2">
                                        <Link href={previewUrl} passHref className="w-full" target="_blank">
                                            <Button variant="outline" className="w-full bg-transparent border-input hover:bg-secondary rounded-full">Preview</Button>
                                        </Link>
                                        <Link href={`/create?template=${template.id}`} passHref className="w-full">
                                            <Button className="w-full bg-accent text-accent-foreground font-semibold shadow-md shadow-accent/10 rounded-full">Use Template</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </section>
                
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-secondary p-3 mb-4">
                        <Sparkles className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">More templates coming soon!</h3>
                    <p className="text-muted-foreground mt-1 text-sm">We're working hard to bring you more amazing designs. Stay tuned!</p>
                </div>

            </div>
            
            {/* Bottom Navigation */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border">
                <div className="flex justify-around items-center h-16">
                    <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <LayoutGrid className="h-6 w-6" />
                        <span className="text-xs font-medium">Dashboard</span>
                    </Link>
                    <Link href="/templates" className="flex flex-col items-center gap-1 text-primary">
                        <Layers className="h-6 w-6" />
                        <span className="text-xs font-medium">Templates</span>
                    </Link>
                </div>
            </footer>
        </div>
    );
}
