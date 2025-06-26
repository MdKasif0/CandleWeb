import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cake, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <main className="flex min-h-screen flex-col items-center justify-between p-8 text-center z-10 relative">
        <header className="flex items-center gap-2 self-start">
          <Cake className="h-7 w-7 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Birthday Wish</h2>
        </header>

        <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[350px] mb-8">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-fuchsia-500 rounded-3xl blur-xl opacity-30"></div>
              <Image
                src="https://placehold.co/350x700"
                alt="App Preview"
                width={350}
                height={700}
                className="relative rounded-3xl border-4 border-gray-800 shadow-2xl shadow-primary/20"
                data-ai-hint="birthday card mobile"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Create Personalized <br /> Birthday Websites
            </h1>
            <p className="max-w-md text-lg text-muted-foreground mb-8">
              Surprise your loved ones with a unique, interactive birthday card they'll never forget.
            </p>

            <Button asChild size="lg" className="w-64 h-14 text-lg font-semibold relative overflow-hidden group bg-gradient-to-r from-primary to-fuchsia-500 hover:from-primary/90 hover:to-fuchsia-500/90 transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40">
                <Link href="/create" className="flex items-center gap-2">
                  Create a free Wish
                  <Sparkles className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                </Link>
            </Button>
        </div>

        <footer className="w-full">
            <p className="text-sm text-muted-foreground">
                Easy, fast, and free!
            </p>
        </footer>
      </main>
    </div>
  );
}
