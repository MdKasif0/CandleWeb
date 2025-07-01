
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRequireAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Wish {
    id: string;
    toName: string;
    fromName: string;
    message: string;
    template: string;
    status: string;
    createdAt: string;
}

const popularTemplates = [
    {
        id: 'night-sky',
        name: 'Night Sky',
        imageUrl: '/night-sky-cover.png',
        dataAiHint: 'night sky cake'
    },
    {
        id: 'premium-night-sky',
        name: 'Premium Night Sky',
        imageUrl: '/premium-night-sky-cover.png',
        dataAiHint: 'fireworks celebration'
    },
    {
        id: 'celestial-wishes',
        name: 'Celestial Wishes',
        imageUrl: '/celestial-wishes-cover.png',
        dataAiHint: 'celestial gift'
    },
];

const CupcakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Sparkles */}
        <path d="M15.5 4.5L15.8536 5.14645L16.5 5.5L15.8536 5.85355L15.5 6.5L15.1464 5.85355L14.5 5.5L15.1464 5.14645L15.5 4.5Z" fill="#F472B6"/>
        <path d="M8 6L8.35355 6.64645L9 7L8.35355 7.35355L8 8L7.64645 7.35355L7 7L7.64645 6.64645L8 6Z" fill="#F472B6"/>
        {/* Flame */}
        <path d="M12.35 5.08a.5.5 0 0 0-.7 0C11.45 5.28 11.6 5.6 11.85 5.94c.26.34.7.78.7.78s1.08-1.04 1.08-1.72c0-.44-.36-.8-.8-.8-.32 0-.6.18-.88.4Z" fill="white"/>
        {/* Candle */}
        <rect x="11.25" y="7" width="1.5" height="3" rx="0.75" fill="#F9A8D4"/>
        {/* Frosting */}
        <path d="M18.5 10C18.5 10 19.5 11 19.5 13C19.5 15 18 16 16.5 16C16.5 16 16.5 18 14.5 18H9.5C7.5 18 7.5 16 7.5 16C6 16 4.5 15 4.5 13C4.5 11 5.5 10 5.5 10H18.5Z" fill="#F472B6"/>
        {/* Base */}
        <path d="M7 15.5H17L16 20H8L7 15.5Z" fill="#D946EF"/>
        {/* Eyes */}
        <circle cx="9.5" cy="14" r="0.75" fill="#4C1D95"/>
        <circle cx="14.5" cy="14" r="0.75" fill="#4C1D95"/>
    </svg>
);

export default function DashboardPage() {
    const auth = useRequireAuth();
    const [wishes, setWishes] = useState<Wish[]>([]);

    useEffect(() => {
        try {
            const storedWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
            setWishes(storedWishes);
        } catch (error) {
            console.error("Could not parse wishes from local storage", error);
            setWishes([]);
        }
    }, []);
    
    if (auth.loading || !auth.user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const templateImages: { [key: string]: string } = {
        'night-sky': '/night-sky-cover.png',
        'premium-night-sky': '/premium-night-sky-cover.png',
        'celestial-wishes': '/celestial-wishes-cover.png',
    };

    return (
        <div className="bg-background text-foreground min-h-screen font-sans relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} data-ai-hint="twinkling stars"></div>
             <div className="relative z-10 p-4 md:p-6 max-w-2xl mx-auto pb-24">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <span className="font-serif text-2xl text-white italic">Candle Web</span>
                    <UserNav />
                </header>

                {/* Greeting */}
                <section className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-white">Hey {auth.user.displayName?.split(' ')[0] || 'friend'}, ready to craft some birthday magic?</h1>
                    <p className="text-muted-foreground text-lg">Let's create a wish page that makes their day unforgettable.</p>
                </section>

                {/* Action Card */}
                <section className="mb-10">
                    <Link href="/templates" className="block group">
                        <div className="rounded-2xl bg-gradient-to-r from-fuchsia-800 via-purple-900 to-indigo-950 p-4 flex items-center gap-4 border border-fuchsia-500/50 shadow-[0_0_20px_rgba(192,132,252,0.2)] transition-all duration-300 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_30px_rgba(192,132,252,0.4)]">
                            <CupcakeIcon className="w-12 h-12 flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="font-bold text-neutral-100 text-lg">Create New Wish</p>
                                <p className="text-sm text-neutral-300">Start a New Wish Page</p>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* Recent Wishes List */}
                <section className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-primary">Your Recent Wishes</h2>
                    </div>

                    {wishes.length > 0 ? (
                        <div className="space-y-3">
                            {wishes.slice(0, 2).map((wish) => {
                                const isValidDate = wish.createdAt && !isNaN(new Date(wish.createdAt).getTime());
                                const imageUrl = templateImages[wish.template] || 'https://placehold.co/80x80.png';
                                return (
                                <Card key={wish.id} className="bg-foreground/5 p-3 border-transparent transition-all hover:bg-foreground/10">
                                    <CardContent className="flex items-center justify-between p-0 gap-4">
                                        <Image
                                            src={imageUrl}
                                            alt={wish.toName}
                                            width={56}
                                            height={56}
                                            className="w-14 h-14 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-white text-lg">{wish.toName}</h3>
                                            <p className="text-sm text-muted-foreground">{isValidDate ? format(new Date(wish.createdAt), "MMM d, yyyy") : 'Date not available'}</p>
                                        </div>
                                         <Badge className={cn(
                                            "capitalize border-none",
                                            wish.status === 'Published' ? "bg-yellow-900/50 text-yellow-300" :
                                            wish.status === 'Scheduled' ? "bg-blue-900/50 text-blue-300" :
                                            "bg-purple-900/50 text-purple-300"
                                        )}>{wish.status}</Badge>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                         <Card className="bg-foreground/5 p-6 border-transparent text-center">
                            <CardContent className="p-0 flex flex-col items-center">
                                <h3 className="font-semibold text-white mb-2">No CandleWebs Built Yet</h3>
                                <p className="text-sm text-muted-foreground">You can start by creating a new wish.</p>
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Popular Templates */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-4">Popular Templates</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {popularTemplates.map(template => (
                            <Link href={`/templates?template=${template.id}`} key={template.name}>
                                <Card className="aspect-[4/3] rounded-xl overflow-hidden relative group border-0">
                                    <Image src={template.imageUrl} alt={template.name} fill className="object-cover transition-transform duration-300 group-hover:scale-110" data-ai-hint={template.dataAiHint} />
                                    <div className="absolute inset-0 bg-black/40 flex items-end p-2 justify-center text-center">
                                        <h3 className="font-bold text-white text-base leading-tight">{template.name}</h3>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
            
            <BottomNavBar />
        </div>
    );
}
