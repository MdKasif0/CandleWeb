import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LayoutGrid, Layers } from 'lucide-react';
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

const mockTemplates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'A sleek, modern design for a stylish wish.',
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'website template modern'
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'A timeless, classic look for an elegant message.',
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'website template classic'
    },
    {
        id: 'funky',
        name: 'Funky (Animated)',
        description: 'A fun, animated experience with music.',
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'website template funky'
    },
];

export default function TemplatesPage() {
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

                {/* Page Title */}
                <section className="mb-8">
                    <h1 className="text-3xl font-bold mb-1">Templates</h1>
                    <p className="text-muted-foreground">Easy to customise, no code required</p>
                </section>
                
                {/* Template List */}
                <section>
                    <div className="space-y-6">
                        {mockTemplates.map((template) => (
                            <Card key={template.id} className="bg-card border-border/50 shadow-lg overflow-hidden transition-all hover:border-primary/30 hover:shadow-primary/10">
                                <CardContent className="p-4">
                                    <div className="aspect-video w-full rounded-md overflow-hidden mb-4 border border-border/50">
                                        <Image
                                            src={template.imageUrl}
                                            alt={template.name}
                                            width={600}
                                            height={400}
                                            className="w-full h-full object-cover"
                                            data-ai-hint={template.dataAiHint}
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold text-card-foreground">{template.name}</h2>
                                    <p className="text-sm text-muted-foreground">{template.description}</p>
                                </CardContent>
                                <CardFooter className="bg-card/50 px-4 py-3 flex gap-2">
                                    <Button variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/10 rounded-full">Preview</Button>
                                    <Link href={`/create?template=${template.id}`} passHref className="w-full">
                                        <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-md shadow-primary/10 rounded-full">Use Template</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
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
