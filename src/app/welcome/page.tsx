'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

const VIcon = () => (
    <svg
      width="32"
      height="32"
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

export default function WelcomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);
    
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="p-4 md:p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <VIcon />
                    <span className="font-bold text-lg">CandleWeb</span>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="max-w-3xl">
                    <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        Create &amp; Share AI-Powered Birthday Wishes
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Never be at a loss for words. Generate heartfelt, witty, or humorous birthday messages and create beautiful, animated websites to celebrate friends and loved ones.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/auth" passHref>
                            <Button size="lg" className="rounded-full font-semibold text-lg py-7 px-8 group">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <footer className="text-center p-6 text-sm text-muted-foreground">
                © {new Date().getFullYear()} CandleWeb. All Rights Reserved.
            </footer>
        </div>
    );
}
