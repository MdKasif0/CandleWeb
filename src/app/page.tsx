'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid, Layers, MoreHorizontal, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import React, { useState, useEffect } from 'react';

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

interface Wish {
    id: string;
    toName: string;
    status: string;
}

export default function DashboardPage() {
    const [wishes, setWishes] = useState<Wish[]>([]);

    useEffect(() => {
        const storedWishes = JSON.parse(localStorage.getItem('userWishes') || '[]');
        setWishes(storedWishes);
    }, []);

    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
            <div className="p-4 md:p-6 max-w-lg mx-auto pb-24">
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
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="@user" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Greeting */}
                <section className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Hi Paulo</h1>
                    <p className="text-muted-foreground">Here are your sites</p>
                </section>

                {/* Action Card */}
                <section className="mb-8">
                    <Link href="/templates" passHref>
                        <Card className="p-4 bg-gradient-to-br from-green-400 to-teal-400 transition-all cursor-pointer group">
                            <CardContent className="flex items-center gap-4 p-0">
                                <Sparkles className="h-8 w-8 text-accent-foreground" />
                                <h2 className="font-semibold text-accent-foreground">Choose a Template and Create with AI</h2>
                            </CardContent>
                        </Card>
                    </Link>
                </section>

                {/* Wish List */}
                <section>
                    {wishes.length > 0 ? (
                        <div className="space-y-3">
                            {wishes.map((wish) => (
                                <Card key={wish.id} className="bg-card p-3 border-border/50">
                                    <CardContent className="flex items-center justify-between p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-background p-2 rounded-lg">
                                                <VIcon />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-card-foreground">Wish for {wish.toName}</h3>
                                                <p className="text-sm text-muted-foreground">Free &bull; {wish.status}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <Card className="bg-card p-6 border-border/50 text-center">
                            <CardContent className="p-0 flex flex-col items-center">
                                <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold text-card-foreground mb-2">No Websites Built Yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">Get started by choosing a template and creating your first wish!</p>
                                <Link href="/templates" passHref>
                                    <Button>Create a Website</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
            
            {/* Bottom Navigation */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border">
                <div className="flex justify-around items-center h-16">
                    <Link href="/" className="flex flex-col items-center gap-1 text-primary">
                        <LayoutGrid className="h-6 w-6" />
                        <span className="text-xs font-medium">Dashboard</span>
                    </Link>
                    <Link href="/templates" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                        <Layers className="h-6 w-6" />
                        <span className="text-xs font-medium">Templates</span>
                    </Link>
                </div>
            </footer>
        </div>
    );
}
