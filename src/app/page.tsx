import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Rocket className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Personalized Birthday Websites</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Create a unique and memorable birthday wish in just a few clicks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            Choose a template, add your personal touch with messages and photos, and we'll generate a special webpage for the birthday person.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" size="lg">
            <Link href="/create">Start Creating Now</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
