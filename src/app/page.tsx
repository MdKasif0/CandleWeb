import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutGrid, Layers, MoreHorizontal, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

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

const mockWishes = [
    {
        id: '1',
        name: 'Fintech Website',
        status: 'Unpublished',
        icon: <VIcon />,
    },
    {
        id: '2',
        name: 'E-commerce Website',
        status: 'Unpublished',
        icon: <VIcon />,
    },
];

export default function DashboardPage() {
    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
            <div className="p-4 md:p-6 max-w-lg mx-auto pb-24">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <VIcon />
                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <Link href="/upgrade" passHref>
                          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full px-4 py-1.5 text-sm h-auto shadow-lg shadow-primary/20">
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
                        <Card className="bg-card p-4 border border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.1)] hover:border-primary/60 transition-all cursor-pointer group">
                            <CardContent className="flex items-center gap-4 p-0">
                                <Sparkles className="h-8 w-8 text-primary" />
                                <h2 className="font-semibold text-card-foreground">Choose a Template and Create with AI</h2>
                            </CardContent>
                        </Card>
                    </Link>
                </section>

                {/* Wish List */}
                <section>
                    <div className="space-y-3">
                        {mockWishes.map((wish) => (
                            <Card key={wish.id} className="bg-card p-3 border-border/50">
                                <CardContent className="flex items-center justify-between p-0">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-background p-2 rounded-lg">
                                            {wish.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-card-foreground">{wish.name}</h3>
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
