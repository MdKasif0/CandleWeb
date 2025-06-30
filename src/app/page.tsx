
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
import { Loader2, Cake } from 'lucide-react';
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
    { name: 'Gold Luxe', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'gold luxury' },
    { name: 'Balloons', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'balloons party' },
    { name: 'Retro Pop', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'retro popart' },
];

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
                    <Link href="/templates" className="block">
                        <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-0.5 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
                            <div className="bg-[#191428] rounded-[14px] p-4 flex items-center gap-4">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                                    <Cake className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-white text-lg">Create New Wish</p>
                                    <p className="text-sm text-white/70">Start a New Wish Page</p>
                                </div>
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
                                            wish.status === 'Published' ? "bg-yellow-900/50 text-yellow-300" : "bg-purple-900/50 text-purple-300"
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
                            <Link href="/templates" key={template.name}>
                                <Card className="aspect-[4/3] rounded-xl overflow-hidden relative group border-0">
                                    <Image src={template.imageUrl} alt={template.name} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-110" data-ai-hint={template.dataAiHint} />
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
