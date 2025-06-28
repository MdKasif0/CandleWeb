
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

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

export default function WelcomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);
    
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a113c] to-[#0c0c2e] text-white overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} data-ai-hint="twinkling stars"></div>
            
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="p-4 md:p-6 flex justify-between items-center w-full max-w-6xl mx-auto">
                    <div className="flex items-center gap-2">
                        <VIcon />
                        <span className="font-bold text-lg">CandleWeb</span>
                    </div>
                </header>
                <main className="flex-1 flex flex-col items-center justify-end text-center p-4">
                    <div className="relative -mb-16 md:-mb-24 w-full max-w-sm">
                         <Image
                            src="https://placehold.co/400x800.png"
                            alt="CandleWeb App Preview"
                            width={400}
                            height={800}
                            className="w-full h-auto object-contain"
                            data-ai-hint="app screenshot phone"
                            priority
                        />
                    </div>
                    <div className="w-full bg-gradient-to-t from-[#0c0c2e] via-[#0c0c2e] to-transparent pt-24 pb-8">
                         <div className="max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                Create birthday wishes 10x faster with AI
                            </h1>
                            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                                Make your next wish in a snap. CandleWeb is easy, fast, and free!
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/auth" passHref className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full sm:w-auto rounded-full font-semibold text-lg py-6 px-8 group bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90">
                                        Create free Site
                                        <Sparkles className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                         </div>
                    </div>
                </main>
                <footer className="text-center p-6 text-sm">
                    <p className="text-white/60">Already have an account? <Link href="/auth" className="font-semibold text-white hover:underline">Sign in</Link></p>
                </footer>
            </div>
        </div>
    );
}
