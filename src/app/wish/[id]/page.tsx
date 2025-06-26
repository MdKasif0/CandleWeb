import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift } from 'lucide-react';

export default function WishPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the wish data from your database using the params.id
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Gift className="h-6 w-6" />
          </div>
          <CardTitle>Birthday Wish Page</CardTitle>
          <CardDescription>Wish ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is where the personalized birthday website will be displayed.
            The content you entered in the form would appear here, styled according to the template you selected.
          </p>
          <Button asChild className="mt-6">
            <Link href="/create">Create Another Wish</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
